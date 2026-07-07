// Central content source for LiveCrib Solutions.
// Edit copy here without touching component markup.

export const brand = {
  name: 'LiveCrib Solutions',
  tagline: 'Empowering Ideas. Engineering Digital Growth.',
  blurb:
    'A digital services firm blending creativity with technology — delivering end-to-end software, web, and marketing solutions under one roof.',
  email: 'contact@livecrib.pro',
  phone: '+254 726500307, +254 725664655',
  address: 'Kenyatta Street, Eldoret, Kenya',
  hours: 'Mon – Fri, 9:00 AM – 5:00 PM',
}

// Images sourced from the original LiveCrib site, stored in /public/images
export const img = {
  heroWave: '/images/hero.png',
  heroPerson: '/images/photoreal-1.png',
  team: '/images/team-office.jpg',
  marketing: '/images/marketing.jpg',
  analytics: '/images/agency.png',
  omnichannel: '/images/photoreal-2.png',
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' },
]

export const services = [
  {
    icon: '⚙️',
    title: 'Custom Software Development',
    text: 'Scalable, secure solutions engineered for modern enterprises — from internal tools to full SaaS platforms.',
  },
  {
    icon: '🎨',
    title: 'Web Design & Development',
    text: 'Responsive, conversion-focused websites that look sharp on every screen and turn visitors into customers.',
  },
  {
    icon: '📈',
    title: 'Digital Marketing & Branding',
    text: 'Campaign strategy, brand identity, and visibility that put your business in front of the right audience.',
  },
]

export const solutions = [
  { icon: '🚀', title: 'Business Growth', text: 'Strategies built to scale your revenue and reach.' },
  { icon: '🛒', title: 'eCommerce', text: 'Boost sales with optimized, high-converting storefronts.' },
  { icon: '✍️', title: 'Blogging Platforms', text: 'Elegant publishing homes for your voice and ideas.' },
  { icon: '💼', title: 'Portfolios', text: 'Showcase your work with a striking personal brand.' },
]

export const stats = [
  { value: '150%', label: 'Avg. brand awareness lift' },
  { value: '35%', label: 'Customer retention gain' },
  { value: '50+', label: 'Projects delivered' },
  { value: '10+', label: 'Industries served' },
]

export const process = [
  { step: '01', title: 'Discovery', text: 'We dig into your goals, users, and market to gather the insights that shape the work.' },
  { step: '02', title: 'Planning', text: 'We draft a detailed roadmap, timeline, and scope so everyone knows exactly what ships.' },
  { step: '03', title: 'Execution', text: 'We build, launch, and monitor — adapting continuously to keep results moving up.' },
]

export const values = [
  { icon: '🤝', title: 'Integrity', text: 'Open dialogue and honored commitments on every engagement.' },
  { icon: '💡', title: 'Creativity', text: 'Fresh thinking that helps your brand stand out and connect.' },
  { icon: '🎯', title: 'Client Focus', text: 'We tailor every service around your objectives. Your success is our mission.' },
  { icon: '🔍', title: 'Transparency', text: 'Clear communication and timely delivery, start to finish.' },
]

export const team = [
  {
    name: 'Eno',
    role: 'CEO & Founder',
    initials: 'E',
    image: '/images/eno-ceo.jpg',
    bio: 'Sets the vision and keeps every engagement pointed at real client outcomes.',
  },
  {
    name: 'Sam',
    role: 'Chief Technology Officer',
    initials: 'S',
    image: '/images/sam-cto.jpg',
    bio: 'Leads engineering and architecture across our software platforms.',
  },
  {
    name: 'Michelle',
    role: 'Creative Director',
    initials: 'M',
    image: '/images/michelle-creative.jpg',
    bio: 'Shapes brand, design, and the story behind every product we ship.',
  },
]

// Products we've built (the flagship demos)
export const products = [
  {
    id: 'sms',
    name: 'Shule SMS',
    kicker: 'School Management System',
    color: '#2563eb',
    tagline: 'Run your whole school from one dashboard.',
    text: 'Shule SMS unifies students, teachers, academics, finance, library, and communication into a single cloud platform. Built for schools that want to spend less time on paperwork and more time teaching.',
    features: [
      'Student & teacher management',
      'Timetable & class allocation',
      'Exam grading & report cards',
      'Finance, fees & invoicing',
      'Library & inventory tracking',
      'Communication & notifications',
      'Disciplinary records',
      'Hostel & transport',
    ],
    shots: ['/images/sms2.png', '/images/sms3.png', '/images/sms1.png'],
    demoPath: '/apps/sms/login',
    live: 'https://sms.livecrib.pro/',
  },
  {
    id: 'rms',
    name: 'Rental Manager',
    kicker: 'Rental Management System',
    color: '#4f46e5',
    tagline: 'Property, tenants, and rent — handled.',
    text: 'Rental Manager gives landlords and property managers a clear view of every property, lease, and payment. List available units, automate rent collection, track maintenance, and keep occupancy high.',
    features: [
      'Property & unit portfolio',
      'Tenant & lease management',
      'Rent collection & reminders',
      'Property inquiries & listings',
      'Maintenance request tickets',
      'Financial reports & documents',
      'Tenant communication',
      'Occupancy & vacancy tracking',
    ],
    shots: ['/images/rental2.png', '/images/rental1.png', '/images/rental3.png'],
    demoPath: '/apps/rms/login',
    live: 'https://rms.livecrib.pro/',
  },
]

export const portfolio = [
  {
    title: 'Shule SMS',
    category: 'Custom Software',
    text: 'A complete cloud school-management platform covering admissions, academics, fees, and parent communication.',
    tags: ['SaaS', 'EdTech', 'React'],
    featured: true,
    image: '/images/sms2.png',
  },
  {
    title: 'Rental Manager',
    category: 'Custom Software',
    text: 'Property and tenant management with rent collection, lease tracking, listings, and maintenance workflows.',
    tags: ['SaaS', 'PropTech', 'Dashboards'],
    featured: true,
    image: '/images/rental2.png',
  },
  {
    title: 'Branding for XYZ',
    category: 'Branding',
    text: "Revamping the visual identity of XYZ Company with a fresh logo and comprehensive brand guidelines.",
    tags: ['Branding', 'Design', 'Marketing'],
    image: '/images/photoreal-1.png',
  },
  {
    title: 'Website for ABC',
    category: 'Web Development',
    text: "A complete overhaul of ABC's online presence — a user-friendly site that boosts engagement and conversions.",
    tags: ['Web', 'UX', 'Frontend'],
    image: '/images/marketing.jpg',
  },
  {
    title: 'App Development for DEF',
    category: 'Mobile',
    text: 'A seamless mobile application for DEF that simplifies user interactions and extends market reach.',
    tags: ['Mobile', 'Product', 'Development'],
    image: '/images/team-office.jpg',
  },
  {
    title: 'eCommerce for GHI',
    category: 'eCommerce',
    text: 'An optimized storefront with streamlined checkout that lifted online sales and repeat purchases.',
    tags: ['eCommerce', 'Conversion', 'Growth'],
    image: '/images/photoreal-2.png',
  },
]

export const testimonials = [
  {
    quote: 'LiveCrib rebuilt our platform end to end. Delivery was on time and the results spoke for themselves.',
    name: 'Operations Director',
    org: 'EdTech client',
  },
  {
    quote: 'Their team felt like an extension of ours — transparent, creative, and genuinely invested in our growth.',
    name: 'Founder',
    org: 'Retail brand',
  },
]
