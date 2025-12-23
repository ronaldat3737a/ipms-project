package com.ipms.service;

import com.ipms.dto.*;
import com.ipms.entity.*;
import com.ipms.entity.enums.*;
import com.ipms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PatentService {

    private final ApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;
    private final AuthorRepository authorRepository;
    private final ClaimRepository claimRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class)
    public Application submitPatent(PatentSubmissionDTO dto, Long userId) {
        // 1. Tìm thông tin User đang đăng nhập
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 2. Lưu thông tin chung (Application)
        Application app = Application.builder()
                .appType(mapAppType(dto.getAppType()))
                .title(dto.getTitle())
                .solutionDetail(dto.getSolutionDetail())
                .solutionType(mapSolutionType(dto.getSolutionType()))
                .technicalField(dto.getTechnicalField())
                .ipcCodes(dto.getIpcCodes())
                .summary(dto.getSummary())
                .filingBasis(FilingBasis.TRUC_TUYEN) // Mặc định Trực tuyến như đã thống nhất
                .user(currentUser)
                .status(AppStatus.MOI)
                .build();

        // Database Trigger sẽ tự sinh app_no sau lệnh save này
        app = applicationRepository.save(app);

        // 3. Lưu thông tin Chủ đơn (Applicant)
        ApplicantDTO ownerDto = dto.getOwner();
        Applicant owner = Applicant.builder()
                .application(app)
                .type(ownerDto.getType().equals("Cá nhân") ? ApplicantType.CA_NHAN : ApplicantType.TO_CHUC)
                .fullName(ownerDto.getFullName())
                .idNumber(ownerDto.getIdNumber())
                .address(ownerDto.getAddress())
                .phone(ownerDto.getPhone())
                .email(ownerDto.getEmail())
                .repCode(ownerDto.getRepCode())
                .build();
        applicantRepository.save(owner);

        // 4. Lưu danh sách Tác giả (Authors)
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

        // 5. Lưu danh sách Điểm bảo hộ (Claims) & Xử lý tham chiếu
        saveClaims(dto.getClaims(), app);

        // 6. Lưu danh sách Tài liệu đính kèm (Attachments)
        if (dto.getAttachments() != null) {
            for (AttachmentDTO atDto : dto.getAttachments()) {
                ApplicationAttachment attachment = ApplicationAttachment.builder()
                        .application(app)
                        .category(FileCategory.valueOf(atDto.getCategory())) // Giả sử DTO gửi đúng Enum name
                        .docType(DocType.valueOf(atDto.getDocType()))
                        .fileName(atDto.getFileName())
                        .fileUrl(atDto.getFileUrl())
                        .fileSize(atDto.getFileSize())
                        .extension(atDto.getExtension())
                        .status(FileStatus.HOAN_TAT)
                        .build();
                attachmentRepository.save(attachment);
            }
        }

        return app;
    }

    // Logic xử lý Claims phức tạp (Self-reference)
    private void saveClaims(List<ClaimDTO> claimDtos, Application app) {
        if (claimDtos == null) return;
        
        Map<Integer, ApplicationClaim> claimMap = new HashMap<>();

        // Bước 1: Lưu toàn bộ các điểm để có ID từ DB
        for (ClaimDTO cDto : claimDtos) {
            ApplicationClaim claim = ApplicationClaim.builder()
                    .application(app)
                    .orderIndex(cDto.getOrderIndex())
                    .type(cDto.getType().equals("Độc lập") ? ClaimType.DOK_LAP : ClaimType.PHU_THUOC)
                    .content(cDto.getContent())
                    .status(ClaimStatus.HOP_LE)
                    .build();
            claim = claimRepository.save(claim);
            claimMap.put(cDto.getOrderIndex(), claim);
        }

        // Bước 2: Cập nhật tham chiếu cho các điểm phụ thuộc
        for (ClaimDTO cDto : claimDtos) {
            if (cDto.getParentOrderIndex() != null && claimMap.containsKey(cDto.getParentOrderIndex())) {
                ApplicationClaim currentClaim = claimMap.get(cDto.getOrderIndex());
                ApplicationClaim parentClaim = claimMap.get(cDto.getParentOrderIndex());
                currentClaim.setParentClaim(parentClaim);
                claimRepository.save(currentClaim);
            }
        }
    }

    // Các hàm Helper để map String từ Frontend sang Enum Backend
    private AppType mapAppType(String type) {
        return "Giải pháp hữu ích".equals(type) ? AppType.GIAI_PHAP_HUU_ICH : AppType.SANG_CHE;
    }

    private SolutionType mapSolutionType(String type) {
        return "Quy trình".equals(type) ? SolutionType.QUY_TRINH : SolutionType.SAN_PHAM;
    }
}