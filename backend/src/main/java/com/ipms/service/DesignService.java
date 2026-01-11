package com.ipms.service;

import com.ipms.dto.DesignRequestDto;
import com.ipms.dto.AuthorDTO;
import com.ipms.dto.AttachmentDTO;
import com.ipms.entity.*;
import com.ipms.entity.enums.*;
import com.ipms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

/**
 * Service to manage Industrial Design applications.
 *
 * SLA for Industrial Designs:
 * - Formal examination: 1 month from filing date.
 * - Publication: Within 2 months from date of acceptance of valid application.
 * - Substantive examination: Max 7 months from publication date.
 */
@Service
@RequiredArgsConstructor
public class DesignService {

    private final ApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;
    private final AuthorRepository authorRepository;
    private final IndustrialDesignDetailRepository designDetailRepository;
    private final AttachmentRepository attachmentRepository;
    private final ApplicationFeeRepository feeRepository;
    private final UserRepository userRepository;

    @Value("${upload.path:uploads/}")
    private String uploadPath;

    @Transactional(rollbackFor = Exception.class)
    public Application createDesignApplication(DesignRequestDto dto, Long userId, MultipartFile[] files) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // 1. Create Application entity with initial status
        Application app = Application.builder()
                .appType(AppType.KIEU_DANG_CN)
                .title(dto.getTitle())
                .totalPages(dto.getTotalPages())
                .filingBasis(FilingBasis.TRUC_TUYEN)
                .user(currentUser)
                .status(AppStatus.MOI) // Initial status is MOI (new)
                .appNo(null)
                .build();
        
        app.setAuthors(new ArrayList<>());
        app.setAttachments(new ArrayList<>());
        
        // Save to get the generated ID
        app = applicationRepository.save(app);

        // 2. Save Applicant (owner) info
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

        // 3. Save Authors
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
                app.getAuthors().add(author);
                authorRepository.save(author);
            }
        }

        // 4. Save Industrial Design specific details
        IndustrialDesignDetail designDetail = IndustrialDesignDetail.builder()
                .application(app)
                .usageField(dto.getUsageField())
                .locarnoCodes(dto.getLocarnoCodes())
                .similarDesign(dto.getSimilarDesign())
                .descriptionDetail(dto.getDescriptionDetail())
                .claims(dto.getClaims())
                .build();
        designDetailRepository.save(designDetail);

        // 5. Save physical files and their metadata
        if (files != null && files.length > 0) {
            savePhysicalFiles(files, app, dto.getAttachments());
        }

        return app;
    }

    @Transactional(rollbackFor = Exception.class)
    public Application submitDesignApplication(UUID applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
        
        IndustrialDesignDetail designDetail = designDetailRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Industrial Design details not found for application ID: " + applicationId));

        if (app.getStatus() != AppStatus.MOI) {
            throw new IllegalStateException("Application can only be submitted in MOI status.");
        }

        // 1. Generate Application Number
        String appNo = generateAppNo(AppType.KIEU_DANG_CN);
        app.setAppNo(appNo);

        // 2. Calculate and save stage 1 fees
        createAndSaveStage1Fees(app, designDetail);

        // 3. Update status to wait for payment
        app.setStatus(AppStatus.CHO_NOP_PHI_GD1);

        return applicationRepository.save(app);
    }
    
    private void createAndSaveStage1Fees(Application application, IndustrialDesignDetail detail) {
        BigDecimal filingFee = new BigDecimal("150000"); // Lệ phí nộp đơn
        BigDecimal classificationFee = new BigDecimal("100000").multiply(new BigDecimal(detail.getLocarnoCodes().size())); // Phí phân loại
        BigDecimal examinationFee = new BigDecimal("700000"); // Phí thẩm định đơn
        BigDecimal searchFee = new BigDecimal("480000"); // Phí tra cứu

        // Phí công bố (120k for first image, 60k for each additional)
        long imageCount = application.getAttachments().stream()
                .filter(att -> att.getCategory() == FileCategory.HINH_ANH)
                .count();
        BigDecimal publicationFee;
        if (imageCount > 0) {
            publicationFee = new BigDecimal("120000").add(new BigDecimal("60000").multiply(new BigDecimal(imageCount - 1)));
        } else {
            publicationFee = new BigDecimal("0");
        }
        
        BigDecimal totalAmount = filingFee.add(classificationFee).add(examinationFee).add(publicationFee).add(searchFee);

        ApplicationFee fee = ApplicationFee.builder()
                .application(application)
                .stage(FeeStage.PHI_GD1)
                .amount(totalAmount)
                .status(PaymentStatus.CHUA_THANH_TOAN)
                .build();

        feeRepository.save(fee);
    }

    private String generateAppNo(AppType appType) {
        String prefix = "KDCN";
        int year = Calendar.getInstance().get(Calendar.YEAR);
        long count = applicationRepository.countByAppTypeAndCreatedAtYear(appType, year);
        String sequence = String.format("%05d", count + 1);
        return prefix + year + sequence;
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

                DocType type = DocType.KHAC;
                FileCategory cat = FileCategory.TAI_LIEU_KHAC;
                ViewType viewType = null; // Khởi tạo là null

                if (attachmentDtos != null) {
                    Optional<AttachmentDTO> match = attachmentDtos.stream()
                        .filter(d -> originalFileName != null && originalFileName.equals(d.getFileName()))
                        .findFirst();
                    if (match.isPresent()) {
                        AttachmentDTO dto = match.get();
                        try {
                            type = DocType.valueOf(dto.getDocType());
                            cat = FileCategory.valueOf(dto.getCategory());
                            if (dto.getViewType() != null) {
                                viewType = ViewType.valueOf(dto.getViewType());
                            }
                        } catch (IllegalArgumentException e) {
                            // Keep default if mapping fails
                        }
                    }
                }

                ApplicationAttachment attachment = ApplicationAttachment.builder()
                        .application(app)
                        .category(cat)
                        .docType(type)
                        .viewType(viewType) // Gán viewType
                        .fileName(originalFileName)
                        .fileUrl(uniqueFileName)
                        .fileSize(file.getSize())
                        .extension(getFileExtension(originalFileName))
                        .status(FileStatus.HOAN_TAT)
                        .build();
                app.getAttachments().add(attachment);
                attachmentRepository.save(attachment);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to save physical files: " + e.getMessage());
        }
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastIndex = fileName.lastIndexOf('.');
        return (lastIndex == -1) ? "" : fileName.substring(lastIndex + 1);
    }

    public List<Application> getDesignApplications() {
        return applicationRepository.findByAppType(AppType.KIEU_DANG_CN);
    }

    public Optional<Application> getDesignApplicationById(UUID id) {
        // Here we could add a JOIN query later to fetch details in one go
        return applicationRepository.findById(id);
    }
     public Optional<IndustrialDesignDetail> getIndustrialDesignDetail(UUID applicationId) {
        return designDetailRepository.findById(applicationId);
    }
}
