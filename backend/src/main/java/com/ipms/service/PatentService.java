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

import java.io.IOException;
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

    @Value("${upload.path:uploads/}")
    private String uploadPath;

    @Transactional(rollbackFor = Exception.class)
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
                .status(AppStatus.MOI)
                .build();

        app = applicationRepository.save(app);
        // ... giữ nguyên phần sau

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
                attachmentRepository.save(attachment);
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file vật lý: " + e.getMessage());
        }
    }

    private void saveClaims(List<ClaimDTO> claimDtos, Application app) {
    if (claimDtos == null || claimDtos.isEmpty()) return;
    
    Map<Integer, ApplicationClaim> claimMap = new HashMap<>();

    // Bước 1: Lưu toàn bộ các điểm bảo hộ
    for (int i = 0; i < claimDtos.size(); i++) {
        ClaimDTO cDto = claimDtos.get(i);
        Integer finalOrderIndex = (cDto.getOrderIndex() != null) ? cDto.getOrderIndex() : (i + 1);

        // Chuẩn hóa chuỗi trước khi so sánh
        String typeStr = (cDto.getType() != null) ? cDto.getType().trim() : "";
        ClaimType type = ("Độc lập".equalsIgnoreCase(typeStr) || "DOK_LAP".equalsIgnoreCase(typeStr)) 
                         ? ClaimType.DOK_LAP : ClaimType.PHU_THUOC;

        ApplicationClaim claim = ApplicationClaim.builder()
                .application(app)
                .orderIndex(finalOrderIndex)
                .type(type)
                .content(cDto.getContent() != null ? cDto.getContent() : "Nội dung đang cập nhật")
                .status(ClaimStatus.HOP_LE)
                .build();
        
        claim = claimRepository.save(claim);
        claimMap.put(finalOrderIndex, claim);
    }

    // Bước 2: Cập nhật tham chiếu (Parent Claim)
    for (ClaimDTO cDto : claimDtos) {
        Integer currentIdx = cDto.getOrderIndex();
        if (currentIdx != null && cDto.getParentOrderIndex() != null && claimMap.containsKey(cDto.getParentOrderIndex())) {
            ApplicationClaim currentClaim = claimMap.get(currentIdx);
            ApplicationClaim parentClaim = claimMap.get(cDto.getParentOrderIndex());
            currentClaim.setParentClaim(parentClaim);
            claimRepository.save(currentClaim);
        }
    }
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
}