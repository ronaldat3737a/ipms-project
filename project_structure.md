# Cấu trúc thư mục dự án

c:\Users\Admin\OneDrive\Máy tính\Project1\
├───.gitignore
├───package-lock.json
├───package.json
├───project_structure.md
├───.git\
├───.vscode\
├───backend\
│   ├───mvnw
│   ├───mvnw.cmd
│   ├───pom.xml
│   ├───.github\
│   │   └───java-upgrade\
│   │       ├───20260111125041
│   │       └───20260111125221
│   ├───.mvn\
│   │   └───wrapper\
│   │       ├───maven-wrapper.jar
│   │       ├───maven-wrapper.properties
│   │       └───MavenWrapperDownloader.java
│   ├───src\
│   │   └───main\
│   │       ├───java\
│   │       │   └───com\
│   │       │       └───ipms\
│   │       │           ├───IpmsApplication.java
│   │       │           ├───config\
│   │       │           │   ├───SecurityConfig.java
│   │       │           │   ├───VnPayConfig.java
│   │       │           │   └───WebConfig.java
│   │       │           ├───controller\
│   │       │           │   ├───AttachmentController.java
│   │       │           │   ├───AuthController.java
│   │       │           │   ├───DesignController.java
│   │       │           │   ├───FormalReviewController.java
│   │       │           │   ├───PatentController.java
│   │       │           │   ├───PaymentController.java
│   │       │           │   ├───PaymentStage2Controller.java
│   │       │           │   ├───PaymentStage3Controller.java
│   │       │           │   └───SubstantiveReviewController.java
│   │       │           ├───dto\
│   │       │           │   ├───ApplicantDTO.java
│   │       │           │   ├───ApplicationFeeDTO.java
│   │       │           │   ├───AttachmentDTO.java
│   │       │           │   ├───AuthorDTO.java
│   │       │           │   ├───ClaimDTO.java
│   │       │           │   ├───DesignRequestDto.java
│   │       │           │   ├───LoginRequest.java
│   │       │           │   ├───LoginResponse.java
│   │       │           │   ├───PatentSubmissionDTO.java
│   │       │           │   ├───RegisterRequest.java
│   │       │           │   └───ReviewRequest.java
│   │       │           ├───entity\
│   │       │           │   ├───Applicant.java
│   │       │           │   ├───Application.java
│   │       │           │   ├───ApplicationAttachment.java
│   │       │           │   ├───ApplicationClaim.java
│   │       │           │   ├───ApplicationFee.java
│   │       │           │   ├───Author.java
│   │       │           │   ├───IndustrialDesignDetail.java
│   │       │           │   ├───Payment.java
│   │       │           │   ├───ReviewHistory.java
│   │       │           │   ├───User.java
│   │       │           │   └───enums\
│   │       │           │       ├───ApplicantType.java
│   │       │           │       ├───AppStatus.java
│   │       │           │       ├───AppType.java
│   │       │           │       ├───ClaimStatus.java
│   │       │           │       ├───ClaimType.java
│   │       │           │       ├───DocType.java
│   │       │           │       ├───FeeStage.java
│   │       │           │       ├───FileCategory.java
│   │       │           │       ├───FileStatus.java
│   │       │           │       ├───FilingBasis.java
│   │       │           │       ├───PaymentStatus.java
│   │       │           │       ├───SolutionType.java
│   │       │           │       ├───UserRole.java
│   │       │           │       └───ViewType.java
│   │       │           ├───repository\
│   │       │           │   ├───ApplicantRepository.java
│   │       │           │   ├───ApplicationFeeRepository.java
│   │       │           │   ├───ApplicationRepository.java
│   │       │           │   ├───AttachmentRepository.java
│   │       │           │   ├───AuthorRepository.java
│   │       │           │   ├───ClaimRepository.java
│   │       │           │   ├───IndustrialDesignDetailRepository.java
│   │       │           │   ├───PaymentRepository.java
│   │       │           │   ├───ReviewHistoryRepository.java
│   │       │           │   └───UserRepository.java
│   │       │           └───service\
│   │       │               ├───DesignService.java
│   │       │               ├───FormalReviewService.java
│   │       │               ├───PatentService.java
│   │       │               ├───PaymentService.java
│   │       │               ├───PaymentStage2Service.java
│   │       │               ├───PaymentStage3Service.java
│   │       │               └───SubstantiveReviewService.java
│   │       └───resources\
│   │           └───application.properties
│   ├───target\
│   │   ├───classes
│   │   ├───generated-sources
│   │   └───maven-status
│   └───uploads\
├───frontend\
│   ├───index.html
│   ├───package-lock.json
│   ├───package.json
│   ├───postcss.config.js
│   ├───tailwind.config.js
│   ├───vercel.json
│   ├───vite.config.js
│   ├───dist
│   ├───node_modules
│   └───src\
│       ├───App.jsx
│       ├───index.css
│       ├───main.jsx
│       └───pages\
│           ├───Admin.jsx
│           ├───Create.jsx
│           ├───Landing.jsx
│           ├───Applicant\
│           │   ├───ApplicantDashboard.jsx
│           │   ├───Design\
│           │   │   ├───DesignDetail.jsx
│           │   │   ├───DesignFiling.jsx
│           │   │   ├───DesignList.jsx
│           │   │   ├───DesignPhase2Payment.jsx
│           │   │   ├───DesignPhase3Payment.jsx
│           │   │   ├───DesignRejectReasonView.jsx
│           │   │   ├───DesignRevision.jsx
│           │   │   └───Filing\
│           │   │       ├───FilingContext.jsx
│           │   │       ├───Step1_GeneralInfo.jsx
│           │   │       ├───Step2_OwnerAuthor.jsx
│           │   │       ├───Step3_Attachments.jsx
│           │   │       ├───Step4_Claims.jsx
│           │   │       ├───Step5_Submission.jsx
│           │   │       ├───Step6_FeePayment.jsx
│           │   │       └───SuccessPage.jsx
│           │   └───Patent\
│           │       ├───ApplicantRejectReasonView.jsx
│           │       ├───PatentDetail.jsx
│           │       ├───PatentFiling.jsx
│           │       ├───PatentList.jsx
│           │       ├───PatentRevision.jsx
│           │       ├───Phase2Payment.jsx
│           │       ├───Phase3Payment.jsx
│           │       └───Filing\
│           │           ├───FilingContext.jsx
│           │           ├───Step1_GeneralInfo.jsx
│           │           ├───Step2_OwnerAuthor.jsx
│           │           ├───Step3_Attachments.jsx
│           │           ├───Step4_Claims.jsx
│           │           ├───Step5_Submission.jsx
│           │           ├───Step6_FeePayment.jsx
│           │           └───SuccessPage.jsx
│           ├───Auth\
│           │   ├───Login.jsx
│           │   └───Register.jsx
│           └───Examiner\
│               ├───ExaminerDashboard.jsx
│               ├───Design\
│               │   ├───AcceptConfirmation.jsx
│               │   ├───CorrectionRequest.jsx
│               │   ├───DesignCertificateView.jsx
│               │   ├───DesignReview.jsx
│               │   ├───DesignReviewList.jsx
│               │   ├───RejectConfirmation.jsx
│               │   ├───RejectReasonView.jsx
│               │   └───SubstantiveReview.jsx
│               └───Patent\
│                   ├───AcceptConfirmation.jsx
│                   ├───ApplicationReview.jsx
│                   ├───CorrectionRequest.jsx
│                   ├───PatentCertificateView.jsx
│                   ├───PatentReviewList.jsx
│                   ├───RejectConfirmation.jsx
│                   ├───RejectReasonView.jsx
│                   └───SubstantiveReview.jsx
└───node_modules
