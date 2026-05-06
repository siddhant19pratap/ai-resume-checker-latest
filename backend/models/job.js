const now = Date.now();

const jobs = [
  {
    id: now - 86400000 * 1,
    title: "Senior Frontend Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$160k – $210k / yr",
    postedAt: now - 86400000 * 1,
    applications: [],
    description: `We're looking for a Senior Frontend Engineer to help build the next generation of Stripe's developer-facing products.

Responsibilities:
• Design and implement high-quality UI components used by millions of developers worldwide
• Collaborate closely with product, design, and backend engineers
• Drive architectural decisions for the frontend stack
• Mentor junior engineers and review code

Requirements:
• 5+ years of experience with React and TypeScript
• Strong understanding of web performance, accessibility, and browser APIs
• Experience with design systems and component libraries
• Track record of owning and shipping complex features end-to-end

Nice to have:
• Experience with GraphQL or REST API design
• Familiarity with payments or fintech products

Benefits:
• Competitive salary + equity
• Remote-friendly with hubs in SF, NYC, Dublin, Singapore
• $5,000 annual learning stipend
• Comprehensive health, dental, and vision coverage`,
  },
  {
    id: now - 86400000 * 2,
    title: "Full Stack Engineer",
    company: "Notion",
    location: "Remote",
    jobType: "Remote",
    salary: "$140k – $185k / yr",
    postedAt: now - 86400000 * 2,
    applications: [],
    description: `Notion is looking for a Full Stack Engineer to help build the future of productivity tools used by millions of teams worldwide.

About the Role:
You'll work on features that touch both the frontend and backend — from real-time collaboration to data sync, to the block editor that powers Notion's core experience.

Responsibilities:
• Build end-to-end product features across React, TypeScript, and Node.js
• Contribute to the architecture of Notion's real-time sync engine
• Collaborate with cross-functional teams to ship high-quality product experiences
• Write clean, maintainable code with thorough tests

Requirements:
• 3+ years of full-stack engineering experience
• Proficiency in React, TypeScript, and Node.js
• Understanding of databases (PostgreSQL preferred)
• Strong product sensibility and attention to detail

Nice to have:
• Experience with CRDTs or operational transforms
• Familiarity with WebSockets or real-time systems

Perks:
• Fully remote with optional office access
• Unlimited PTO
• Home office stipend up to $2,000
• Top-tier health benefits`,
  },
  {
    id: now - 86400000 * 3,
    title: "Machine Learning Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$200k – $300k / yr",
    postedAt: now - 86400000 * 3,
    applications: [],
    description: `OpenAI is seeking a Machine Learning Engineer to help research and deploy large-scale AI systems that are safe and beneficial to humanity.

What You'll Do:
• Train and fine-tune large language models and multimodal systems
• Design experiments to evaluate model capabilities and alignment
• Collaborate with research scientists to move from research to production
• Build scalable ML infrastructure and pipelines

Requirements:
• MS or PhD in Computer Science, Machine Learning, or related field (or equivalent experience)
• Strong Python skills and experience with PyTorch or JAX
• Experience training or fine-tuning large neural networks
• Solid foundation in linear algebra, probability, and optimization

Nice to have:
• Publications at NeurIPS, ICML, ICLR, or ACL
• Experience with RLHF or constitutional AI techniques
• Distributed training experience at scale (1000+ GPUs)

Benefits:
• Industry-leading compensation + meaningful equity
• Research time: 20% of time for personal research projects
• On-site meals, gym, and wellness benefits
• Visa sponsorship available`,
  },
  {
    id: now - 86400000 * 4,
    title: "Backend Engineer — Infrastructure",
    company: "Vercel",
    location: "Remote",
    jobType: "Remote",
    salary: "$130k – $175k / yr",
    postedAt: now - 86400000 * 4,
    applications: [],
    description: `Vercel is hiring a Backend Engineer to work on the infrastructure powering the world's fastest frontend deployments.

You'll Work On:
• Edge network routing and request handling at massive scale
• Build and improve Vercel's serverless and edge function runtime
• Optimize cold start times, latency, and global availability
• Collaborate with the platform team on infrastructure reliability

Requirements:
• 4+ years of backend engineering experience
• Strong knowledge of Go, Rust, or Node.js
• Deep understanding of networking, HTTP, and CDNs
• Experience with distributed systems and cloud infrastructure (AWS, GCP, or Azure)

Nice to have:
• Contributions to open-source infrastructure projects
• Experience with Kubernetes, Terraform, or Pulumi
• Understanding of WebAssembly runtimes

Benefits:
• 100% remote globally
• Equity + competitive salary
• Annual company retreat
• Flexible hours and async-first culture`,
  },
  {
    id: now - 86400000 * 5,
    title: "Product Designer",
    company: "Linear",
    location: "Remote",
    jobType: "Remote",
    salary: "$120k – $160k / yr",
    postedAt: now - 86400000 * 5,
    applications: [],
    description: `Linear is looking for a Product Designer who cares deeply about craft and building tools that developers and teams love.

About Linear:
We build the best issue tracker in the world. Speed, simplicity, and opinionated workflows are at the core of everything we ship.

What You'll Do:
• Own end-to-end design for new product features
• Create high-fidelity mockups and interactive prototypes
• Work closely with engineering to ensure pixel-perfect implementation
• Shape the design system and component library
• Run user research to inform design decisions

Requirements:
• 4+ years of product design experience for web or desktop apps
• Strong portfolio demonstrating high craft and attention to detail
• Proficiency in Figma
• Excellent communication skills in an async-first environment

Nice to have:
• Prior experience designing developer tools or productivity apps
• Experience with motion design and micro-interactions

Benefits:
• Fully remote team
• Competitive salary + equity in a fast-growing startup
• Top-of-the-line equipment (M3 MacBook Pro, monitor, etc.)
• No meetings before noon policy`,
  },
  {
    id: now - 86400000 * 6,
    title: "iOS Engineer",
    company: "Airbnb",
    location: "Seattle, WA",
    jobType: "Hybrid",
    salary: "$155k – $195k / yr",
    postedAt: now - 86400000 * 6,
    applications: [],
    description: `Airbnb is hiring an iOS Engineer to build beautiful, performant experiences for millions of hosts and guests around the world.

Responsibilities:
• Build and ship new iOS features from design spec to App Store
• Optimize app performance, animations, and launch time
• Partner with designers to bring pixel-perfect UIs to life
• Write unit and integration tests for robust coverage
• Participate in code reviews and architecture discussions

Requirements:
• 3+ years of professional iOS development experience
• Expert knowledge of Swift and UIKit or SwiftUI
• Strong understanding of iOS performance profiling and debugging
• Experience with REST APIs and JSON parsing

Nice to have:
• Experience with Epoxy or other declarative UI frameworks
• Background in animation and Core Animation
• Contributions to the iOS open-source community

Benefits:
• Hybrid — 3 days in Seattle office
• Annual travel credits ($2,000 Airbnb credit per year)
• 401(k) matching up to 4%
• Parental leave: 16 weeks fully paid`,
  },
  {
    id: now - 86400000 * 7,
    title: "Data Engineer",
    company: "Databricks",
    location: "New York, NY",
    jobType: "Full-time",
    salary: "$145k – $190k / yr",
    postedAt: now - 86400000 * 7,
    applications: [],
    description: `Databricks is looking for a Data Engineer to help customers and internal teams unlock insights from massive datasets using the Lakehouse platform.

What You'll Do:
• Design and maintain scalable data pipelines using Apache Spark and Delta Lake
• Build reliable ETL/ELT workflows that process petabyte-scale data
• Work with analytics and ML teams to deliver clean, trusted datasets
• Improve data quality monitoring and alerting infrastructure

Requirements:
• 3+ years of data engineering experience
• Strong proficiency in Python and SQL
• Experience with Apache Spark, Kafka, or similar big-data tools
• Familiarity with cloud data platforms (Databricks, Snowflake, BigQuery)

Nice to have:
• Experience building streaming pipelines
• Knowledge of dbt, Airflow, or Dagster
• Understanding of data warehousing and dimensional modeling

Benefits:
• Competitive base + equity in a pre-IPO unicorn
• Remote-first culture with NY hub
• $1,500 annual conference / learning budget
• Full benefits from day 1`,
  },
  {
    id: now - 86400000 * 8,
    title: "DevOps / Platform Engineer",
    company: "Figma",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salary: "$150k – $195k / yr",
    postedAt: now - 86400000 * 8,
    applications: [],
    description: `Figma is hiring a DevOps / Platform Engineer to scale the infrastructure that serves designers and developers at some of the world's best companies.

Responsibilities:
• Manage and evolve Figma's Kubernetes-based platform on GCP
• Build internal developer tooling and CI/CD pipelines
• Drive reliability improvements through SLOs, alerting, and incident response
• Automate infrastructure provisioning with Terraform and Helm
• Mentor engineers on platform best practices

Requirements:
• 4+ years in DevOps, SRE, or Platform Engineering
• Strong experience with Kubernetes and Docker
• Proficiency with Terraform or Pulumi for IaC
• Solid scripting skills in Python or Bash
• Experience with observability stacks (Prometheus, Grafana, Datadog)

Nice to have:
• Experience with multi-region Kubernetes deployments
• Knowledge of service mesh (Istio or Linkerd)

Benefits:
• Generous equity package in a design-category leader
• Hybrid (2 days in SF office)
• $10,000 professional development budget
• Free Figma Professional for life (obviously)`,
  },
  {
    id: now - 86400000 * 9,
    title: "Frontend Engineer — React",
    company: "Shadcn",
    location: "Remote",
    jobType: "Contract",
    salary: "$80 – $120 / hr",
    postedAt: now - 86400000 * 9,
    applications: [],
    description: `We're looking for a contract Frontend Engineer with deep React expertise to help build and maintain an open-source component ecosystem used by hundreds of thousands of developers.

About the Project:
You'll contribute to a widely adopted component library built on Radix UI and Tailwind CSS, improving documentation, accessibility, and new component coverage.

Responsibilities:
• Build and document new UI components with full accessibility support
• Write clean, copy-pasteable code that developers will use as a base
• Improve Storybook stories and interactive docs
• Review community PRs and triage issues

Requirements:
• Expert-level React and TypeScript
• Deep knowledge of TailwindCSS and CSS fundamentals
• Accessibility expertise (WCAG 2.1 AA)
• Strong written communication for async collaboration

Contract Details:
• 20–40 hrs / week
• Fully remote, flexible hours
• 3-month engagement with potential to extend`,
  },
  {
    id: now - 86400000 * 10,
    title: "Security Engineer",
    company: "Cloudflare",
    location: "Austin, TX",
    jobType: "Full-time",
    salary: "$155k – $200k / yr",
    postedAt: now - 86400000 * 10,
    applications: [],
    description: `Cloudflare is seeking a Security Engineer to help protect the infrastructure that keeps millions of websites safe and fast.

What You'll Do:
• Identify and remediate vulnerabilities across Cloudflare's global network
• Build and maintain security tooling for threat detection and response
• Conduct penetration testing and red team exercises
• Partner with engineering teams to integrate security early in the SDLC
• Respond to and lead incident investigations

Requirements:
• 4+ years of security engineering experience
• Strong understanding of web application security (OWASP Top 10)
• Experience with network security, TLS, and DDoS mitigation
• Proficiency in Python or Go for building security tools
• Knowledge of threat modeling and secure design principles

Nice to have:
• OSCP, CISSP, or similar certifications
• Experience with bug bounty programs
• Background in reverse engineering or malware analysis

Benefits:
• Hybrid in Austin with flexible remote days
• Equity + competitive compensation
• Visa sponsorship available
• Learning budget + conference attendance`,
  },
];

function addJob(job) {
  jobs.push({ ...job, applications: [] });
}

function getJobs() {
  return jobs.map(({ applications: _, ...rest }) => rest);
}

function getJobById(id) {
  const job = jobs.find((j) => j.id === Number(id));
  if (!job) return null;
  const { applications: _, ...rest } = job;
  return rest;
}

function applyToJob(id, application) {
  const job = jobs.find((j) => j.id === Number(id));
  if (!job) return false;
  job.applications.push({ ...application, appliedAt: Date.now() });
  return true;
}

module.exports = { addJob, getJobs, getJobById, applyToJob };
