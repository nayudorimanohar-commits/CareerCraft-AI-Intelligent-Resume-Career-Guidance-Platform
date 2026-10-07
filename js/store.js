/**
 * CareerCraft AI - LocalStorage State Store & Persistence Layer
 */

class AppStore {
  constructor() {
    this.STORAGE_KEY_PREFIX = 'careercraft_ai_';
    this.listeners = [];
    this.init();
  }

  init() {
    // 1. Current Profile / Master Resume
    const storedProfile = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'profile');
    if (storedProfile) {
      try {
        this.profile = JSON.parse(storedProfile);
      } catch (e) {
        this.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILES.alex_morgan));
      }
    } else {
      this.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILES.alex_morgan));
      this.saveProfile();
    }

    // 2. Saved Applications
    const storedApps = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'applications');
    if (storedApps) {
      try {
        this.applications = JSON.parse(storedApps);
      } catch (e) {
        this.applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
      }
    } else {
      this.applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
      this.saveApplications();
    }

    // 3. User settings & active selections
    this.activeApplicationId = this.applications[0]?.id || null;
    this.activeTemplate = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'template') || 'modern';
    this.currentView = 'landing'; // default starting view is landing or dashboard
    
    // 4. Current working job description in analyzer
    const storedJD = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'active_jd');
    this.activeJD = storedJD ? JSON.parse(storedJD) : {
      title: SAMPLE_JOB_DESCRIPTIONS[0].title,
      company: SAMPLE_JOB_DESCRIPTIONS[0].company,
      text: SAMPLE_JOB_DESCRIPTIONS[0].description
    };

    // 5. Current Analysis Result
    this.activeAnalysis = null;

    // 6. Interview Practice Notes & Status
    const storedNotes = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'interview_notes');
    this.interviewData = storedNotes ? JSON.parse(storedNotes) : {};

    // 7. Skill Gap Progress
    const storedGaps = localStorage.getItem(this.STORAGE_KEY_PREFIX + 'gap_progress');
    this.gapProgress = storedGaps ? JSON.parse(storedGaps) : {};
  }

  // --- Profile / Resume CRUD ---
  getProfile() {
    return this.profile;
  }

  updateProfile(newProfile) {
    this.profile = { ...this.profile, ...newProfile };
    this.saveProfile();
    this.notify('profile', this.profile);
  }

  saveProfile() {
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'profile', JSON.stringify(this.profile));
  }

  setTemplate(templateName) {
    this.activeTemplate = templateName;
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'template', templateName);
    this.notify('template', templateName);
  }

  // --- Applications CRUD ---
  getApplications() {
    return this.applications;
  }

  getApplication(id) {
    return this.applications.find(a => a.id === id);
  }

  saveApplication(appData) {
    const existingIndex = this.applications.findIndex(a => a.id === appData.id);
    const now = new Date().toISOString().split('T')[0];
    if (existingIndex >= 0) {
      this.applications[existingIndex] = {
        ...this.applications[existingIndex],
        ...appData,
        lastUpdated: now
      };
    } else {
      const newApp = {
        id: appData.id || 'app-' + Date.now(),
        jobTitle: appData.jobTitle || 'New Role',
        company: appData.company || 'Target Company',
        location: appData.location || '',
        salary: appData.salary || '',
        status: appData.status || 'Draft',
        appliedDate: appData.appliedDate || '',
        lastUpdated: now,
        matchScore: appData.matchScore || 70,
        notes: appData.notes || '',
        jobDescription: appData.jobDescription || '',
        gapProgress: appData.gapProgress || {},
        interviewData: appData.interviewData || {},
        tailoredResume: appData.tailoredResume || JSON.parse(JSON.stringify(this.profile))
      };
      this.applications.unshift(newApp);
      this.activeApplicationId = newApp.id;
    }
    this.saveApplications();
    this.notify('applications', this.applications);
    return appData.id;
  }

  deleteApplication(id) {
    this.applications = this.applications.filter(a => a.id !== id);
    if (this.activeApplicationId === id) {
      this.activeApplicationId = this.applications[0]?.id || null;
    }
    this.saveApplications();
    this.notify('applications', this.applications);
  }

  updateApplicationStatus(id, newStatus) {
    const app = this.getApplication(id);
    if (app) {
      app.status = newStatus;
      app.lastUpdated = new Date().toISOString().split('T')[0];
      if (newStatus === 'Applied' && !app.appliedDate) {
        app.appliedDate = app.lastUpdated;
      }
      this.saveApplications();
      this.notify('applications', this.applications);
    }
  }

  saveApplications() {
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'applications', JSON.stringify(this.applications));
  }

  // --- Active JD & Analysis ---
  setActiveJD(title, company, text) {
    this.activeJD = { title, company, text };
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'active_jd', JSON.stringify(this.activeJD));
  }

  setActiveAnalysis(analysis) {
    this.activeAnalysis = analysis;
    this.notify('analysis', analysis);
  }

  // --- Skill Gap Tracker ---
  toggleGapStatus(gapKey, statusType) { // statusType: 'completed' | 'saved'
    if (!this.gapProgress[gapKey]) {
      this.gapProgress[gapKey] = { completed: false, saved: false };
    }
    if (statusType === 'completed') {
      this.gapProgress[gapKey].completed = !this.gapProgress[gapKey].completed;
    } else if (statusType === 'saved') {
      this.gapProgress[gapKey].saved = !this.gapProgress[gapKey].saved;
    }
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'gap_progress', JSON.stringify(this.gapProgress));
    this.notify('gaps', this.gapProgress);
  }

  // --- Interview Question Practice Tracker ---
  saveInterviewNote(questionId, noteText) {
    if (!this.interviewData[questionId]) {
      this.interviewData[questionId] = {};
    }
    this.interviewData[questionId].notes = noteText;
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'interview_notes', JSON.stringify(this.interviewData));
  }

  toggleInterviewStatus(questionId, status) { // 'mastered' | 'practice'
    if (!this.interviewData[questionId]) {
      this.interviewData[questionId] = {};
    }
    this.interviewData[questionId].status = status;
    localStorage.setItem(this.STORAGE_KEY_PREFIX + 'interview_notes', JSON.stringify(this.interviewData));
    this.notify('interview', this.interviewData);
  }

  // --- Reset & Demo Switching ---
  loadSampleProfile(profileKey) {
    if (DEFAULT_PROFILES[profileKey]) {
      this.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILES[profileKey]));
      this.saveProfile();
      this.notify('profile', this.profile);
    }
  }

  resetToDemoData() {
    localStorage.clear();
    this.init();
    this.notify('reset', null);
  }

  createEmptyResume() {
    this.profile = {
      id: 'empty_user',
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: '',
      experiences: [],
      education: [],
      skills: {
        technical: [],
        devops: [],
        methodologies: []
      },
      projects: [],
      certifications: []
    };
    this.saveProfile();
    this.notify('profile', this.profile);
  }

  // --- Pub/Sub ---
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify(event, data) {
    this.listeners.forEach(fn => {
      try {
        fn(event, data);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }
}

// Global Store Instance
window.store = new AppStore();
