# CareerCraft AI — Intelligent Resume & Career Guidance Platform

CareerCraft AI is a modern, responsive web application designed for job seekers—including students, recent graduates, career changers, and experienced professionals. It provides AI-assisted resume tailoring, ATS skill-gap diagnostics, and structured interview preparation.

---

## 🚀 Quick Start

You can run CareerCraft AI in either of two ways:

### Method 1: Using the Python Local Server (Recommended)
```bash
python server.py
```
Then open your browser and navigate to:
**[http://localhost:8000](http://localhost:8000)**

### Method 2: Direct File Execution
Double-click `index.html` or open it directly in any modern browser:
```
file:///c:/Users/nayud/OneDrive/Documents/vs code/solar sensory/index.html
```

---

## 🧭 Complete Acceptance Criteria Demo Flow

To experience the complete end-to-end workflow:

1. **Landing Page & Dashboard**:
   - Start on the landing page with the headline: *"Build a resume that gets you closer to the role."*
   - Click **"Get started"** or **"Demo Workspace"** to enter the Dashboard.
   - Review key application metrics (Saved Resumes, Analyzed Roles, Active Applications, and Average Match Score).
2. **Create / Edit a Resume**:
   - Navigate to **"Resume Builder"** from the sidebar or dashboard.
   - Edit contact info, experience bullets, projects, or education.
   - Click **"✨ AI Polish Summary"** or **"✨ AI Enhance"** on experience bullet points to view the diff modal and accept STAR-formatted action improvements with metrics.
   - Switch between **Modern Minimalist**, **Executive Classic**, **Tech / Code**, and **Nordic Clean** templates and watch the live preview update instantly.
3. **Analyze a Target Job Description**:
   - Go to **"Job Analyzer"**.
   - Paste any job description or click one of the quick test presets (e.g., **Stripe Senior Frontend**, **Linear Product Manager**, or **Datadog Cloud Platform**).
   - Click **"Run Diagnostic Analysis"** to see the circular gauge match score, verified matching skills with quotes, missing skill gaps, and key responsibilities.
4. **Review Matched & Missing Skills**:
   - Click **"View Skill Gaps"** or navigate to **"Skill Gaps"** in the sidebar.
   - See competencies grouped into:
     - **Strong Evidence**: Verified in your work history with concrete metrics.
     - **Mentioned Briefly**: Skills in your profile that need stronger metric bullets.
     - **Not Found in Resume**: Missing qualifications with tailored course topics, mini portfolio project blueprints, and truthful resume highlight tips.
   - Check off completed learning milestones.
5. **Generate & Practice Interview Questions**:
   - Navigate to **"Interview Prep"**.
   - Review role-specific questions categorized into **Behavioral (STAR)**, **Technical & Architecture**, and **Situational**.
   - Expand the **Suggested Answer Outline** to see how the answer is grounded in your real past projects (e.g., NexaCloud latency improvements, micro-frontends).
   - Use the built-in scratchpad to save your own talking points and toggle **"Mark as Mastered"**.
6. **Save & Revisit Applications**:
   - Click **"Save as Application"** in the Analyzer.
   - Visit **"Saved Applications"** to track stage statuses (Draft, Preparing, Applied, Interviewing, Archived), search by company, or jump back into tailoring.
7. **Export Resume as PDF**:
   - In the Resume Builder, click **"📄 Export PDF"**.
   - The browser print preview triggers with dedicated print stylesheets (`@media print`) that hide all navigation, buttons, and editor panels, rendering a clean, ATS-compliant PDF document ready to send.

---

## 🏗️ Architecture & Component Design

- **`index.html`**: Semantic single-page application structure with Tailwind CSS, accessible modals, and responsive layout.
- **`css/styles.css`**: Professional career-tech styling, gauge animations, custom scrollbars, and dedicated `@media print` CSS for PDF generation.
- **`js/data.js`**: Default profiles (Alex Morgan - Senior Full Stack Engineer; Maya Lin - Product Manager), sample job descriptions, initial applications, and testimonials.
- **`js/store.js`**: Client-side reactive persistence layer backed by `localStorage` with subscription support and JSON export/import.
- **`js/engine.js`**: Rule-based NLP matching engine with a 30+ term taxonomy, evidence grading, STAR bullet enhancer, and interview synthesis.
- **`js/templates.js`**: Clean, ATS-optimized resume renderers (Modern, Executive, Tech, Nordic).
- **`js/app.js`**: Main view router and controller connecting all interactions, diff modals, and notifications.
- **`server.py`**: Lightweight Python HTTP server for local serving.
