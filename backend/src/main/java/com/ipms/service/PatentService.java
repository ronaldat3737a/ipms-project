package com.ipms.service;

import com.ipms.dto.*;
import com.ipms.entity.*;
import com.ipms.entity.enums.*;
import com.ipms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityManager;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PatentService {

    private final ApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;
    private final AuthorRepository authorRepository;
    private final ClaimRepository claimRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EntityManager entityManager; 

    @Value("${upload.path:uploads/}")
    private String uploadPath;

    @Transactional(rollbackFor = Exception.class)
    @Deprecated
    public Application submitPatent(PatentSubmissionDTO dto, Long userId, MultipartFile[] files) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 1. Xử lý danh sách ipcCodes (Vì getIpcCodes() trả về List)
        List<String> ipcList = new ArrayList<>();
        if (dto.getIpcCodes() != null && !dto.getIpcCodes().isEmpty()) {
            // Dùng addAll vì dto.getIpcCodes() đã là một danh sách rồi
            ipcList.addAll(dto.getIpcCodes()); 
        }

        // 2. Đưa vào Builder
        Application app = Application.builder()
                .appType(mapAppType(dto.getAppType()))
                .title(dto.getTitle())
                .solutionDetail(dto.getSolutionDetail())
                .solutionType(mapSolutionType(dto.getSolutionType()))
                .technicalField(dto.getTechnicalField())
                .ipcCodes(ipcList) // Gán danh sách đã xử lý
                .summary(dto.getSummary())
                .filingBasis(FilingBasis.TRUC_TUYEN)
                .user(currentUser)
                .status(AppStatus.CHO_NOP_PHI_GD1)
                .build();

        app = applicationRepository.save(app);
        // ... giữ nguyên phần sau
        applicationRepository.flush(); // Lệnh 1: Ép lưu xuống DB ngay để Trigger sinh mã app_no
        entityManager.refresh(app);    // Lệnh 2: Đọc lại đơn từ DB để lấy mã app_no vừa sinh gán vào đối tượng Java

        // 3. Lưu thông tin Chủ đơn (Lấy trực tiếp từ dữ liệu PHẲNG của DTO)
        Applicant owner = Applicant.builder()
                .application(app)
                .type("Cá nhân".equals(dto.getOwnerType()) ? ApplicantType.CA_NHAN : ApplicantType.TO_CHUC)
                .fullName(dto.getOwnerName())
                .idNumber(dto.getOwnerId())
                .address(dto.getOwnerAddress())
                .phone(dto.getOwnerPhone())
                .email(dto.getOwnerEmail())
                .repCode(dto.getOwnerRepCode())
                .build();
        applicantRepository.save(owner);

        // 4. Lưu danh sách Tác giả
        if (dto.getAuthors() != null) {
            for (int i = 0; i < dto.getAuthors().size(); i++) {
                AuthorDTO aDto = dto.getAuthors().get(i);
                Author author = Author.builder()
                        .application(app)
                        .fullName(aDto.getFullName())
                        .nationality(aDto.getNationality())
                        .idNumber(aDto.getIdNumber())
                        .orderIndex(i + 1)
                        .build();
                authorRepository.save(author);
            }
        }

        // 5. Lưu danh sách Điểm bảo hộ
        saveClaims(dto.getClaims(), app);

        // 6. Xử lý lưu FILE VẬT LÝ
        if (files != null && files.length > 0) {
            savePhysicalFiles(files, app, dto.getAttachments());
        }

        return app;
    }


    // ======================== FLOW MỚI THEO YÊU CẦU ========================

    @Transactional(rollbackFor = Exception.class)
    public Application createApplication(PatentSubmissionDTO dto, Long userId, MultipartFile[] files) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<String> ipcList = (dto.getIpcCodes() != null) ? new ArrayList<>(dto.getIpcCodes()) : new ArrayList<>();

        // 1. Tạo đơn với trạng thái MOI và appNo = null
        Application app = Application.builder()
                .appType(mapAppType(dto.getAppType()))
                .title(dto.getTitle())
                .solutionDetail(dto.getSolutionDetail())
                .solutionType(mapSolutionType(dto.getSolutionType()))
                .technicalField(dto.getTechnicalField())
                .ipcCodes(ipcList)
                .summary(dto.getSummary())
                .filingBasis(FilingBasis.TRUC_TUYEN)
                .user(currentUser)
                .status(AppStatus.MOI) // Trạng thái khởi tạo là MỚI
                .appNo(null) // appNo là null ở bước này
                .build();

        // SỬA LỖI: Khởi tạo các danh sách để quản lý quan hệ hai chiều
        app.setAuthors(new ArrayList<>());
        app.setClaims(new ArrayList<>());
        app.setAttachments(new ArrayList<>());

        // Lưu đơn chính để lấy ID
        app = applicationRepository.save(app);

        // 2. Lưu các thông tin liên quan (Chủ đơn, Tác giả, File, Yêu cầu bảo hộ)
        Applicant owner = Applicant.builder()
                .application(app)
                .type("Cá nhân".equals(dto.getOwnerType()) ? ApplicantType.CA_NHAN : ApplicantType.TO_CHUC)
                .fullName(dto.getOwnerName())
                .idNumber(dto.getOwnerId())
                .address(dto.getOwnerAddress())
                .phone(dto.getOwnerPhone())
                .email(dto.getOwnerEmail())
                .repCode(dto.getOwnerRepCode())
                .build();
        applicantRepository.save(owner);

        if (dto.getAuthors() != null) {
            for (int i = 0; i < dto.getAuthors().size(); i++) {
                AuthorDTO aDto = dto.getAuthors().get(i);
                Author author = Author.builder()
                        .application(app)
                        .fullName(aDto.getFullName())
                        .nationality(aDto.getNationality())
                        .idNumber(aDto.getIdNumber())
                        .orderIndex(i + 1)
                        .build();
                app.getAuthors().add(author); // Quản lý quan hệ 2 chiều
                authorRepository.save(author);
            }
        }

        saveClaims(dto.getClaims(), app);

        if (files != null && files.length > 0) {
            savePhysicalFiles(files, app, dto.getAttachments());
        }

        return app;
    }

    @Transactional
    public Application submitApplication(UUID applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn với ID: " + applicationId));

        // 1. Kiểm tra trạng thái hiện tại phải là MOI
        if (app.getStatus() != AppStatus.MOI) {
            throw new IllegalStateException("Chỉ có thể nộp đơn ở trạng thái MỚI.");
        }
        
        // TẠO PHÍ GIAI ĐOẠN 1 (Sử dụng PaymentService)
        paymentService.createFeeForStage1(app);

        // 2. Sinh appNo
        String appNo = generateAppNo(app.getAppType());
        app.setAppNo(appNo);

        // 3. Chuyển trạng thái sang CHO_NOP_PHI_GD1
        app.setStatus(AppStatus.CHO_NOP_PHI_GD1);

        // 4. Lưu lại
        return applicationRepository.save(app);
    }
    
    private String generateAppNo(AppType appType) {
        String prefix = (appType == AppType.SANG_CHE) ? "SC" : "GPHI";
        int year = Calendar.getInstance().get(Calendar.YEAR);
        
        // Cần phương thức count trong repository, sẽ được thêm ở bước sau
        long count = applicationRepository.countByAppTypeAndCreatedAtYear(appType, year);
        
        String sequence = String.format("%05d", count + 1);
        
        return prefix + year + sequence;
    }

    // =======================================================================


    private void savePhysicalFiles(MultipartFile[] files, Application app, List<AttachmentDTO> attachmentDtos) {
        try {
            Path root = Paths.get(uploadPath);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String originalFileName = file.getOriginalFilename();
                String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                
                Path targetLocation = root.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // SỬA LỖI 3 & 4: Sử dụng đúng giá trị Enum bạn đã cung cấp
                DocType type = DocType.BAN_MO_TA; // Dùng BAN_MO_TA làm mặc định thay vì KHAC
                FileCategory cat = FileCategory.TAI_LIEU_KY_THUAT; // Dùng TAI_LIEU_KY_THUAT thay vì KY_THUAT
                
                if (attachmentDtos != null) {
                    Optional<AttachmentDTO> match = attachmentDtos.stream()
                        .filter(d -> originalFileName != null && originalFileName.contains(d.getFileName()))
                        .findFirst();
                    if (match.isPresent()) {
                        try {
                            type = DocType.valueOf(match.get().getDocType());
                            cat = FileCategory.valueOf(match.get().getCategory());
                        } catch (IllegalArgumentException e) {
                            // Nếu map lỗi thì giữ giá trị mặc định
                        }
                    }
                }

                ApplicationAttachment attachment = ApplicationAttachment.builder()
                        .application(app)
                        .category(cat)
                        .docType(type)
                        .fileName(originalFileName)
                        .fileUrl(uniqueFileName)
                        // SỬA LỖI 5: Truyền kiểu Long trực tiếp, không cộng chuỗi "KB"
                        .fileSize(file.getSize()) 
                        .extension(getFileExtension(originalFileName))
                        .status(FileStatus.HOAN_TAT)
                        .build();
                app.getAttachments().add(attachment); // Quản lý quan hệ 2 chiều
                attachmentRepository.save(attachment);
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file vật lý: " + e.getMessage());
        }
    }

    private void saveClaims(List<ClaimDTO> claimDtos, Application app) {
    if (claimDtos == null || claimDtos.isEmpty()) return;
    
    Map<Integer, ApplicationClaim> claimMap = new HashMap<>();

    // Bước 1: Lưu toàn bộ các điểm để có ID UUID
    for (int i = 0; i < claimDtos.size(); i++) {
        ClaimDTO cDto = claimDtos.get(i);
        // SỬA: Đảm bảo idx luôn nhất quán (ưu tiên orderIndex từ DTO, nếu ko có thì dùng số thứ tự i+1)
        Integer idx = (cDto.getOrderIndex() != null) ? cDto.getOrderIndex() : (i + 1);

        ApplicationClaim claim = ApplicationClaim.builder()
                .application(app)
                .orderIndex(idx)
                .type("Độc lập".equalsIgnoreCase(cDto.getType()) ? ClaimType.DOK_LAP : ClaimType.PHU_THUOC)
                .content(cDto.getContent())
                .status(ClaimStatus.HOP_LE)
                .build();
        
        app.getClaims().add(claim); // Quản lý quan hệ 2 chiều
        claim = claimRepository.save(claim);
        claimMap.put(idx, claim);
    }

    // Đẩy dữ liệu xuống DB để sinh ID UUID cho tất cả các bản ghi
    claimRepository.flush(); 

    // Bước 2: Cập nhật tham chiếu cha-con
    for (int i = 0; i < claimDtos.size(); i++) {
        ClaimDTO cDto = claimDtos.get(i);
        // SỬA: Phải dùng lại cùng logic tính idx như ở Bước 1
        Integer currentIdx = (cDto.getOrderIndex() != null) ? cDto.getOrderIndex() : (i + 1);
        Integer parentIdx = cDto.getParentOrderIndex();

        // Kiểm tra xem điểm này có điểm cha không
        if (parentIdx != null && claimMap.containsKey(parentIdx)) {
            ApplicationClaim currentClaim = claimMap.get(currentIdx);
            ApplicationClaim parentClaim = claimMap.get(parentIdx);
            
            if (currentClaim != null && parentClaim != null) {
                currentClaim.setParentClaim(parentClaim);
                claimRepository.save(currentClaim);
            }
        }
    }
    // Lệnh flush cuối cùng để đẩy các thay đổi về parent_claim_id xuống DB
    claimRepository.flush(); 
}

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastIndex = fileName.lastIndexOf('.');
        return (lastIndex == -1) ? "" : fileName.substring(lastIndex + 1);
    }

    private AppType mapAppType(String type) {
        return "Giải pháp hữu ích".equals(type) ? AppType.GIAI_PHAP_HUU_ICH : AppType.SANG_CHE;
    }

    private SolutionType mapSolutionType(String type) {
        return "Quy trình".equals(type) ? SolutionType.QUY_TRINH : SolutionType.SAN_PHAM;
    }

    // --- PHƯƠNG THỨC MỚI: LẤY DANH SÁCH ĐƠN SÁNG CHẾ CHO EXAMINER ---
    public List<Application> getPatentApplications() {
        // Lọc trong database những đơn có AppType là SANG_CHE
        return applicationRepository.findByAppType(AppType.SANG_CHE);
    }

    public Application getApplicationById(UUID id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn với ID: " + id));
    }

    // Tại file com.ipms.service.PatentService.java

public Application updateApplicationStatus(UUID id, String status) {
    Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hồ sơ không tồn tại"));
    
    try {
        // Chuyển chuỗi String sang Enum AppStatus một cách an toàn
        AppStatus newStatus = AppStatus.valueOf(status.toUpperCase());
        app.setStatus(newStatus);
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Trạng thái không hợp lệ: " + status);
    }

    return applicationRepository.save(app);
}
    
}