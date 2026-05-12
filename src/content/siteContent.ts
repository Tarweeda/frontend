// Single source of truth for all editable site content.
// `SITE_CONTENT_DEFAULTS` holds the original hardcoded copy; the admin CMS stores
// only overrides in the DB. Public components read via `useSection()` which
// merges the override (if any) over the default at the SECTION level.

export interface CTA {
  label: string;
  href: string;
}

export interface HeroSlide {
  tag: string;
  heading: string;
  headingEm: string;
  subtitle: string;
  cta1: CTA;
  cta2: CTA;
  watermark: string;
  bgImage: string; // '' => use the CSS gradient
}
export interface HeroContent {
  slides: HeroSlide[];
}

export interface StoryContent {
  label: string;
  headingPre: string;
  headingEm: string;
  headingPost: string;
  paragraphs: string[];
  emphasisLine: string;
  signature: string;
  image: string; // '' => fall back to /story.jpg
}

export interface ValuesContent {
  items: { title: string; body: string }[];
}

export interface PillarsContent {
  items: { title: string; sub: string; href: string }[];
}

export interface ShopContent {
  eyebrow: string;
  headingPre: string;
  headingEm: string;
  tabLabels: { all: string; staples: string; pantry: string }; // values are fixed; labels editable
}

export interface CateringContent {
  label: string;
  headingPre: string;
  headingEm: string;
  headingPost: string;
  body: string;
  dishes: string[];
  pricingNote: string;
  eventTypes: string[];
  cities: string[];
}

export interface SupperContent {
  eyebrow: string;
  heading: string;
  description: string;
  stats: { value: string; label: string }[];
}

export interface HireContent {
  eyebrow: string;
  headingPre: string;
  headingEm: string;
  description: string;
  ctaHeading: string;
  ctaSub: string;
  ctaButton: string;
}

export interface HampersContent {
  label: string;
  heading: string;
  body: string;
}

export interface ContactContent {
  label: string;
  headingLine1: string;
  headingLine2Pre: string;
  headingLine2Em: string;
  body: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
}

export interface NavContent {
  links: { href: string; label: string }[];
  contactLabel: string;
  logo: string; // '' => bundled asset
}

export interface FooterContent {
  brand: string;
  tagline: string;
  links: { href: string; label: string }[];
}

export interface SiteContent {
  hero: HeroContent;
  story: StoryContent;
  values: ValuesContent;
  pillars: PillarsContent;
  shop: ShopContent;
  catering: CateringContent;
  supper: SupperContent;
  hire: HireContent;
  hampers: HampersContent;
  contact: ContactContent;
  nav: NavContent;
  footer: FooterContent;
}

export const SITE_CONTENT_DEFAULTS: SiteContent = {
  hero: {
    slides: [
      {
        tag: 'Palestinian Pantry',
        heading: 'From the Fields',
        headingEm: 'of Palestine',
        subtitle:
          'Authentic ingredients, seasonally sourced. Handcrafted with care, delivered across London.',
        cta1: { label: 'Shop the Pantry', href: '#shop' },
        cta2: { label: 'Supper Club', href: '#supperclub' },
        watermark: 'تزويدة',
        bgImage: '',
      },
      {
        tag: 'Supper Club',
        heading: 'A Table',
        headingEm: 'Worth Gathering For',
        subtitle:
          'Intimate Palestinian dining experiences. Five courses, twenty seats, one unforgettable evening.',
        cta1: { label: 'View Events', href: '#supperclub' },
        cta2: { label: 'Book a Table', href: '#supperclub' },
        watermark: 'مائدة',
        bgImage: '',
      },
      {
        tag: 'Catering & Events',
        heading: 'Bring Palestine',
        headingEm: 'to Your Table',
        subtitle:
          'Private dining, weddings, corporate events. Bespoke Palestinian menus crafted for your occasion.',
        cta1: { label: 'Enquire Now', href: '#catering' },
        cta2: { label: 'Our Menu', href: '#shop' },
        watermark: 'ضيافة',
        bgImage: '',
      },
    ],
  },
  story: {
    label: 'Our Story',
    headingPre: 'Born from ',
    headingEm: 'memory,',
    headingPost: 'shaped by love',
    paragraphs: [
      'For two years, there was cooking — for friends, for guests, for neighbours. What started as something loved became something needed. In a time shaped by distance, war, and uncertainty, cooking became a way to stay close: to home, to family in Gaza, to memory.',
      'In London, something was missing — the real taste of Palestinian home. Not the commercial version, not imitation — but the food we grew up with, the one that carries stories. At gatherings, at protests, at campings — in shared moments of resistance and care.',
    ],
    emphasisLine: 'From all of this — Tarweeda was born.',
    signature:
      '— A bridge between traditional pantry goods and modern hospitality, handcrafted with affection.',
    image: '/story.jpg',
  },
  values: {
    items: [
      {
        title: 'Handcrafted',
        body: "Every jar, blend, and dish made by hand — no shortcuts. The way it's always been done at home.",
      },
      {
        title: 'Communal',
        body: 'Palestinian food is meant to be shared. For the table, for gatherings, for the moments that matter.',
      },
      {
        title: 'Cultural Memory',
        body: 'Each recipe carries a story — of villages, families, of a cuisine that holds history and resistance in every ingredient.',
      },
    ],
  },
  pillars: {
    items: [
      { title: 'Field Staples', sub: "Olive oil · Za'atar · Sumac · Tahina", href: '#shop' },
      { title: 'Home Preserves', sub: 'Makdous · Pickled Lemon · Qazha', href: '#shop' },
      { title: 'Catering', sub: 'Gatherings · Events · Celebrations', href: '#catering' },
    ],
  },
  shop: {
    eyebrow: 'The Collection',
    headingPre: 'Shop ',
    headingEm: 'Tarweeda',
    tabLabels: { all: 'All', staples: 'Field Staples', pantry: 'Home Preserves' },
  },
  catering: {
    label: 'Catering & Gatherings',
    headingPre: 'Tell us about',
    headingEm: 'gathering',
    headingPost: 'your ',
    body: 'Full catering for gatherings of 10 to 200+. We bring the feast to you — communal, generous, and deeply Palestinian.',
    dishes: [
      'Maqluba',
      'Musakhan',
      'Maftoul',
      'Fatteh Ghazawiyeh',
      'Fatteh Hummus',
      'Dawali',
      'Fatayer (handmade, custom fillings)',
      'Mezze, sides, desserts & drinks',
    ],
    pricingNote: "From £28 per person. We'll confirm your quote within 24 hours.",
    eventTypes: ['Family gathering', 'Corporate event', 'Wedding', 'Community event', 'Other'],
    cities: ['London', 'Rabat'],
  },
  supper: {
    eyebrow: 'Tarweeda Presents',
    heading: 'The Supper Club',
    description: 'On-demand intimate dining — 20 seats, one long table, one theme, one menu.',
    stats: [
      { value: '20', label: 'Seats' },
      { value: '5+', label: 'Courses' },
      { value: '£60', label: 'From' },
    ],
  },
  hire: {
    eyebrow: 'Professional Kitchen Team',
    headingPre: 'Hire Tarweeda ',
    headingEm: 'Staff',
    description:
      'Experienced Palestinian chefs and professional serving staff, available anywhere in London.',
    ctaHeading: 'Ready to bring the Tarweeda team?',
    ctaSub: "Tell us your date and we'll quote within 48 hours.",
    ctaButton: 'Enquire About Staffing',
  },
  hampers: {
    label: 'Curated Gifts',
    heading: 'Gift Hampers',
    body: 'Beautifully wrapped collections — perfect for Eid, birthdays, or simply sending warmth.',
  },
  contact: {
    label: 'London · Made to Order',
    headingLine1: 'From our kitchen',
    headingLine2Pre: 'to ',
    headingLine2Em: 'yours',
    body: 'Stock your pantry, send a gift, or plan a communal feast.',
    email: 'hello@tarweeda.com',
    instagramHandle: '@tarweeda',
    instagramUrl: 'https://instagram.com/tarweeda',
  },
  nav: {
    links: [
      { href: '#shop', label: 'Shop' },
      { href: '#catering', label: 'Catering' },
      { href: '#supperclub', label: 'Supper Club' },
      { href: '#hire', label: 'Hire Staff' },
      { href: '#hampers', label: 'Hampers' },
    ],
    contactLabel: 'Contact',
    logo: '',
  },
  footer: {
    brand: 'Tarweeda',
    tagline: 'From the fields of Palestine — handcrafted with affection.',
    links: [
      { href: '#shop', label: 'Shop' },
      { href: '#catering', label: 'Catering' },
      { href: '#supperclub', label: 'Supper Club' },
      { href: '#hampers', label: 'Hampers' },
    ],
  },
};
