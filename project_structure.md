# Project Structure

```
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
│   │       │           ├───controller\
│   │       │           ├───dto\
│   │       │           ├───entity\
│   │       │           ├───repository\
│   │       │           └───service\
│   │       └───resources\
│   │           └───application.properties
│   ├───target\
│   └───uploads\
├───frontend\
│   ├───index.html
│   ├───package-lock.json
│   ├───package.json
│   ├───postcss.config.js
│   ├───tailwind.config.js
│   ├───vercel.json
│   ├───vite.config.js
│   ├───dist\
│   ├───node_modules\
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
│           │   └───Patent\
│           │       ├───ApplicantRejectReasonView.jsx
│           │       ├───PatentDetail.jsx
│           │       ├───PatentFiling.jsx
│           │       ├───PatentList.jsx
│           │       ├───PatentRevision.jsx
│           │       ├───Phase2Payment.jsx
│           │       ├───Phase3Payment.jsx
│           │       └───Filing\
│           ├───Auth\
│           │   ├───Login.jsx
│           │   └───Register.jsx
│           └───Examiner\
│               ├───ExaminerDashboard.jsx
│               └───Patent\
│                   ├───AcceptConfirmation.jsx
│                   ├───ApplicationReview.jsx
│                   ├───CorrectionRequest.jsx
│                   ├───PatentCertificateView.jsx
│                   ├───PatentReviewList.jsx
│                   ├───RejectConfirmation.jsx
│                   ├───RejectReasonView.jsx
│                   ├───SubstantiveReview.jsx
│                   └───UtilityReviewList.jsx
└───node_modules\
```