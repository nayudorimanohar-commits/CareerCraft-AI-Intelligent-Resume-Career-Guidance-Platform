/**
 * CareerCraft AI - Main Application Controller & View Orchestrator
 */

class CareerCraftApp {
  constructor() {
    this.store = window.store;
    this.engine = window.careerEngine;
    this.templates = window.ResumeTemplates;

    this.currentView = 'landing';
    this.activeApplicationFilter = 'All';
    this.interviewFilter = 'all';

    this.init();
  }

  init() {
    // 1. Setup UI navigation listeners
    this.setupNavigation();
    
    // 2. Setup Resume Builder Form listeners
    this.setupBuilderEvents();

    // 3. Setup Job Analyzer listeners
    this.setupAnalyzerEvents();

    // 4. Setup Saved Applications listeners
    this.setupApplicationsEvents();

    // 5. Setup Settings & Profile listeners
    this.setupSettingsEvents();

    // 6. Setup Global Modal & Toast listeners
    this.setupGlobalEvents();

    // 7. Subscribe to store changes
    this.store.subscribe((event, data) => {
      this.handleStoreUpdate(event, data);
    });

    // 8. Initial render of default view
    // Check URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (['landing', 'dashboard', 'builder', 'analyzer', 'gaps', 'interview', 'applications', 'settings'].includes(hash)) {
      this.switchView(hash);
    } else {
      this.switchView('landing');
    }

    // Run initial analysis on active JD if available so Gaps and Interview views have rich data
    if (this.store.activeJD && this.store.activeJD.text) {
      const initialAnalysis = this.engine.analyze(
        this.store.getProfile(),
        this.store.activeJD.text,
        this.store.activeJD.title,
        this.store.activeJD.company
      );
      this.store.setActiveAnalysis(initialAnalysis);
    }

    console.log('CareerCraft AI successfully initialized.');
  }

  // ==========================================
  // NAVIGATION & VIEW SWITCHER
  // ==========================================
  setupNavigation() {
    // Sidebar & Header Links
    document.querySelectorAll('[data-view-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-view-target');
        this.switchView(targetView);
        // Mobile drawer close if open
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
      });
    });

    // Mobile drawer toggle
    const menuBtn = document.getElementById('btn-mobile-menu');
    const drawer = document.getElementById('mobile-drawer');
    const closeDrawerBtn = document.getElementById('btn-close-drawer');
    if (menuBtn && drawer) {
      menuBtn.addEventListener('click', () => drawer.classList.toggle('hidden'));
    }
    if (closeDrawerBtn && drawer) {
      closeDrawerBtn.addEventListener('click', () => drawer.classList.add('hidden'));
    }
  }

  switchView(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;

    // Toggle Landing vs App Workspace Container
    const landingView = document.getElementById('view-landing');
    const appShell = document.getElementById('app-shell');
    const navItems = document.querySelectorAll('.nav-link-item');

    if (viewName === 'landing') {
      if (landingView) landingView.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
      window.scrollTo(0, 0);
      return;
    }

    // App shell view
    if (landingView) landingView.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');

    // Hide all view panels
    const views = ['dashboard', 'builder', 'analyzer', 'gaps', 'interview', 'applications', 'settings'];
    views.forEach(v => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.add('hidden');
    });

    // Show target view panel
    const activeEl = document.getElementById(`view-${viewName}`);
    if (activeEl) {
      activeEl.classList.remove('hidden');
      activeEl.classList.add('animate-fade-in');
    }

    // Update active nav styling
    navItems.forEach(item => {
      const target = item.getAttribute('data-view-target');
      if (target === viewName) {
        item.classList.add('bg-teal-50', 'text-teal-700', 'font-semibold');
        item.classList.remove('text-slate-600', 'hover:bg-slate-50');
      } else {
        item.classList.remove('bg-teal-50', 'text-teal-700', 'font-semibold');
        item.classList.add('text-slate-600', 'hover:bg-slate-50');
      }
    });

    // Trigger view-specific render
    switch (viewName) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'builder':
        this.renderBuilder();
        break;
      case 'analyzer':
        this.renderAnalyzer();
        break;
      case 'gaps':
        this.renderGaps();
        break;
      case 'interview':
        this.renderInterview();
        break;
      case 'applications':
        this.renderApplications();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }

    window.scrollTo(0, 0);
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  renderDashboard() {
    const profile = this.store.getProfile();
    const apps = this.store.getApplications();

    // Welcome title
    const welcomeEl = document.getElementById('dash-welcome-name');
    if (welcomeEl) welcomeEl.textContent = profile.name || 'Job Seeker';

    // Summary stats
    const statResumes = document.getElementById('stat-saved-resumes');
    const statJobs = document.getElementById('stat-jobs-analyzed');
    const statActive = document.getElementById('stat-active-apps');
    const statAvgMatch = document.getElementById('stat-avg-match');

    if (statResumes) statResumes.textContent = '1 Master Draft';
    if (statJobs) statJobs.textContent = SAMPLE_JOB_DESCRIPTIONS.length.toString();
    
    const activeApps = apps.filter(a => ['Preparing', 'Applied', 'Interviewing'].includes(a.status));
    if (statActive) statActive.textContent = activeApps.length.toString();

    const avgScore = apps.length > 0 
      ? Math.round(apps.reduce((sum, a) => sum + (a.matchScore || 70), 0) / apps.length)
      : 82;
    if (statAvgMatch) statAvgMatch.textContent = `${avgScore}%`;

    // Recent applications list
    const listContainer = document.getElementById('dash-recent-apps-list');
    const emptyState = document.getElementById('dash-empty-apps');

    if (!listContainer) return;

    if (apps.length === 0) {
      listContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    listContainer.innerHTML = apps.slice(0, 5).map(app => {
      let statusColor = 'bg-slate-100 text-slate-700 border-slate-200';
      if (app.status === 'Interviewing') statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      else if (app.status === 'Applied') statusColor = 'bg-blue-50 text-blue-700 border-blue-200';
      else if (app.status === 'Preparing') statusColor = 'bg-amber-50 text-amber-700 border-amber-200';

      return `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all gap-3 shadow-xs">
          <div class="flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
              ${(app.company || 'Co').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm hover:text-teal-700 transition cursor-pointer" onclick="app.openApplicationInAnalyzer('${app.id}')">${app.jobTitle}</h4>
              <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>${app.company}</span>
                <span>•</span>
                <span>Updated ${app.lastUpdated || 'Recently'}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <!-- Match score badge -->
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span class="w-2 h-2 rounded-full ${app.matchScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
              <span>${app.matchScore}% Match</span>
            </div>

            <!-- Status badge -->
            <span class="text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor}">
              ${app.status}
            </span>

            <!-- Actions -->
            <div class="flex items-center gap-1">
              <button onclick="app.openApplicationInAnalyzer('${app.id}')" title="Analyze & View Gaps" class="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition text-xs flex items-center gap-1">
                <span>View</span>
              </button>
              <button onclick="app.openApplicationInInterview('${app.id}')" title="Interview Prep" class="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition text-xs flex items-center gap-1">
                <span>Prep</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // RESUME BUILDER
  // ==========================================
  setupBuilderEvents() {
    // Template Selector Buttons
    document.querySelectorAll('[data-template-select]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tName = btn.getAttribute('data-template-select');
        this.store.setTemplate(tName);
      });
    });

    // Form input live syncing to store profile
    const bindLiveField = (inputId, profileKey) => {
      const el = document.getElementById(inputId);
      if (el) {
        el.addEventListener('input', () => {
          const profile = this.store.getProfile();
          profile[profileKey] = el.value;
          this.store.updateProfile(profile);
          this.renderResumeLivePreview();
        });
      }
    };

    bindLiveField('form-name', 'name');
    bindLiveField('form-title', 'title');
    bindLiveField('form-email', 'email');
    bindLiveField('form-phone', 'phone');
    bindLiveField('form-location', 'location');
    bindLiveField('form-linkedin', 'linkedin');
    bindLiveField('form-github', 'github');
    bindLiveField('form-portfolio', 'portfolio');
    bindLiveField('form-summary', 'summary');

    // AI Assist: Generate Summary
    const btnAiSummary = document.getElementById('btn-ai-generate-summary');
    if (btnAiSummary) {
      btnAiSummary.addEventListener('click', () => {
        const profile = this.store.getProfile();
        const generated = this.engine.aiGenerateSummary(profile, profile.title);
        this.showDiffModal(
          'AI Executive Summary Suggestion',
          profile.summary || '(Empty summary)',
          generated,
          (acceptedText) => {
            profile.summary = acceptedText;
            const sumInput = document.getElementById('form-summary');
            if (sumInput) sumInput.value = acceptedText;
            this.store.updateProfile(profile);
            this.renderResumeLivePreview();
            this.showToast('Executive summary updated!');
          }
        );
      });
    }

    // AI Assist: Add Experience
    const btnAddExp = document.getElementById('btn-add-experience');
    if (btnAddExp) {
      btnAddExp.addEventListener('click', () => {
        const profile = this.store.getProfile();
        const newExp = {
          id: 'exp-' + Date.now(),
          title: 'Software Engineer',
          company: 'New Enterprise Co',
          location: 'San Francisco, CA',
          startDate: '2023',
          endDate: 'Present',
          current: true,
          bullets: ['Engineered scalable components improving throughput and team velocity.']
        };
        profile.experiences.unshift(newExp);
        this.store.updateProfile(profile);
        this.renderExperienceEditor();
        this.renderResumeLivePreview();
        this.showToast('New experience entry added.');
      });
    }

    // AI Assist: Add Education
    const btnAddEdu = document.getElementById('btn-add-education');
    if (btnAddEdu) {
      btnAddEdu.addEventListener('click', () => {
        const profile = this.store.getProfile();
        const newEdu = {
          id: 'edu-' + Date.now(),
          degree: 'B.S. in Computer Science',
          institution: 'University Name',
          location: 'City, State',
          gradYear: '2022',
          details: 'Dean’s Honor List'
        };
        profile.education.push(newEdu);
        this.store.updateProfile(profile);
        this.renderEducationEditor();
        this.renderResumeLivePreview();
        this.showToast('New education entry added.');
      });
    }

    // AI Assist: Add Project
    const btnAddProj = document.getElementById('btn-add-project');
    if (btnAddProj) {
      btnAddProj.addEventListener('click', () => {
        const profile = this.store.getProfile();
        const newProj = {
          id: 'proj-' + Date.now(),
          name: 'New Cloud Project',
          tech: 'TypeScript, React, Node.js',
          link: 'github.com/myproject',
          bullets: ['Built full-stack application with real-time updates.']
        };
        profile.projects.push(newProj);
        this.store.updateProfile(profile);
        this.renderProjectsEditor();
        this.renderResumeLivePreview();
        this.showToast('New project added.');
      });
    }

    // Export PDF Button
    const btnExportPdf = document.getElementById('btn-export-pdf');
    if (btnExportPdf) {
      btnExportPdf.addEventListener('click', () => this.handleExportPdf());
    }

    // Preload Sample Profiles (Alex Morgan vs Maya Lin vs Empty)
    const selectSample = document.getElementById('select-sample-profile');
    if (selectSample) {
      selectSample.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'empty') {
          this.store.createEmptyResume();
          this.showToast('Created empty resume canvas.');
        } else if (DEFAULT_PROFILES[val]) {
          this.store.loadSampleProfile(val);
          this.showToast(`Loaded ${DEFAULT_PROFILES[val].name} sample profile.`);
        }
        this.renderBuilder();
      });
    }

    // Add Skill Input tag handling
    const addSkillBtn = document.getElementById('btn-add-skill-tag');
    const skillInput = document.getElementById('input-new-skill-tag');
    if (addSkillBtn && skillInput) {
      const handleAddSkill = () => {
        const val = skillInput.value.trim();
        if (!val) return;
        const profile = this.store.getProfile();
        if (!profile.skills.technical.includes(val)) {
          profile.skills.technical.push(val);
          this.store.updateProfile(profile);
          this.renderSkillsEditor();
          this.renderResumeLivePreview();
          skillInput.value = '';
          this.showToast(`Added skill: ${val}`);
        }
      };
      addSkillBtn.addEventListener('click', handleAddSkill);
      skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddSkill();
        }
      });
    }
  }

  renderBuilder() {
    const profile = this.store.getProfile();

    // Populate Top-level inputs
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('form-name', profile.name);
    setVal('form-title', profile.title);
    setVal('form-email', profile.email);
    setVal('form-phone', profile.phone);
    setVal('form-location', profile.location);
    setVal('form-linkedin', profile.linkedin);
    setVal('form-github', profile.github);
    setVal('form-portfolio', profile.portfolio);
    setVal('form-summary', profile.summary);

    // Render nested list sections
    this.renderExperienceEditor();
    this.renderEducationEditor();
    this.renderSkillsEditor();
    this.renderProjectsEditor();

    // Render template live preview
    this.renderResumeLivePreview();

    // Update template selection visual state
    document.querySelectorAll('[data-template-select]').forEach(btn => {
      const t = btn.getAttribute('data-template-select');
      if (t === this.store.activeTemplate) {
        btn.classList.add('border-teal-600', 'bg-teal-50', 'text-teal-800', 'font-bold');
        btn.classList.remove('border-slate-200', 'text-slate-600');
      } else {
        btn.classList.remove('border-teal-600', 'bg-teal-50', 'text-teal-800', 'font-bold');
        btn.classList.add('border-slate-200', 'text-slate-600');
      }
    });
  }

  renderExperienceEditor() {
    const container = document.getElementById('experience-items-container');
    if (!container) return;
    const profile = this.store.getProfile();
    const experiences = profile.experiences || [];

    if (experiences.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">No work experience entries yet. Click "+ Add Experience" above to start.</p>`;
      return;
    }

    container.innerHTML = experiences.map((exp, index) => `
      <div class="border border-slate-200 rounded-xl p-4 bg-white mb-3 shadow-xs reorder-item">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">${index + 1}</span>
            <span class="font-bold text-sm text-slate-900">${exp.company || 'Company'}</span>
            <span class="text-xs text-slate-500">(${exp.title || 'Role'})</span>
          </div>
          <div class="flex items-center gap-1">
            ${index > 0 ? `<button onclick="app.moveExperience(${index}, -1)" title="Move up" class="p-1 hover:bg-slate-100 text-slate-500 rounded text-xs">▲</button>` : ''}
            ${index < experiences.length - 1 ? `<button onclick="app.moveExperience(${index}, 1)" title="Move down" class="p-1 hover:bg-slate-100 text-slate-500 rounded text-xs">▼</button>` : ''}
            <button onclick="app.deleteExperience('${exp.id}')" title="Delete entry" class="p-1 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded text-xs ml-1">✕</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5 text-xs">
          <div>
            <label class="block text-slate-600 font-medium mb-1">Job Title</label>
            <input type="text" value="${exp.title || ''}" oninput="app.updateExpField('${exp.id}', 'title', this.value)" class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-teal-500" placeholder="e.g. Senior Software Engineer">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">Company</label>
            <input type="text" value="${exp.company || ''}" oninput="app.updateExpField('${exp.id}', 'company', this.value)" class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-teal-500" placeholder="e.g. NexaCloud">
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">Dates (Start – End)</label>
            <div class="flex items-center gap-1.5">
              <input type="text" value="${exp.startDate || ''}" oninput="app.updateExpField('${exp.id}', 'startDate', this.value)" class="w-1/2 px-2.5 py-1.5 border border-slate-200 rounded-lg" placeholder="Jan 2022">
              <span class="text-slate-400">–</span>
              <input type="text" value="${exp.current ? 'Present' : (exp.endDate || '')}" oninput="app.updateExpField('${exp.id}', 'endDate', this.value)" class="w-1/2 px-2.5 py-1.5 border border-slate-200 rounded-lg" placeholder="Present">
            </div>
          </div>
          <div>
            <label class="block text-slate-600 font-medium mb-1">Location</label>
            <input type="text" value="${exp.location || ''}" oninput="app.updateExpField('${exp.id}', 'location', this.value)" class="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg" placeholder="San Francisco, CA">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-semibold text-slate-700">Achievement Bullets</label>
            <button onclick="app.addBulletToExperience('${exp.id}')" class="text-[11px] text-teal-700 hover:text-teal-800 font-medium">+ Add bullet</button>
          </div>
          <div class="space-y-2">
            ${(exp.bullets || []).map((bullet, bIdx) => `
              <div class="flex items-start gap-1.5">
                <textarea rows="2" oninput="app.updateExpBullet('${exp.id}', ${bIdx}, this.value)" class="w-full text-xs p-2 border border-slate-200 rounded-lg focus:border-teal-500 leading-relaxed text-slate-800">${bullet}</textarea>
                <div class="flex flex-col gap-1 shrink-0">
                  <button onclick="app.aiEnhanceExpBullet('${exp.id}', ${bIdx})" title="AI Enhance with STAR Action Verbs" class="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded text-[11px] font-semibold flex items-center gap-1">
                    <span>✨ AI Enhance</span>
                  </button>
                  <button onclick="app.removeExpBullet('${exp.id}', ${bIdx})" title="Remove bullet" class="px-2 py-0.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded text-[11px]">
                    ✕
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  updateExpField(expId, field, val) {
    const profile = this.store.getProfile();
    const exp = profile.experiences.find(e => e.id === expId);
    if (exp) {
      exp[field] = val;
      this.store.updateProfile(profile);
      this.renderResumeLivePreview();
    }
  }

  updateExpBullet(expId, bIdx, val) {
    const profile = this.store.getProfile();
    const exp = profile.experiences.find(e => e.id === expId);
    if (exp && exp.bullets[bIdx] !== undefined) {
      exp.bullets[bIdx] = val;
      this.store.updateProfile(profile);
      this.renderResumeLivePreview();
    }
  }

  addBulletToExperience(expId) {
    const profile = this.store.getProfile();
    const exp = profile.experiences.find(e => e.id === expId);
    if (exp) {
      exp.bullets.push('Spearheaded key project improvements resulting in 20% latency reduction.');
      this.store.updateProfile(profile);
      this.renderExperienceEditor();
      this.renderResumeLivePreview();
    }
  }

  removeExpBullet(expId, bIdx) {
    const profile = this.store.getProfile();
    const exp = profile.experiences.find(e => e.id === expId);
    if (exp) {
      exp.bullets.splice(bIdx, 1);
      this.store.updateProfile(profile);
      this.renderExperienceEditor();
      this.renderResumeLivePreview();
    }
  }

  moveExperience(index, direction) {
    const profile = this.store.getProfile();
    const newIdx = index + direction;
    if (newIdx >= 0 && newIdx < profile.experiences.length) {
      const item = profile.experiences.splice(index, 1)[0];
      profile.experiences.splice(newIdx, 0, item);
      this.store.updateProfile(profile);
      this.renderExperienceEditor();
      this.renderResumeLivePreview();
    }
  }

  deleteExperience(expId) {
    const profile = this.store.getProfile();
    profile.experiences = profile.experiences.filter(e => e.id !== expId);
    this.store.updateProfile(profile);
    this.renderExperienceEditor();
    this.renderResumeLivePreview();
    this.showToast('Experience entry deleted.');
  }

  aiEnhanceExpBullet(expId, bIdx) {
    const profile = this.store.getProfile();
    const exp = profile.experiences.find(e => e.id === expId);
    if (!exp) return;
    const currentText = exp.bullets[bIdx];
    const enhanced = this.engine.aiEnhanceBullet(currentText);

    this.showDiffModal(
      'AI STAR Action Bullet Enhancement',
      currentText,
      enhanced,
      (accepted) => {
        exp.bullets[bIdx] = accepted;
        this.store.updateProfile(profile);
        this.renderExperienceEditor();
        this.renderResumeLivePreview();
        this.showToast('Bullet point updated with metrics & action verbs!');
      }
    );
  }

  renderEducationEditor() {
    const container = document.getElementById('education-items-container');
    if (!container) return;
    const profile = this.store.getProfile();
    const eduList = profile.education || [];

    container.innerHTML = eduList.map((edu, idx) => `
      <div class="border border-slate-200 rounded-xl p-3 bg-white mb-2 text-xs">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-slate-800">${edu.institution || 'University'}</span>
          <button onclick="app.deleteEducation('${edu.id}')" class="text-rose-500 hover:text-rose-700">✕</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input type="text" value="${edu.degree || ''}" oninput="app.updateEduField('${edu.id}', 'degree', this.value)" placeholder="Degree" class="p-1.5 border border-slate-200 rounded">
          <input type="text" value="${edu.institution || ''}" oninput="app.updateEduField('${edu.id}', 'institution', this.value)" placeholder="Institution" class="p-1.5 border border-slate-200 rounded">
          <input type="text" value="${edu.gradYear || ''}" oninput="app.updateEduField('${edu.id}', 'gradYear', this.value)" placeholder="Graduation Year" class="p-1.5 border border-slate-200 rounded">
          <input type="text" value="${edu.location || ''}" oninput="app.updateEduField('${edu.id}', 'location', this.value)" placeholder="Location" class="p-1.5 border border-slate-200 rounded">
        </div>
        <input type="text" value="${edu.details || ''}" oninput="app.updateEduField('${edu.id}', 'details', this.value)" placeholder="Honors / GPA / Focus" class="w-full p-1.5 border border-slate-200 rounded">
      </div>
    `).join('');
  }

  updateEduField(eduId, field, val) {
    const profile = this.store.getProfile();
    const edu = profile.education.find(e => e.id === eduId);
    if (edu) {
      edu[field] = val;
      this.store.updateProfile(profile);
      this.renderResumeLivePreview();
    }
  }

  deleteEducation(eduId) {
    const profile = this.store.getProfile();
    profile.education = profile.education.filter(e => e.id !== eduId);
    this.store.updateProfile(profile);
    this.renderEducationEditor();
    this.renderResumeLivePreview();
    this.showToast('Education removed.');
  }

  renderSkillsEditor() {
    const container = document.getElementById('skills-tags-container');
    if (!container) return;
    const profile = this.store.getProfile();
    const skills = profile.skills?.technical || [];

    container.innerHTML = skills.map((skill, idx) => `
      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200">
        <span>${skill}</span>
        <button onclick="app.removeSkillTag('${skill}')" class="text-slate-400 hover:text-rose-600 font-bold ml-1">✕</button>
      </span>
    `).join('');
  }

  removeSkillTag(skillName) {
    const profile = this.store.getProfile();
    profile.skills.technical = profile.skills.technical.filter(s => s !== skillName);
    this.store.updateProfile(profile);
    this.renderSkillsEditor();
    this.renderResumeLivePreview();
  }

  renderProjectsEditor() {
    const container = document.getElementById('projects-items-container');
    if (!container) return;
    const profile = this.store.getProfile();
    const projects = profile.projects || [];

    container.innerHTML = projects.map(proj => `
      <div class="border border-slate-200 rounded-xl p-3 bg-white mb-2 text-xs">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-slate-800">${proj.name || 'Project'}</span>
          <button onclick="app.deleteProject('${proj.id}')" class="text-rose-500 hover:text-rose-700">✕</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <input type="text" value="${proj.name || ''}" oninput="app.updateProjField('${proj.id}', 'name', this.value)" placeholder="Project Name" class="p-1.5 border border-slate-200 rounded">
          <input type="text" value="${proj.tech || ''}" oninput="app.updateProjField('${proj.id}', 'tech', this.value)" placeholder="Tech Stack" class="p-1.5 border border-slate-200 rounded">
        </div>
        <input type="text" value="${proj.link || ''}" oninput="app.updateProjField('${proj.id}', 'link', this.value)" placeholder="Link (github or demo)" class="w-full p-1.5 border border-slate-200 rounded mb-2">
        <textarea rows="2" oninput="app.updateProjBullet('${proj.id}', 0, this.value)" class="w-full p-1.5 border border-slate-200 rounded">${proj.bullets?.[0] || ''}</textarea>
      </div>
    `).join('');
  }

  updateProjField(projId, field, val) {
    const profile = this.store.getProfile();
    const proj = profile.projects.find(p => p.id === projId);
    if (proj) {
      proj[field] = val;
      this.store.updateProfile(profile);
      this.renderResumeLivePreview();
    }
  }

  updateProjBullet(projId, bIdx, val) {
    const profile = this.store.getProfile();
    const proj = profile.projects.find(p => p.id === projId);
    if (proj) {
      if (!proj.bullets) proj.bullets = [];
      proj.bullets[bIdx] = val;
      this.store.updateProfile(profile);
      this.renderResumeLivePreview();
    }
  }

  deleteProject(projId) {
    const profile = this.store.getProfile();
    profile.projects = profile.projects.filter(p => p.id !== projId);
    this.store.updateProfile(profile);
    this.renderProjectsEditor();
    this.renderResumeLivePreview();
    this.showToast('Project deleted.');
  }

  renderResumeLivePreview() {
    const previewContainer = document.getElementById('resume-paper');
    if (!previewContainer) return;
    const profile = this.store.getProfile();
    const html = this.templates.render(this.store.activeTemplate, profile);
    previewContainer.innerHTML = html;
  }

  handleExportPdf() {
    this.showToast('Preparing clean ATS PDF document...');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  // ==========================================
  // JOB DESCRIPTION ANALYZER
  // ==========================================
  setupAnalyzerEvents() {
    // 1-Click Sample JD Presets
    document.querySelectorAll('[data-load-sample-jd]').forEach(btn => {
      btn.addEventListener('click', () => {
        const jdId = btn.getAttribute('data-load-sample-jd');
        const sample = SAMPLE_JOB_DESCRIPTIONS.find(s => s.id === jdId);
        if (sample) {
          const titleInput = document.getElementById('analyzer-job-title');
          const companyInput = document.getElementById('analyzer-company');
          const textInput = document.getElementById('analyzer-jd-text');

          if (titleInput) titleInput.value = sample.title;
          if (companyInput) companyInput.value = sample.company;
          if (textInput) textInput.value = sample.description;

          this.store.setActiveJD(sample.title, sample.company, sample.description);
          this.showToast(`Loaded ${sample.company} role preset.`);
        }
      });
    });

    // Run Analysis Button
    const btnAnalyze = document.getElementById('btn-run-analysis');
    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', () => this.runAnalysis());
    }

    // Save As Application Button
    const btnSaveApp = document.getElementById('btn-save-analysis-app');
    if (btnSaveApp) {
      btnSaveApp.addEventListener('click', () => this.saveAnalysisAsApplication());
    }
  }

  renderAnalyzer() {
    const titleInput = document.getElementById('analyzer-job-title');
    const companyInput = document.getElementById('analyzer-company');
    const textInput = document.getElementById('analyzer-jd-text');

    if (this.store.activeJD) {
      if (titleInput) titleInput.value = this.store.activeJD.title || '';
      if (companyInput) companyInput.value = this.store.activeJD.company || '';
      if (textInput) textInput.value = this.store.activeJD.text || '';
    }

    if (this.store.activeAnalysis) {
      this.renderAnalysisResults(this.store.activeAnalysis);
    }
  }

  runAnalysis() {
    const textInput = document.getElementById('analyzer-jd-text');
    const titleInput = document.getElementById('analyzer-job-title');
    const companyInput = document.getElementById('analyzer-company');

    const jdText = textInput ? textInput.value.trim() : '';
    const jobTitle = titleInput ? titleInput.value.trim() : 'Software Engineer';
    const company = companyInput ? companyInput.value.trim() : 'Target Company';

    if (!jdText) {
      this.showToast('Please paste a job description or select a preset to analyze.', 'error');
      return;
    }

    this.store.setActiveJD(jobTitle, company, jdText);

    // Show loading state
    const btn = document.getElementById('btn-run-analysis');
    const loadingState = document.getElementById('analyzer-loading');
    const resultsContainer = document.getElementById('analyzer-results');

    if (btn) btn.disabled = true;
    if (loadingState) loadingState.classList.remove('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    // Simulate intelligent NLP processing
    setTimeout(() => {
      const profile = this.store.getProfile();
      const analysis = this.engine.analyze(profile, jdText, jobTitle, company);
      this.store.setActiveAnalysis(analysis);

      if (btn) btn.disabled = false;
      if (loadingState) loadingState.classList.add('hidden');
      if (resultsContainer) resultsContainer.classList.remove('hidden');

      this.renderAnalysisResults(analysis);
      this.showToast('Job description analysis complete!');
    }, 750);
  }

  renderAnalysisResults(analysis) {
    const resultsContainer = document.getElementById('analyzer-results');
    if (!resultsContainer) return;
    resultsContainer.classList.remove('hidden');

    // Score gauge
    const scoreValEl = document.getElementById('gauge-score-value');
    const scoreCircle = document.getElementById('gauge-circle-bar');
    if (scoreValEl) scoreValEl.textContent = `${analysis.matchScore}%`;
    if (scoreCircle) {
      const circumference = 2 * Math.PI * 45; // r=45
      const offset = circumference - (analysis.matchScore / 100) * circumference;
      scoreCircle.style.strokeDasharray = `${circumference}`;
      scoreCircle.style.strokeDashoffset = `${offset}`;
      scoreCircle.style.stroke = analysis.matchScore >= 80 ? '#0d9488' : '#f59e0b';
    }

    // Role and company labels
    const roleEl = document.getElementById('analysis-target-role');
    if (roleEl) roleEl.textContent = `${analysis.jobTitle} at ${analysis.company}`;

    // Matched skills pills
    const matchedContainer = document.getElementById('analysis-matched-skills');
    if (matchedContainer) {
      const allMatched = [...analysis.strongEvidence, ...analysis.briefEvidence];
      if (allMatched.length === 0) {
        matchedContainer.innerHTML = `<span class="text-xs text-slate-500 italic">No direct keyword overlaps detected yet.</span>`;
      } else {
        matchedContainer.innerHTML = allMatched.map(s => `
          <div class="p-2.5 rounded-lg border text-xs ${s.evidenceLevel === 'strong' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}">
            <div class="flex items-center justify-between font-bold mb-1">
              <span>${s.name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${s.evidenceLevel === 'strong' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                ${s.evidenceLevel === 'strong' ? 'Strong Match' : 'Brief Mention'}
              </span>
            </div>
            <p class="text-[11px] text-slate-600 italic line-clamp-2">
              ${s.excerpts?.[0] || 'Found in resume skills profile.'}
            </p>
          </div>
        `).join('');
      }
    }

    // Missing skills
    const missingContainer = document.getElementById('analysis-missing-skills');
    if (missingContainer) {
      if (analysis.missingSkills.length === 0) {
        missingContainer.innerHTML = `<div class="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium">Outstanding alignment! All critical skills appear in your profile.</div>`;
      } else {
        missingContainer.innerHTML = analysis.missingSkills.map(m => `
          <div class="p-2.5 rounded-lg border bg-rose-50 border-rose-200 text-rose-900 text-xs">
            <div class="flex items-center justify-between font-bold mb-1">
              <span>${m.name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-rose-100 text-rose-800">Gap Found</span>
            </div>
            <p class="text-[11px] text-slate-600">
              Not explicitly evidenced in your current work or projects.
            </p>
          </div>
        `).join('');
      }
    }

    // Suggestions list
    const suggContainer = document.getElementById('analysis-suggestions-list');
    if (suggContainer) {
      suggContainer.innerHTML = (analysis.suggestions || []).map(s => `
        <li class="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span class="text-teal-600 font-bold shrink-0 mt-0.5">💡</span>
          <div>
            <strong class="block text-slate-900 font-semibold mb-0.5">${s.title}</strong>
            <span class="text-slate-600 leading-relaxed">${s.description}</span>
          </div>
        </li>
      `).join('');
    }

    // Responsibilities
    const respContainer = document.getElementById('analysis-responsibilities-list');
    if (respContainer) {
      respContainer.innerHTML = (analysis.responsibilities || []).map(r => `
        <li class="text-xs text-slate-700 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
          <span>${r}</span>
        </li>
      `).join('');
    }
  }

  saveAnalysisAsApplication() {
    if (!this.store.activeAnalysis) {
      this.showToast('Run an analysis first before saving as an application.', 'error');
      return;
    }
    const an = this.store.activeAnalysis;
    const appId = 'app-' + Date.now();
    this.store.saveApplication({
      id: appId,
      jobTitle: an.jobTitle,
      company: an.company,
      status: 'Preparing',
      matchScore: an.matchScore,
      notes: `Analyzed with CareerCraft AI. ${an.missingSkills.length} skill gaps identified.`,
      jobDescription: this.store.activeJD.text
    });

    this.showToast(`Saved ${an.jobTitle} application to tracker!`);
    this.switchView('applications');
  }

  // ==========================================
  // SKILL GAP GUIDANCE
  // ==========================================
  renderGaps() {
    const analysis = this.store.activeAnalysis || this.engine.analyze(
      this.store.getProfile(),
      this.store.activeJD.text,
      this.store.activeJD.title,
      this.store.activeJD.company
    );
    this.store.setActiveAnalysis(analysis);

    // Render Group 1: Strong Evidence
    const strongContainer = document.getElementById('gaps-strong-container');
    if (strongContainer) {
      strongContainer.innerHTML = analysis.strongEvidence.map(item => `
        <div class="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl mb-2 text-xs">
          <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
            <span class="text-emerald-900 font-semibold text-sm">${item.name}</span>
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[10px]">Verified in Work History</span>
          </div>
          <div class="text-slate-600 mt-1 italic text-[11px]">
            ${item.excerpts?.join(' • ') || 'Evidenced with concrete metrics.'}
          </div>
        </div>
      `).join('') || '<p class="text-xs text-slate-500 italic">No strong matches yet.</p>';
    }

    // Render Group 2: Mentioned Briefly
    const briefContainer = document.getElementById('gaps-brief-container');
    if (briefContainer) {
      briefContainer.innerHTML = analysis.briefEvidence.map(item => {
        const gapKey = `brief_${item.name}`;
        const isDone = this.store.gapProgress[gapKey]?.completed;
        return `
          <div class="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl mb-2.5 text-xs">
            <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
              <span class="text-amber-900 font-semibold text-sm">${item.name}</span>
              <label class="flex items-center gap-1.5 text-[11px] font-normal cursor-pointer">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="app.toggleGapCheckbox('${gapKey}', 'completed')" class="rounded text-teal-600 focus:ring-teal-500">
                <span class="${isDone ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}">Add bullet to resume</span>
              </label>
            </div>
            <div class="text-slate-600 mt-1 text-[11px] leading-relaxed">
              <strong>Observation:</strong> Appears in skills list, but needs quantified impact in your experience bullet points.
            </div>
            <div class="mt-2 p-2 bg-white/80 rounded border border-amber-100 text-[11px] text-amber-900">
              💡 <strong>Action Tip:</strong> Detail how you applied ${item.name} at your latest role. Always preserve factual truthfulness.
            </div>
          </div>
        `;
      }).join('') || '<p class="text-xs text-slate-500 italic">No items in brief mention.</p>';
    }

    // Render Group 3: Not Found in Resume
    const missingContainer = document.getElementById('gaps-missing-container');
    if (missingContainer) {
      missingContainer.innerHTML = analysis.missingSkills.map(item => {
        const gapKey = `missing_${item.name}`;
        const isDone = this.store.gapProgress[gapKey]?.completed;
        const res = LEARNING_RESOURCES[item.name] || {
          course: `Official ${item.name} Documentation & Architecture Guides`,
          projectIdea: `Construct a small prototype demonstrating ${item.name} core patterns.`,
          highlightTip: `If you have academic exposure, coursework, or adjacent experience, introduce it in your Projects section.`
        };

        return `
          <div class="p-4 bg-rose-50/40 border border-rose-200 rounded-xl mb-3 text-xs">
            <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
              <div class="flex items-center gap-2">
                <span class="text-rose-900 font-bold text-sm">${item.name}</span>
                <span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-medium text-[10px]">Missing Requirement</span>
              </div>
              <label class="flex items-center gap-1.5 text-[11px] font-normal cursor-pointer">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="app.toggleGapCheckbox('${gapKey}', 'completed')" class="rounded text-teal-600 focus:ring-teal-500">
                <span class="${isDone ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}">Mark Plan Complete</span>
              </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5">
              <div class="p-2.5 bg-white rounded-lg border border-rose-100">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">📚 Recommended Learning Pathway</div>
                <div class="text-slate-800 font-medium text-[11px]">${res.course}</div>
              </div>
              <div class="p-2.5 bg-white rounded-lg border border-rose-100">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">🛠️ Mini Portfolio Project Blueprint</div>
                <div class="text-slate-800 text-[11px]">${res.projectIdea}</div>
              </div>
            </div>

            <div class="mt-2.5 text-[11px] text-slate-600 flex items-center gap-2">
              <span class="text-teal-700 font-bold">Advice:</span>
              <span>${res.highlightTip}</span>
            </div>
          </div>
        `;
      }).join('') || '<p class="text-xs text-slate-500 italic">No missing skills detected!</p>';
    }
  }

  toggleGapCheckbox(gapKey, type) {
    this.store.toggleGapStatus(gapKey, type);
    this.renderGaps();
    this.showToast('Progress updated.');
  }

  // ==========================================
  // INTERVIEW PREPARATION
  // ==========================================
  renderInterview() {
    const analysis = this.store.activeAnalysis || this.engine.analyze(
      this.store.getProfile(),
      this.store.activeJD.text,
      this.store.activeJD.title,
      this.store.activeJD.company
    );
    const questions = this.engine.generateInterviewQuestions(this.store.getProfile(), analysis);

    // Question category counts
    const countTotal = questions.length;
    const masteredCount = questions.filter(q => this.store.interviewData[q.id]?.status === 'mastered').length;

    const progEl = document.getElementById('interview-progress-label');
    if (progEl) progEl.textContent = `${masteredCount} of ${countTotal} Mastered`;

    // Category filter tabs
    document.querySelectorAll('[data-interview-filter]').forEach(btn => {
      btn.onclick = () => {
        this.interviewFilter = btn.getAttribute('data-interview-filter');
        document.querySelectorAll('[data-interview-filter]').forEach(b => {
          b.classList.remove('bg-teal-600', 'text-white');
          b.classList.add('bg-white', 'text-slate-600');
        });
        btn.classList.add('bg-teal-600', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-600');
        this.renderInterviewQuestionCards(questions);
      };
    });

    this.renderInterviewQuestionCards(questions);
  }

  renderInterviewQuestionCards(questions) {
    const container = document.getElementById('interview-questions-list');
    if (!container) return;

    const filtered = this.interviewFilter === 'all'
      ? questions
      : questions.filter(q => q.category === this.interviewFilter);

    container.innerHTML = filtered.map((q, idx) => {
      const isMastered = this.store.interviewData[q.id]?.status === 'mastered';
      const userNote = this.store.interviewData[q.id]?.notes || '';

      return `
        <div class="border border-slate-200 rounded-xl bg-white p-5 mb-4 shadow-xs" id="q-card-${q.id}">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${q.category === 'behavioral' ? 'bg-purple-50 text-purple-700 border border-purple-200' : (q.category === 'technical' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200')}">
                ${q.type}
              </span>
              <span class="text-xs text-slate-500">${q.groundingNote}</span>
            </div>
            <button onclick="app.toggleQuestionMastery('${q.id}')" class="px-3 py-1 rounded-lg text-xs font-semibold transition ${isMastered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
              ${isMastered ? '✓ Mastered' : 'Mark as Mastered'}
            </button>
          </div>

          <h3 class="font-bold text-slate-900 text-base mt-3 mb-2 leading-snug">${q.question}</h3>
          <p class="text-xs text-slate-500 mb-4 italic">${q.context}</p>

          <!-- Expandable Suggested Outline -->
          <details class="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
            <summary class="font-semibold text-teal-800 cursor-pointer select-none">
              💡 Reveal Suggested Answer Outline (Grounded in your Experience)
            </summary>
            <div class="mt-3 space-y-2 text-slate-700 pl-2 border-l-2 border-teal-500">
              <div><strong class="text-teal-900">Situation:</strong> ${q.suggestedOutline.situation}</div>
              <div><strong class="text-teal-900">Task:</strong> ${q.suggestedOutline.task}</div>
              <div><strong class="text-teal-900">Action:</strong> ${q.suggestedOutline.action}</div>
              <div><strong class="text-teal-900">Result:</strong> ${q.suggestedOutline.result}</div>
            </div>
          </details>

          <!-- User Answer Scratchpad -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">My Practice Notes & Talking Points:</label>
            <textarea rows="3" oninput="app.saveQuestionNote('${q.id}', this.value)" class="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:border-teal-500 leading-relaxed text-slate-800" placeholder="Draft your personal STAR talking points here...">${userNote}</textarea>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleQuestionMastery(questionId) {
    const current = this.store.interviewData[questionId]?.status;
    const next = current === 'mastered' ? 'practice' : 'mastered';
    this.store.toggleInterviewStatus(questionId, next);
    this.renderInterview();
    this.showToast(next === 'mastered' ? 'Question marked as Mastered!' : 'Question marked for practice.');
  }

  saveQuestionNote(questionId, text) {
    this.store.saveInterviewNote(questionId, text);
  }

  // ==========================================
  // SAVED APPLICATIONS
  // ==========================================
  setupApplicationsEvents() {
    // Filter by status buttons
    document.querySelectorAll('[data-app-status-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeApplicationFilter = btn.getAttribute('data-app-status-filter');
        document.querySelectorAll('[data-app-status-filter]').forEach(b => {
          b.classList.remove('bg-teal-600', 'text-white');
          b.classList.add('bg-white', 'text-slate-600');
        });
        btn.classList.add('bg-teal-600', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-600');
        this.renderApplications();
      });
    });

    // Search Applications
    const searchInput = document.getElementById('search-applications');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderApplications(e.target.value.toLowerCase());
      });
    }

    // New Application modal button
    const btnNewApp = document.getElementById('btn-create-new-app');
    if (btnNewApp) {
      btnNewApp.addEventListener('click', () => {
        this.switchView('analyzer');
        this.showToast('Paste a target job description to create your application package.');
      });
    }
  }

  renderApplications(query = '') {
    const container = document.getElementById('applications-list-container');
    const emptyContainer = document.getElementById('applications-empty');
    if (!container) return;

    let apps = this.store.getApplications();

    if (this.activeApplicationFilter !== 'All') {
      apps = apps.filter(a => a.status === this.activeApplicationFilter);
    }

    if (query) {
      apps = apps.filter(a => 
        (a.jobTitle || '').toLowerCase().includes(query) ||
        (a.company || '').toLowerCase().includes(query)
      );
    }

    if (apps.length === 0) {
      container.innerHTML = '';
      if (emptyContainer) emptyContainer.classList.remove('hidden');
      return;
    }

    if (emptyContainer) emptyContainer.classList.add('hidden');

    container.innerHTML = apps.map(app => {
      let statusColor = 'bg-slate-100 text-slate-700';
      if (app.status === 'Interviewing') statusColor = 'bg-emerald-100 text-emerald-800';
      else if (app.status === 'Applied') statusColor = 'bg-blue-100 text-blue-800';
      else if (app.status === 'Preparing') statusColor = 'bg-amber-100 text-amber-800';
      else if (app.status === 'Archived') statusColor = 'bg-slate-200 text-slate-500';

      return `
        <div class="border border-slate-200 rounded-2xl bg-white p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between mb-4">
          <div>
            <div class="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 class="font-bold text-slate-900 text-base">${app.jobTitle}</h3>
                <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span class="font-semibold text-slate-800">${app.company}</span>
                  ${app.location ? `<span>• ${app.location}</span>` : ''}
                  ${app.salary ? `<span>• ${app.salary}</span>` : ''}
                </div>
              </div>

              <!-- Status Dropdown Selector -->
              <select onchange="app.updateAppStatus('${app.id}', this.value)" class="text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 focus:ring-teal-500">
                <option value="Draft" ${app.status === 'Draft' ? 'selected' : ''}>Draft</option>
                <option value="Preparing" ${app.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                <option value="Interviewing" ${app.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                <option value="Archived" ${app.status === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
            </div>

            <!-- Match Score & Metadata -->
            <div class="flex items-center gap-4 my-3 text-xs">
              <div class="flex items-center gap-1.5 font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                <span>🎯</span>
                <span>${app.matchScore || 75}% Match</span>
              </div>
              <span class="text-slate-500">Updated: ${app.lastUpdated}</span>
              ${app.appliedDate ? `<span class="text-slate-500">Applied: ${app.appliedDate}</span>` : ''}
            </div>

            <!-- Notes -->
            ${app.notes ? `<p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">${app.notes}</p>` : ''}
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div class="flex items-center gap-2">
              <button onclick="app.openApplicationInAnalyzer('${app.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition">
                🔍 Review Match
              </button>
              <button onclick="app.openApplicationInInterview('${app.id}')" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition">
                🎙️ Practice Questions
              </button>
              <button onclick="app.openApplicationInBuilder('${app.id}')" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-medium transition">
                📝 Tailor Resume
              </button>
            </div>

            <button onclick="app.confirmDeleteApplication('${app.id}')" title="Delete application" class="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  updateAppStatus(appId, newStatus) {
    this.store.updateApplicationStatus(appId, newStatus);
    this.showToast(`Application status updated to "${newStatus}"`);
    this.renderApplications();
  }

  openApplicationInAnalyzer(appId) {
    const app = this.store.getApplication(appId);
    if (!app) return;
    this.store.setActiveJD(app.jobTitle, app.company, app.jobDescription);
    this.switchView('analyzer');
    this.runAnalysis();
  }

  openApplicationInInterview(appId) {
    const app = this.store.getApplication(appId);
    if (!app) return;
    this.store.setActiveJD(app.jobTitle, app.company, app.jobDescription);
    const analysis = this.engine.analyze(this.store.getProfile(), app.jobDescription, app.jobTitle, app.company);
    this.store.setActiveAnalysis(analysis);
    this.switchView('interview');
  }

  openApplicationInBuilder(appId) {
    this.switchView('builder');
  }

  confirmDeleteApplication(appId) {
    const app = this.store.getApplication(appId);
    if (!app) return;
    this.showConfirmModal(
      'Delete Application Record',
      `Are you sure you want to remove the application for "${app.jobTitle} at ${app.company}"? This action cannot be undone.`,
      () => {
        this.store.deleteApplication(appId);
        this.renderApplications();
        this.showToast('Application deleted.');
      }
    );
  }

  // ==========================================
  // SETTINGS & PROFILE
  // ==========================================
  setupSettingsEvents() {
    const btnResetDemo = document.getElementById('btn-reset-demo-data');
    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        this.showConfirmModal(
          'Reset to Realistic Demo Data',
          'This will restore all default profiles, sample job postings, applications, and practice data. Any custom edits will be reset.',
          () => {
            this.store.resetToDemoData();
            this.renderBuilder();
            this.renderDashboard();
            this.showToast('Demo data restored successfully!');
          }
        );
      });
    }

    const btnExportData = document.getElementById('btn-export-json-backup');
    if (btnExportData) {
      btnExportData.addEventListener('click', () => {
        const fullBackup = {
          profile: this.store.getProfile(),
          applications: this.store.getApplications(),
          gapProgress: this.store.gapProgress,
          interviewNotes: this.store.interviewData
        };
        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `careercraft_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('CareerCraft backup exported as JSON.');
      });
    }
  }

  renderSettings() {
    const profile = this.store.getProfile();
    const nameEl = document.getElementById('settings-user-name');
    const emailEl = document.getElementById('settings-user-email');
    if (nameEl) nameEl.textContent = profile.name || 'Alex Morgan';
    if (emailEl) emailEl.textContent = profile.email || 'alex.morgan@email.com';
  }

  // ==========================================
  // GLOBAL MODALS & TOASTS
  // ==========================================
  setupGlobalEvents() {
    // Diff Modal Close
    const diffModalClose = document.getElementById('btn-close-diff-modal');
    const diffModalDiscard = document.getElementById('btn-discard-diff');
    const diffModal = document.getElementById('diff-modal');

    if (diffModalClose && diffModal) {
      diffModalClose.addEventListener('click', () => diffModal.classList.add('hidden'));
    }
    if (diffModalDiscard && diffModal) {
      diffModalDiscard.addEventListener('click', () => diffModal.classList.add('hidden'));
    }

    // Confirm Modal Close
    const confModal = document.getElementById('confirm-modal');
    const confCancel = document.getElementById('btn-cancel-confirm');
    if (confCancel && confModal) {
      confCancel.addEventListener('click', () => confModal.classList.add('hidden'));
    }
  }

  showDiffModal(title, originalText, suggestedText, onApplyCallback) {
    const modal = document.getElementById('diff-modal');
    const titleEl = document.getElementById('diff-modal-title');
    const origEl = document.getElementById('diff-original-content');
    const suggEl = document.getElementById('diff-suggested-content');
    const applyBtn = document.getElementById('btn-apply-diff');

    if (!modal) return;

    if (titleEl) titleEl.textContent = title;
    if (origEl) origEl.textContent = originalText;
    if (suggEl) suggEl.value = suggestedText;

    if (applyBtn) {
      applyBtn.onclick = () => {
        const finalVal = suggEl ? suggEl.value : suggestedText;
        onApplyCallback(finalVal);
        modal.classList.add('hidden');
      };
    }

    modal.classList.remove('hidden');
  }

  showConfirmModal(title, message, onConfirmCallback) {
    const modal = document.getElementById('confirm-modal');
    const titleEl = document.getElementById('confirm-modal-title');
    const msgEl = document.getElementById('confirm-modal-message');
    const okBtn = document.getElementById('btn-ok-confirm');

    if (!modal) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (okBtn) {
      okBtn.onclick = () => {
        onConfirmCallback();
        modal.classList.add('hidden');
      };
    }

    modal.classList.remove('hidden');
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p-3 px-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all duration-300 transform translate-y-2 opacity-0 ${
      type === 'error' ? 'bg-rose-900 text-white border-rose-700' : 'bg-slate-900 text-white border-slate-800'
    }`;
    toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✓'}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  handleStoreUpdate(event, data) {
    if (event === 'profile' || event === 'template') {
      this.renderResumeLivePreview();
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CareerCraftApp();
});
