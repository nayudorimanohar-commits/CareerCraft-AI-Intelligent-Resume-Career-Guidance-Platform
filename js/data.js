/**
 * CareerCraft AI - Realistic Default Dataset & Sample Profiles
 */

const DEFAULT_PROFILES = {
  alex_morgan: {
    id: 'alex_morgan',
    name: 'Alex Morgan',
    title: 'Senior Full Stack Engineer',
    email: 'alex.morgan@email.com',
    phone: '+1 (415) 890-4321',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan-code',
    portfolio: 'alexmorgan.io',
    summary: 'Impact-driven Senior Full Stack Engineer with 6+ years of experience architecting resilient cloud platforms, scalable React micro-frontends, and high-throughput Node.js/TypeScript APIs. Spearheaded performance optimizations reducing p99 API latency by 42% for 2.5M MAU. Passionate about developer ergonomics, modern design systems, and automated CI/CD observability.',
    experiences: [
      {
        id: 'exp-1',
        title: 'Senior Full Stack Engineer',
        company: 'NexaCloud Technologies',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected and deployed distributed event-processing pipeline handling 15M daily transactions using Node.js, Kafka, and PostgreSQL, achieving 99.98% uptime.',
          'Spearheaded migration of legacy monolithic dashboard to modular React 18 & TypeScript micro-frontends, decreasing initial load times by 38% and boosting Lighthouse performance score to 96.',
          'Implemented end-to-end telemetry and APM monitoring using Datadog and OpenTelemetry, reducing mean time to detection (MTTD) of production anomalies by 45%.',
          'Mentored 6 engineers through weekly code architecture reviews, testing standards, and bi-monthly engineering guild workshops.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Full Stack Software Engineer',
        company: 'Pulse Dynamics',
        location: 'Oakland, CA',
        startDate: 'Mar 2019',
        endDate: 'Dec 2021',
        current: false,
        bullets: [
          'Developed real-time customer analytics portal with React, Redux Toolkit, Tailwind CSS, and GraphQL, serving over 180 enterprise accounts.',
          'Authored RESTful microservices in Node.js/Express backed by MongoDB and Redis caching, cutting average database read query times by 55%.',
          'Configured Docker containers and automated GitHub Actions CI/CD pipelines, reducing staging deployment cycle duration from 45 to 8 minutes.',
          'Collaborated closely with UX designers to build an internal WCAG 2.1 AA accessible component library adopted across 4 product teams.'
        ]
      },
      {
        id: 'exp-3',
        title: 'Junior Web Developer',
        company: 'Apex Labs',
        location: 'San Jose, CA',
        startDate: 'Jun 2018',
        endDate: 'Feb 2019',
        current: false,
        bullets: [
          'Engineered interactive responsive web client features using modern JavaScript (ES6+), CSS Grid, and REST APIs.',
          'Wrote unit and integration test suites using Jest and React Testing Library, expanding test coverage from 48% to 82% across core customer workflows.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        gradYear: '2018',
        details: "Dean's Honor List (2016-2018) • GPA: 3.82/4.0 • Focus on Distributed Systems & Human-Computer Interaction"
      }
    ],
    skills: {
      technical: ['TypeScript', 'JavaScript (ES6+)', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'GraphQL', 'RESTful APIs', 'PostgreSQL', 'MongoDB', 'Redis'],
      devops: ['AWS (ECS, S3, CloudFront)', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions)', 'Terraform', 'Datadog', 'Git'],
      methodologies: ['System Design', 'Micro-frontends', 'Microservices', 'Test-Driven Development (TDD)', 'Agile / Scrum', 'Web Accessibility (WCAG)']
    },
    projects: [
      {
        id: 'proj-1',
        name: 'CloudPulse - Distributed Latency Monitor',
        tech: 'TypeScript, React, WebSockets, Node.js, TimescaleDB',
        link: 'github.com/alexmorgan-code/cloudpulse',
        bullets: [
          'Developed open-source telemetry visualizer monitoring edge latency across 12 geographic points of presence with real-time websocket streams.',
          'Received 1,400+ GitHub stars and adopted by several indie SaaS engineering teams for lightweight uptime verification.'
        ]
      },
      {
        id: 'proj-2',
        name: 'DevSprint - Real-time Collaborative Board',
        tech: 'Next.js, Tailwind CSS, Supabase, Jest',
        link: 'devsprint-demo.app',
        bullets: [
          'Built kanban task management tool featuring optimistic UI updates, keyboard navigation shortcuts, and multi-user presence cursors.'
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        year: '2023'
      },
      {
        id: 'cert-2',
        name: 'Certified Kubernetes Application Developer (CKAD)',
        issuer: 'Cloud Native Computing Foundation',
        year: '2022'
      }
    ]
  },

  maya_lin: {
    id: 'maya_lin',
    name: 'Maya Lin',
    title: 'Senior Product Manager',
    email: 'maya.lin@producthub.io',
    phone: '+1 (206) 555-0199',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/mayalin-pm',
    github: '',
    portfolio: 'mayalin.me',
    summary: 'Customer-obsessed Senior Product Manager with 5+ years driving high-growth SaaS workflows, self-serve monetization, and cross-functional engineering teams. Experienced in translating complex technical capabilities into intuitive user experiences that doubled activation rates.',
    experiences: [
      {
        id: 'exp-m1',
        title: 'Senior Product Manager - Growth & Onboarding',
        company: 'Veloce Software',
        location: 'Seattle, WA',
        startDate: 'Jan 2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Led product strategy and discovery for self-serve onboarding, improving day-7 active user retention by 22% across 450,000 monthly signups.',
          'Orchestrated 18 A/B experiment iterations on checkout and pricing tiers, unlocking $3.4M in incremental annual recurring revenue (ARR).'
        ]
      }
    ],
    education: [
      {
        id: 'edu-m1',
        degree: 'B.A. in Economics & Cognitive Science',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        gradYear: '2019',
        details: 'Magna Cum Laude • Product Management Club President'
      }
    ],
    skills: {
      technical: ['Product Discovery', 'User Journey Mapping', 'A/B Testing', 'SQL (BigQuery)', 'Mixpanel', 'Amplitude', 'Figma', 'PRD Authoring', 'Agile Product Lifecycle'],
      devops: ['Jira', 'Linear', 'Notion', 'Postman', 'Tableau'],
      methodologies: ['Jobs to Be Done (JTBD)', 'Customer Interviews', 'Go-to-Market Strategy', 'OKR Planning']
    },
    projects: [],
    certifications: []
  }
};

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    id: 'stripe-frontend',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid / Remote)',
    salary: '$185,000 - $225,000 + Equity',
    description: `About the Role:
We are looking for a Senior Frontend Engineer to build the next generation of our Merchant Dashboard and Developer Experience tooling. You will design, build, and maintain mission-critical web applications used daily by millions of businesses worldwide to accept payments, analyze revenue, and manage financial operations.

Key Responsibilities:
- Architect and build high-performance, accessible, and delightful web interfaces using React, TypeScript, Next.js, and modern CSS systems.
- Collaborate closely with product managers, UX designers, and backend distributed systems engineers to ship customer-facing financial workflows.
- Champion frontend engineering excellence: establish performance budgets, automated testing (Jest, Cypress), CI/CD pipelines, and web accessibility standards (WCAG 2.1 AA).
- Drive architectural decisions around state management, client caching, GraphQL/REST integrations, and micro-frontend federation.
- Mentor and coach junior and mid-level engineers, fostering a culture of rigorous code review, empathy, and continuous learning.

Qualifications & Requirements:
- 5+ years of production experience building complex, high-scale web applications.
- Strong proficiency in modern JavaScript/TypeScript, React component architecture, and modern state management patterns.
- Demonstrated experience with performance optimization (Core Web Vitals, code splitting, bundle size minimization, p95 rendering latency).
- Working knowledge of automated testing frameworks (Jest, React Testing Library, Playwright or Cypress).
- Experience working with REST APIs, GraphQL, and server-side rendering (SSR) frameworks like Next.js.
- Familiarity with cloud platforms (AWS), containerization (Docker), and modern CI/CD deployment workflows.
- Excellent communication skills and the ability to articulate trade-offs in technical design RFCs.

Nice to Have:
- Experience in FinTech, payment processing, or compliance-heavy domains.
- Contributions to open-source developer tooling or UI design systems.`
  },
  {
    id: 'linear-pm',
    title: 'Senior Product Manager - Workflows',
    company: 'Linear',
    location: 'Remote (Worldwide)',
    salary: '$170,000 - $210,000 + Equity',
    description: `About Linear:
Linear is a tool for modern software teams to plan and build products. We believe software creation should feel magical, fast, and deliberate.

The Role:
We are looking for a Senior Product Manager to lead our Core Workflows product area. You will define how modern software engineering and design teams collaborate, automate recurring triage, and coordinate complex multi-team releases.

Responsibilities:
- Drive product vision, strategy, and roadmap for Linear's core workflow automation and project tracking systems.
- Conduct qualitative user research and analyze quantitative product metrics to identify high-leverage product opportunities.
- Partner with world-class engineers and product designers to deliver craft-focused, keyboard-first, lightning-fast features.
- Write crisp, concise PRDs and lead transparent team rituals with minimal process overhead.
- Gather feedback continuously from early-access customers and community power users.

Requirements:
- 4+ years of product management experience at high-velocity product-led growth (PLG) software companies.
- Exceptional taste in software UX, ergonomics, and speed.
- Analytical mindset with hands-on proficiency in SQL, Amplitude/Mixpanel, and cohort retention modeling.
- Technical background or high comfort communicating with senior software architects.`
  },
  {
    id: 'datadog-devops',
    title: 'Senior Cloud & Platform Engineer',
    company: 'Datadog',
    location: 'New York, NY / Remote',
    salary: '$190,000 - $230,000',
    description: `About the Role:
As a Senior Platform Engineer at Datadog, you will build and scale the multi-cloud infrastructure that ingests and processes trillions of monitoring events every day.

Responsibilities:
- Design, provision, and maintain Kubernetes clusters across AWS and GCP using Terraform and Infrastructure as Code (IaC).
- Scale high-throughput event queues (Kafka, Pulsar) and distributed datastores (PostgreSQL, Cassandra, Redis).
- Improve observability pipelines, continuous deployment mechanisms, and zero-downtime service failover protocols.
- Partner with security teams to enforce least-privilege IAM policies, secrets management (Vault), and compliance standards.

Requirements:
- 5+ years managing large-scale Linux server environments and production Kubernetes clusters.
- Deep expertise with AWS core services (EKS, VPC, IAM, S3, RDS) and Terraform.
- Proficiency in Python, Go, or Node.js for systems automation.
- Proven experience with distributed streaming platforms like Apache Kafka.`
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-stripe-1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid / Remote)',
    salary: '$185k - $225k',
    status: 'Interviewing', // Draft | Preparing | Applied | Interviewing | Archived
    appliedDate: '2026-09-28',
    lastUpdated: '2026-10-04',
    matchScore: 84,
    notes: 'Technical screen scheduled for Thursday. Review React micro-frontend architecture and Web Vitals metrics.',
    targetJobId: 'stripe-frontend',
    jobDescription: SAMPLE_JOB_DESCRIPTIONS[0].description,
    gapProgress: {
      'Cypress / Playwright': true,
      'Core Web Vitals Optimization': true,
      'FinTech Domain Knowledge': false
    }
  },
  {
    id: 'app-datadog-2',
    jobTitle: 'Senior Cloud & Platform Engineer',
    company: 'Datadog',
    location: 'New York, NY / Remote',
    salary: '$190k - $230k',
    status: 'Preparing',
    appliedDate: '',
    lastUpdated: '2026-10-02',
    matchScore: 71,
    notes: 'Need to strengthen demonstration of multi-region Kubernetes and Terraform state management.',
    targetJobId: 'datadog-devops',
    jobDescription: SAMPLE_JOB_DESCRIPTIONS[2].description,
    gapProgress: {
      'Multi-region Terraform': false,
      'Apache Kafka Streaming': true
    }
  },
  {
    id: 'app-linear-3',
    jobTitle: 'Product Engineer - Integrations',
    company: 'Linear',
    location: 'Remote',
    salary: '$175k - $205k',
    status: 'Applied',
    appliedDate: '2026-09-24',
    lastUpdated: '2026-09-30',
    matchScore: 88,
    notes: 'Submitted tailored resume with CloudPulse and DevSprint highlights.',
    targetJobId: 'linear-pm',
    jobDescription: SAMPLE_JOB_DESCRIPTIONS[1].description,
    gapProgress: {}
  },
  {
    id: 'app-airbnb-4',
    jobTitle: 'Senior UI Platform Engineer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    salary: '$195k - $235k',
    status: 'Draft',
    appliedDate: '',
    lastUpdated: '2026-09-18',
    matchScore: 78,
    notes: 'Drafting tailored resume focusing on accessible design systems and component libraries.',
    targetJobId: '',
    jobDescription: 'Seeking an engineer with strong React, TypeScript, and Design System experience to evolve our unified UI components.',
    gapProgress: {}
  }
];

const TESTIMONIALS = [
  {
    quote: "CareerCraft AI provided honest, actionable gaps between my experience and senior software roles. The STAR-based interview breakdowns helped me prepare concrete stories that directly aligned with what hiring managers were asking.",
    author: "Elena Rostova",
    role: "Senior Software Engineer",
    company: "Series C FinTech",
    avatar: "ER"
  },
  {
    quote: "Most resume tools fabricate skills or produce noisy buzzwords that get flagged. CareerCraft AI showed me exactly where my existing experience already matched the job description and gave me honest study paths for what I was missing.",
    author: "Marcus Thorne",
    role: "Full Stack Developer",
    company: "Enterprise Cloud Co",
    avatar: "MT"
  },
  {
    quote: "The live ATS split-pane preview and the instant job description keyword matching saved me hours on every application. I felt prepared for every technical conversation.",
    author: "Priya Nair",
    role: "Product Engineering Lead",
    company: "SaaS Platform",
    avatar: "PN"
  }
];
