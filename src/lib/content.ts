// Editorial copy for static sections (source of truth from the brief).
// Posts, events and media are database-backed and managed from /admin.

export const NAV_LINKS = [
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Public Speaking', href: '/#speaking', section: 'speaking' },
  { label: 'Brand Collaboration', href: '/#collaboration', section: 'collaboration' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/journal' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FOOTER_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Public Speaking', href: '/#speaking' },
  { label: 'Brand Collaboration', href: '/#collaboration' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/journal' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Contact', href: '/contact' },
] as const;

export const INSTAGRAM_URL = 'https://www.instagram.com/thirstydreamer/';
// TODO: replace with Mother Cocktail Bar's official website or Instagram URL.
export const MOTHER_URL = 'https://www.google.com/search?q=Mother+Cocktail+Bar+Toronto';

export const HERO = {
  eyebrow: 'NEVER STOP DREAMING',
  title: 'Never Stop Dreaming.',
  body: 'A personal journal of cocktails, fermentation, hospitality, sustainability, and the hard work of turning dreams into real drinks and real stories.',
  primary: 'Read the Dream',
  secondary: 'Book Massi',
  details: ['TORONTO', 'HOSPITALITY · FERMENTATION · DREAMS', 'SCROLL'],
};

export const MARQUEE_TEXT = ['Never stop dreaming', 'Good things take time', 'Toronto', 'Hospitality', 'Fermentation', 'Sustainability', 'Real drinks, real stories'];

export const ABOUT = {
  label: 'THE PERSON BEHIND THE POUR',
  headline: 'Massi doesn’t just make drinks. He builds experiences people remember.',
  quote: 'We shouldn’t just make drinks, but build rooms, experiences for people to remember.',
  body: [
    'Massimo Zitti (AKA Massi) is a bartender, entrepreneur, and storyteller who treats hospitality like a craft and a calling.',
    'Behind the bar he’s a maker — fermenting, infusing, experimenting — but he thinks like a founder, building rooms and rituals long after last call.',
    'As a partner at Mother Cocktail Bar, he’s helped shape one of Toronto’s most talked-about cocktail bars, but this new project ThirstyDreamer.com is a larger mission — it’s where his ideas on sustainability, fermentation, and experience design live as one ongoing conversation.',
    'Part philosopher, part host, part rebel, he believes the best hospitality is honest, rooted, and made by hand — and that a great drink is really just a feeling, handed across the bar.',
  ],
  roles: ['Bartender', 'Entrepreneur', 'Storyteller', 'Hospitality Creative', 'Fermentation'],
  support: 'Good things take time.',
};

export const JOURNAL = {
  label: 'THE ENGINE ROOM',
  headline:
    'A personal journal of cocktails, fermentation, hospitality, sustainability & the hard work of turning dreams into real drinks and real stories.',
  copy: 'Notes from behind the bar, every week — recipes, ferments, half-formed ideas, and the honest business of building something worth raising a glass to.',
  cta: 'Read the Dream',
};

export const SPEAKING = {
  label: 'SEMINARS & PUBLIC SPEAKING',
  headline: 'Where the dream already lives.',
  copy: 'A bookable lineup of intimate workshops and talks for brand events, hospitality, and private groups.',
  // Durations / group sizes were not present in the supplied copy — edit the `meta` strings below once confirmed.
  offerings: [
    {
      title: 'Fermentation',
      meta: 'HANDS-ON WORKSHOP · DURATION & GROUP SIZE ON REQUEST',
      copy: 'A working session on wild flavour — kombucha, kefir, koji, and the patience they demand. Part science, part philosophy, all delicious. Guests leave with a starter and a new way of thinking about time.',
    },
    {
      title: 'From a Dream to Reality',
      meta: 'FOUNDER TALK · DURATION ON REQUEST + Q&A',
      copy: 'The honest story of building rooms, bars, and ventures from nothing but an idea and a lot of nerve. For teams and creatives who want the real version — the doubt, the grind, the payoff.',
    },
    {
      title: 'Sustain Yourself First',
      meta: 'HOSPITALITY KEYNOTE · DURATION ON REQUEST',
      copy: 'Real sustainability in hospitality starts with the people, not the packaging. A candid talk on building careers and kitchens that last — without burning out the humans who run them.',
    },
  ],
  cta: 'Request a speaking inquiry',
  note: 'Half-day & custom formats available · Travel from Toronto',
};

export const COLLAB = {
  label: 'SPONSORED CO-SHARED BRAND CONTENT',
  headline: 'Where the dream already lives.',
  copy: [
    'Massi makes branded content that doesn’t feel like an ad. Spirits, glassware, ingredients, venues — he weaves your product into a story his 41.7K already trust. One reel, filmed and posted from @thirstydreamer, reaching the exact audience that buys what you make.',
    'Work closely with Massi creating tailored brand content reflecting your ethos & brand philosophy.',
  ],
  steps: [
    { title: 'You brief the brand', copy: 'Tell Massi the product and the story you want told. A spirit launch, a glassware drop, a venue, an ingredient — anything hospitality-adjacent.' },
    { title: 'Together we work on a tailored Reel', copy: 'Massi concepts, shoots, and edits a short-form video in his own voice — the craft, the pour, the dream. Filmed at Mother or on location.' },
    { title: 'We Post It Together for More Reach', copy: 'The reel goes live on @thirstydreamer to 41.7K engaged followers — plus usage rights so you can run it on your own channels.' },
  ],
  exampleLabel: 'PAID PARTNERSHIP · EXAMPLE CARD — NOT A REAL POST',
  fitLabel: 'A fit for brands like',
  fit: ['Spirits & rum', 'Glassware', 'Bitters & mixers', 'Venues & festivals'],
  cta: 'Start a partnership',
  note: 'Rate cards on request',
};

export const GALLERY = { label: 'BEHIND THE DREAM', empty: 'Video coming soon. Upload in Admin → Media.' };

/** Six gallery slots + hero + about. `key` is stored in media_assets.category. */
export const MEDIA_SLOTS = [
  { key: 'hero', label: 'Hero (homepage)', kind: 'any', gallery: false },
  { key: 'about', label: 'About portrait / muted clip', kind: 'any', gallery: false },
  { key: 'behind-the-bar', label: 'Behind the bar', kind: 'video', gallery: true },
  { key: 'cocktail-craft', label: 'Cocktail craft', kind: 'video', gallery: true },
  { key: 'fermentation', label: 'Fermentation experiment', kind: 'video', gallery: true },
  { key: 'hospitality-events', label: 'Hospitality / events', kind: 'video', gallery: true },
  { key: 'personal-story', label: 'Personal story', kind: 'video', gallery: true },
  { key: 'brand-collaboration', label: 'Brand collaboration', kind: 'video', gallery: true },
] as const;

export const EVENTS = {
  label: 'EVENTS & ACTIVATIONS',
  headline: 'Pop-ups, takeovers, and rooms that don’t exist yet.',
  types: ['Pop-ups', 'Takeovers', 'Activations', 'Guest shifts', 'Private hospitality experiences'],
  cta: 'Bring Massi into the room',
  empty: 'No events announced right now. Check back soon, or reach out to bring Massi into your room.',
};

export const CONSULT = {
  label: 'CONSULTATION / CREATIVE DIRECTION',
  copy: 'Hospitality consulting for people building rooms, rituals, products, and experiences with heart.',
  areas: [
    'Hospitality concept development',
    'Bar and beverage direction',
    'Fermentation and sustainable practice',
    'Experience design',
    'Brand storytelling',
    'Team workshops',
  ],
  cta: 'Talk to Massi',
};

export const CONTACT = {
  headline: 'Bring the dream into the room.',
  copy: 'Whether it’s a stage, a launch, a collaboration, a consultation, or a table that doesn’t officially exist — if it’s about hospitality done with heart, Massi wants to hear from you.',
  tagline: "Pull up a stool. The dream's already pouring.",
  closing: 'DON’T EVER STOP DREAMING',
};

export const INQUIRY_TYPES = [
  { value: 'speaking', label: 'Public speaking' },
  { value: 'brand_collaboration', label: 'Brand collaboration' },
  { value: 'event', label: 'Events' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'contact', label: 'General contact' },
] as const;

export const POST_CATEGORIES = ['Sustainability', 'Founder Story', 'Fermentation', 'Hospitality', 'Cocktails', 'Recipes', 'Ideas'];
