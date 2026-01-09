
# Sơ đồ cấu trúc dự án

Đây là sơ đồ cấu trúc cho cả frontend và backend của dự án.

## Frontend (React)

Cấu trúc frontend được tổ chức xung quanh các trang (pages) và các thành phần (components) được sử dụng trong các trang đó.

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Create.jsx
│   │   ├── Landing.jsx
│   │   ├── Applicant/
│   │   │   ├── ApplicantDashboard.jsx
│   │   │   └── Patent/
│   │   │       ├── ApplicantRejectReasonView.jsx
│   │   │       ├── PatentDetail.jsx
│   │   │       ├── PatentFiling.jsx
│   │   │       ├── PatentList.jsx
│   │   │       ├── PatentRevision.jsx
│   │   │       ├── Phase2Payment.jsx
│   │   │       ├── Phase3Payment.jsx
│   │   │       └── Filing/
│   │   │           ├── FilingContext.jsx
│   │   │           ├── Step1_GeneralInfo.jsx
│   │   │           ├── Step2_OwnerAuthor.jsx
│   │   │           ├── Step3_Attachments.jsx
│   │   │           ├── Step4_Claims.jsx
│   │   │           ├── Step5_Submission.jsx
│   │   │           ├── Step6_FeePayment.jsx
│   │   │           └── SuccessPage.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Examiner/
│   │       ├── ExaminerDashboard.jsx
│   │       └── Patent/
│   │           ├── AcceptConfirmation.jsx
│   │           ├── ApplicationReview.jsx
│   │           ├── CorrectionRequest.jsx
│   │           ├── PatentCertificateView.jsx
│   │           ├── PatentReviewList.jsx
│   │           ├── RejectConfirmation.jsx
│   │           ├── RejectReasonView.jsx
│   │           ├── SubstantiveReview.jsx
│   │           └── UtilityReviewList.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## Backend (Spring Boot)

Backend được cấu trúc theo kiến trúc Model-View-Controller (MVC) điển hình, với các lớp cho cấu hình, controller, DTO, thực thể, repository và service.

```
backend/
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── ipms/
        │           ├── IpmsApplication.java
        │           ├── config/
        │           │   ├── SecurityConfig.java
        │           │   ├── VnPayConfig.java
        │           │   └── WebConfig.java
        │           ├── controller/
        │           │   ├── AttachmentController.java
        │           │   ├── AuthController.java
        │           │   ├── FormalReviewController.java
        │           │   ├── PatentController.java
        │           │   ├── PaymentController.java
        │           │   ├── PaymentStage2Controller.java
        │           │   └── PaymentStage3Controller.java
        │           ├── dto/
        │           ├── entity/
        │           ├── repository/
        │           └── service/
        └── resources/
            └── application.properties
```
