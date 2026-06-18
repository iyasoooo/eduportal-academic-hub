# ARC4213 Cloud Computing - Group Report Template

This document provides a pre-formatted structure for your group's final report. Use this template to compile your 5-page Group Report and the individual 5-page (max) reflection reports.

---

## [PAGE 1: COVER PAGE]

### UNIVERSITI POLY-TECH MALAYSIA (UPTM)
**BACHELOR OF INFORMATION TECHNOLOGY (HONOURS) IN COMPUTER APPLICATION DEVELOPMENT / CYBERSECURITY**

* **Course**: Cloud Computing
* **Course Code**: ARC4213
* **Assessment**: Lab Assessment (Group)
* **Project Name**: CloudLab Portal
* **Submission Date**: June 23, 2026
* **Lecturer Name**: [Insert Lecturer Name]

#### Group Members:
1. **Ahmad Danish bin Kamal** (ID: D032310142) - *Group Leader*
2. **Nur Sarah binti Zamri** (ID: D032310088)
3. **Muhammad Haris bin Rostam** (ID: D032310255)
4. **Siti Aminah binti Yusuf** (ID: D032310119)

---

## [PAGE 2: INTRODUCTION & SYSTEM ARCHITECTURE]

### 1.1 Project Overview
Provide a brief summary of the CloudLab Portal, explaining the three integrated features (Team Portfolio, Student Management CRUD, and Task Tracker) and why a serverless client-side architecture was chosen.

### 1.2 System Architecture
Explain the design of your single-page app (SPA):
* **Frontend**: HTML5, custom vanilla CSS (glassmorphism dashboard design), and modular vanilla JavaScript.
* **Storage Cache**: Client-side `localStorage` acting as the serverless data database.
* **CI/CD Pipeline**: Automated code deployments triggered by Git hooks on GitHub.

### 1.3 Technology Stack Rationale
Explain why standard server setups (like Apache/PHP) were bypassed in favor of a static frontend + serverless host model:
* **Advantages**: Zero deployment cost, instant global CDN delivery, security (no database server to hack), and automated build triggers.
* **Limitations**: Data is client-specific (stored in browser memory). For production, a serverless API database (e.g. Firebase or Supabase) would replace `localStorage`.

---

## [PAGE 3: DEPLOYMENT PIPELINE & CI/CD]

### 2.1 Git Version Control
Explain how the project versioning was initiated locally using Git.
*Include commands: `git init`, `git add .`, `git commit`.*

### 2.2 Remote Repository Hook
Describe pushing the local codebase to GitHub and setting up the remote repository.
*(Insert GitHub repository screenshot here showing your commits).*

### 2.3 Cloud Hosting Deployment
Provide a structured step-by-step description of connecting GitHub to your chosen hosting provider (Netlify or Vercel).
*Explain how the webhook triggers automatic production builds.*
*(Insert Netlify/Vercel dashboard screenshot here showing a successful build).*

### 2.4 Live Modification Demonstration
Explain the process of pushing a change to Git and watching the live production URL update automatically.
*(Insert screenshot of the changed element on the live URL).*

---

## [PAGE 4: TEAM ROLES & COLLABORATION MATRIX]

To score maximum marks on **Role Clarity & Contribution (10 Marks)**, use this table to outline exactly who did what:

| Member Name | Student ID | Designated Project Role | Core Contributions |
| :--- | :--- | :--- | :--- |
| **Ahmad Danish** | D032310142 | Lead Cloud Architect | Initialized Git repo, pushed to GitHub, configured Netlify webhook deployment, verified SSL certificates. |
| **Nur Sarah** | D032310088 | Lead Frontend UI Developer | Authored global CSS layout, glowing theme variables, responsive design queries, and icon system. |
| **Muhammad Haris** | D032310255 | Systems Logic Developer | Programmed JavaScript modular scripts, Student CRUD logic, Task Tracker progress, and localStorage hook. |
| **Siti Aminah** | D032310119 | QA Tester & Doc Writer | Handled manual verification runs, input field boundary tests, resolved browser console warnings, compiled report. |

### 3.1 Collaboration Framework
Describe how the group worked together. E.g., "The team held brief status syncs twice a week, used the Task Tracker feature inside the app to delegate tasks, and managed codebase integrations through pull requests on GitHub."

---

## [PAGE 5: COMPILATION OF INDIVIDUAL REFLECTIONS]

*Note: The rubric requires each group member to write a reflection of their work done and cloud experience (max 5 pages each, compiled into this report).*

### Member 1: Ahmad Danish bin Kamal (Lead Cloud Architect)
* **Work Done**: Setting up local workspace versioning, managing the GitHub branch structure, linking webhooks to Netlify, and managing release updates.
* **Reflection on Cloud Usage**: Reflect on the transition from traditional web hosting (like cPanel or local servers) to automated, git-integrated edge environments like Netlify/Vercel. Discuss the ease of CI/CD pipelines and SSL provisioning.

### Member 2: Nur Sarah binti Zamri (Lead Frontend UI Developer)
* **Work Done**: Drafting layouts, implementing custom dark-mode variables, coding glassmorphic styles with backdrop filters, and programming responsive flex/grid wrappers.
* **Reflection on Cloud Usage**: Discuss designing for static web deployments. Reflect on how static asset distribution via cloud CDNs improves performance and loading speeds for end users.

### Member 3: Muhammad Haris bin Rostam (Systems Logic Developer)
* **Work Done**: Coding JS app router, Student CRUD array modifications, search/filter string bounds, and `localStorage` JSON cache parsing.
* **Reflection on Cloud Usage**: Reflect on using client-side storage configurations to mock cloud databases. Discuss how serverless architectures reduce server-side maintenance costs and how backend APIs could scale this app.

### Member 4: Siti Aminah binti Yusuf (QA Tester & Documentation Writer)
* **Work Done**: Writing validation test cases, validating field sanitization, executing cross-browser checks (Chrome, Firefox, Mobile), and formatting reports.
* **Reflection on Cloud Usage**: Discuss the security aspects of cloud hosting, such as how serverless hosting eliminates vulnerabilities like SQL injection or server-level breaches, ensuring higher system integrity.
