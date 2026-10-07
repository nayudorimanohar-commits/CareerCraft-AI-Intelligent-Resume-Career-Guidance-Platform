/**
 * CareerCraft AI - Clean, ATS-Friendly Resume Template Renderers
 */

const ResumeTemplates = {
  /**
   * 1. Modern Minimalist Template
   * Clean teal accent, structured sections, crisp dividers, high ATS parse rate.
   */
  renderModern(profile) {
    const p = profile || {};
    const name = p.name || 'Your Name';
    const title = p.title || 'Professional Title';
    const email = p.email || '';
    const phone = p.phone || '';
    const location = p.location || '';
    const linkedin = p.linkedin || '';
    const github = p.github || '';
    const portfolio = p.portfolio || '';
    const summary = p.summary || '';

    // Contact line
    const contacts = [
      email ? `<span class="inline-flex items-center gap-1">${email}</span>` : '',
      phone ? `<span class="inline-flex items-center gap-1">${phone}</span>` : '',
      location ? `<span class="inline-flex items-center gap-1">${location}</span>` : '',
      linkedin ? `<span class="inline-flex items-center gap-1">${linkedin}</span>` : '',
      github ? `<span class="inline-flex items-center gap-1">${github}</span>` : '',
      portfolio ? `<span class="inline-flex items-center gap-1">${portfolio}</span>` : ''
    ].filter(Boolean).join(' • ');

    // Skills
    const techSkills = p.skills?.technical || [];
    const devopsSkills = p.skills?.devops || [];
    const methodSkills = p.skills?.methodologies || [];

    // Experience HTML
    const expHtml = (p.experiences || []).map(exp => `
      <div class="resume-experience-entry mb-4">
        <div class="flex flex-wrap items-baseline justify-between mb-1">
          <h4 class="font-bold text-slate-900 text-sm md:text-base">${exp.title || 'Title'}</h4>
          <span class="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}</span>
        </div>
        <div class="text-xs text-slate-600 font-medium mb-1.5 flex items-center gap-2">
          <span class="text-slate-800 font-semibold">${exp.company || 'Company'}</span>
          ${exp.location ? `<span>| ${exp.location}</span>` : ''}
        </div>
        <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
          ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    // Education HTML
    const eduHtml = (p.education || []).map(edu => `
      <div class="mb-3">
        <div class="flex items-baseline justify-between">
          <h4 class="font-bold text-slate-900 text-sm">${edu.degree || 'Degree'}</h4>
          <span class="text-xs text-slate-600 font-medium">${edu.gradYear || ''}</span>
        </div>
        <div class="text-xs text-slate-700 font-medium">${edu.institution || ''} ${edu.location ? `• ${edu.location}` : ''}</div>
        ${edu.details ? `<div class="text-xs text-slate-600 mt-0.5">${edu.details}</div>` : ''}
      </div>
    `).join('');

    // Projects HTML
    const projHtml = (p.projects || []).map(proj => `
      <div class="resume-project-entry mb-3">
        <div class="flex items-baseline justify-between">
          <h4 class="font-bold text-slate-900 text-sm">${proj.name || 'Project Name'}</h4>
          ${proj.link ? `<span class="text-xs text-teal-700 font-mono">${proj.link}</span>` : ''}
        </div>
        ${proj.tech ? `<div class="text-xs text-slate-600 font-mono font-medium mb-1">Tech Stack: ${proj.tech}</div>` : ''}
        <ul class="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5">
          ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    // Certifications HTML
    const certHtml = (p.certifications || []).map(cert => `
      <div class="text-xs text-slate-800 mb-1">
        <span class="font-bold text-slate-900">${cert.name}</span>
        ${cert.issuer ? `<span class="text-slate-600"> — ${cert.issuer}</span>` : ''}
        ${cert.year ? `<span class="text-slate-500 font-semibold"> (${cert.year})</span>` : ''}
      </div>
    `).join('');

    return `
      <div class="p-8 md:p-10 font-sans text-slate-900 leading-relaxed">
        <!-- Header -->
        <header class="border-b-2 border-teal-600 pb-4 mb-5">
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">${name}</h1>
          <h2 class="text-sm md:text-base font-semibold text-teal-700 mt-0.5 tracking-wide">${title}</h2>
          <div class="text-xs text-slate-600 mt-2 flex flex-wrap gap-x-2 gap-y-1">
            ${contacts}
          </div>
        </header>

        <!-- Summary -->
        ${summary ? `
        <section class="mb-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">Professional Summary</h3>
          <p class="text-xs md:text-sm text-slate-700 text-justify leading-normal">${summary}</p>
        </section>
        ` : ''}

        <!-- Skills Section (ATS Optimized) -->
        <section class="mb-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">Technical Skills & Competencies</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            ${techSkills.length ? `<div><span class="font-bold text-slate-900">Core Technologies:</span> <span class="text-slate-700">${techSkills.join(', ')}</span></div>` : ''}
            ${devopsSkills.length ? `<div><span class="font-bold text-slate-900">Cloud & DevOps:</span> <span class="text-slate-700">${devopsSkills.join(', ')}</span></div>` : ''}
            ${methodSkills.length ? `<div><span class="font-bold text-slate-900">Architecture & Methods:</span> <span class="text-slate-700">${methodSkills.join(', ')}</span></div>` : ''}
          </div>
        </section>

        <!-- Experience Section -->
        ${expHtml ? `
        <section class="mb-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-3">Work Experience</h3>
          ${expHtml}
        </section>
        ` : ''}

        <!-- Projects Section -->
        ${projHtml ? `
        <section class="mb-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">Key Projects</h3>
          ${projHtml}
        </section>
        ` : ''}

        <!-- Education Section -->
        ${eduHtml ? `
        <section class="mb-5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">Education</h3>
          ${eduHtml}
        </section>
        ` : ''}

        <!-- Certifications -->
        ${certHtml ? `
        <section class="mb-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">Certifications & Honors</h3>
          <div class="space-y-1">
            ${certHtml}
          </div>
        </section>
        ` : ''}
      </div>
    `;
  },

  /**
   * 2. Executive Classic Template
   * Elegant serif headings, centered contact block, traditional corporate layout.
   */
  renderClassic(profile) {
    const p = profile || {};
    const name = p.name || 'Your Name';
    const title = p.title || 'Professional Title';
    const email = p.email || '';
    const phone = p.phone || '';
    const location = p.location || '';
    const linkedin = p.linkedin || '';
    const summary = p.summary || '';

    const contacts = [location, phone, email, linkedin].filter(Boolean).join('  |  ');

    return `
      <div class="p-8 md:p-10 font-serif text-slate-900 leading-normal">
        <!-- Centered Classic Header -->
        <header class="text-center pb-4 mb-4 border-b border-slate-400">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 uppercase">${name}</h1>
          <p class="text-sm font-semibold tracking-wide text-slate-700 italic mt-0.5">${title}</p>
          <p class="text-xs font-sans text-slate-600 mt-2">${contacts}</p>
        </header>

        <!-- Summary -->
        ${summary ? `
        <section class="mb-4">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">Executive Profile</h3>
          <p class="text-xs text-slate-800 leading-relaxed text-justify">${summary}</p>
        </section>
        ` : ''}

        <!-- Experience -->
        ${(p.experiences && p.experiences.length > 0) ? `
        <section class="mb-4">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5 font-sans">Professional Experience</h3>
          ${p.experiences.map(exp => `
            <div class="mb-3.5">
              <div class="flex justify-between items-baseline font-sans">
                <span class="font-bold text-sm text-slate-900">${exp.company}</span>
                <span class="text-xs text-slate-600">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div class="flex justify-between items-baseline italic text-xs text-slate-800 mb-1">
                <span>${exp.title}</span>
                <span class="font-sans text-slate-500">${exp.location || ''}</span>
              </div>
              <ul class="list-disc list-outside ml-4 text-xs text-slate-800 space-y-1">
                ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
        ` : ''}

        <!-- Education -->
        ${(p.education && p.education.length > 0) ? `
        <section class="mb-4">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">Education</h3>
          ${p.education.map(edu => `
            <div class="mb-2">
              <div class="flex justify-between items-baseline font-sans">
                <span class="font-bold text-xs text-slate-900">${edu.institution}</span>
                <span class="text-xs text-slate-600">${edu.gradYear}</span>
              </div>
              <div class="text-xs italic text-slate-800">${edu.degree} ${edu.location ? `— ${edu.location}` : ''}</div>
              ${edu.details ? `<div class="text-xs font-sans text-slate-600 mt-0.5">${edu.details}</div>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}

        <!-- Skills -->
        <section class="mb-4">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">Core Competencies</h3>
          <div class="text-xs text-slate-800 space-y-1 font-sans">
            <div><strong>Technical:</strong> ${(p.skills?.technical || []).join(' • ')}</div>
            <div><strong>Cloud & Tools:</strong> ${(p.skills?.devops || []).join(' • ')}</div>
            <div><strong>Leadership & Practices:</strong> ${(p.skills?.methodologies || []).join(' • ')}</div>
          </div>
        </section>
      </div>
    `;
  },

  /**
   * 3. Tech & Engineering Template
   * High density, monospace skill tags, project-forward layout.
   */
  renderTech(profile) {
    const p = profile || {};
    const name = p.name || 'Your Name';
    const title = p.title || 'Professional Title';
    const email = p.email || '';
    const phone = p.phone || '';
    const location = p.location || '';
    const github = p.github || '';
    const portfolio = p.portfolio || '';

    const contacts = [
      email ? `<span class="text-indigo-600 font-mono">${email}</span>` : '',
      phone ? `<span>${phone}</span>` : '',
      location ? `<span>${location}</span>` : '',
      github ? `<span class="font-mono text-slate-700">${github}</span>` : '',
      portfolio ? `<span class="font-mono text-indigo-600">${portfolio}</span>` : ''
    ].filter(Boolean).join(' | ');

    return `
      <div class="p-8 md:p-10 font-sans text-slate-900">
        <!-- Tech Header -->
        <header class="border-b border-indigo-200 pb-4 mb-4">
          <div class="flex flex-wrap justify-between items-end">
            <div>
              <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">${name}</h1>
              <p class="text-sm font-semibold text-indigo-600 font-mono mt-0.5">&gt; ${title}</p>
            </div>
          </div>
          <div class="text-xs text-slate-600 mt-2 flex flex-wrap gap-2">
            ${contacts}
          </div>
        </header>

        <!-- Technical Skills Badges -->
        <section class="mb-4 bg-slate-50 border border-slate-200 p-3 rounded-lg">
          <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">// TECHNICAL_SKILLS</h3>
          <div class="space-y-1 text-xs">
            <div class="flex flex-wrap gap-1 items-center">
              <span class="font-bold text-slate-800 text-[11px] w-24">LANGUAGES:</span>
              ${(p.skills?.technical || []).map(s => `<span class="bg-white border border-slate-300 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono">${s}</span>`).join('')}
            </div>
            <div class="flex flex-wrap gap-1 items-center mt-1">
              <span class="font-bold text-slate-800 text-[11px] w-24">INFRA / TOOLS:</span>
              ${(p.skills?.devops || []).map(s => `<span class="bg-indigo-50 border border-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded text-[11px] font-mono">${s}</span>`).join('')}
            </div>
          </div>
        </section>

        <!-- Experience -->
        ${(p.experiences && p.experiences.length > 0) ? `
        <section class="mb-4">
          <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">// EXPERIENCE</h3>
          ${p.experiences.map(exp => `
            <div class="mb-3.5 pl-3 border-l-2 border-indigo-400">
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-slate-900 text-sm">${exp.title} @ <span class="text-indigo-600">${exp.company}</span></span>
                <span class="text-xs font-mono text-slate-500">${exp.startDate} – ${exp.current ? 'PRESENT' : exp.endDate}</span>
              </div>
              <ul class="list-disc list-outside ml-4 mt-1 text-xs text-slate-700 space-y-1">
                ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
        ` : ''}

        <!-- Projects -->
        ${(p.projects && p.projects.length > 0) ? `
        <section class="mb-4">
          <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">// OPEN_SOURCE_PROJECTS</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${p.projects.map(proj => `
              <div class="border border-slate-200 p-2.5 rounded bg-white">
                <div class="font-bold text-xs text-slate-900 flex justify-between">
                  <span>${proj.name}</span>
                  ${proj.link ? `<span class="text-indigo-500 font-mono text-[10px]">${proj.link}</span>` : ''}
                </div>
                <div class="text-[11px] font-mono text-indigo-700 mb-1">${proj.tech}</div>
                <ul class="list-disc ml-3 text-xs text-slate-600 space-y-0.5">
                  ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Education -->
        ${(p.education && p.education.length > 0) ? `
        <section class="mb-2">
          <h3 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">// EDUCATION & CERTS</h3>
          <div class="text-xs text-slate-700 flex justify-between">
            <span><strong>${p.education[0]?.degree}</strong> — ${p.education[0]?.institution}</span>
            <span class="font-mono text-slate-500">${p.education[0]?.gradYear}</span>
          </div>
        </section>
        ` : ''}
      </div>
    `;
  },

  /**
   * 4. Nordic Clean Template
   * Sleek sidebar rail for contact/skills, spacious main content column.
   */
  renderNordic(profile) {
    const p = profile || {};
    const name = p.name || 'Your Name';
    const title = p.title || 'Professional Title';

    return `
      <div class="flex flex-col md:flex-row min-h-full font-sans text-slate-800">
        <!-- Left Sidebar Rail -->
        <aside class="w-full md:w-1/3 bg-slate-100 p-6 md:p-8 border-r border-slate-200 flex flex-col gap-5 text-xs">
          <div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">${name}</h1>
            <p class="text-xs font-semibold text-teal-700 mt-1 uppercase tracking-wider">${title}</p>
          </div>

          <div>
            <h4 class="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2 border-b border-slate-300 pb-0.5">Contact</h4>
            <div class="space-y-1.5 text-slate-700">
              ${p.email ? `<div><span class="font-semibold block text-slate-500 text-[10px]">EMAIL</span>${p.email}</div>` : ''}
              ${p.phone ? `<div><span class="font-semibold block text-slate-500 text-[10px]">PHONE</span>${p.phone}</div>` : ''}
              ${p.location ? `<div><span class="font-semibold block text-slate-500 text-[10px]">LOCATION</span>${p.location}</div>` : ''}
              ${p.linkedin ? `<div><span class="font-semibold block text-slate-500 text-[10px]">LINKEDIN</span>${p.linkedin}</div>` : ''}
              ${p.github ? `<div><span class="font-semibold block text-slate-500 text-[10px]">GITHUB</span>${p.github}</div>` : ''}
            </div>
          </div>

          <div>
            <h4 class="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2 border-b border-slate-300 pb-0.5">Skills</h4>
            <div class="flex flex-wrap gap-1">
              ${[...(p.skills?.technical || []), ...(p.skills?.devops || [])].map(s => `
                <span class="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">${s}</span>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 class="font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2 border-b border-slate-300 pb-0.5">Education</h4>
            ${(p.education || []).map(edu => `
              <div class="mb-2">
                <div class="font-bold text-slate-900">${edu.degree}</div>
                <div class="text-slate-600">${edu.institution}</div>
                <div class="text-slate-500 text-[10px] font-medium">${edu.gradYear}</div>
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- Right Main Column -->
        <main class="w-full md:w-2/3 p-6 md:p-8 flex flex-col gap-5 text-xs">
          ${p.summary ? `
          <div>
            <h3 class="font-bold uppercase tracking-wider text-teal-800 text-[11px] border-b border-slate-200 pb-1 mb-2">Profile Overview</h3>
            <p class="text-slate-700 leading-relaxed text-justify">${p.summary}</p>
          </div>
          ` : ''}

          <div>
            <h3 class="font-bold uppercase tracking-wider text-teal-800 text-[11px] border-b border-slate-200 pb-1 mb-3">Work History</h3>
            ${(p.experiences || []).map(exp => `
              <div class="mb-4">
                <div class="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>${exp.title}</span>
                  <span class="text-xs text-slate-500 font-normal">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div class="text-teal-700 font-semibold mb-1">${exp.company} ${exp.location ? `• ${exp.location}` : ''}</div>
                <ul class="list-disc ml-4 space-y-1 text-slate-700">
                  ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          ${(p.projects && p.projects.length > 0) ? `
          <div>
            <h3 class="font-bold uppercase tracking-wider text-teal-800 text-[11px] border-b border-slate-200 pb-1 mb-2">Featured Projects</h3>
            ${p.projects.map(proj => `
              <div class="mb-2.5">
                <div class="font-bold text-slate-900 text-xs">${proj.name}</div>
                <div class="text-slate-500 text-[11px] font-mono mb-0.5">${proj.tech}</div>
                <ul class="list-disc ml-4 space-y-0.5 text-slate-700">
                  ${(proj.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </main>
      </div>
    `;
  },

  /**
   * Main Dispatcher
   */
  render(templateName, profile) {
    switch (templateName) {
      case 'classic':
        return this.renderClassic(profile);
      case 'tech':
        return this.renderTech(profile);
      case 'nordic':
        return this.renderNordic(profile);
      case 'modern':
      default:
        return this.renderModern(profile);
    }
  }
};

window.ResumeTemplates = ResumeTemplates;
