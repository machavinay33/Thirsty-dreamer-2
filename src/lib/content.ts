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
  label: "MASSI'S BIO",
  headline: "Massi's Bio",
  body: [
    'My journey in the bar scene began in the heart of Rome, where I balanced childhood dreams and hard work. At just 13, I became captivated by the guitar while assisting his mother at her fish stand. After a brief stint with her, I immersed myself in the bustling bar culture of Via Serpenti at 14, making many cappuccinos every day as barista. This experience instilled discipline and a strong work ethic.',
    'By 15, I was crafting Aperitivos, laying the foundation for my hospitality philosophy: making guests feel valued. The passion for the craft grew, leading me to United Kingdom at 18, where I faced the realities of living alone and managing my own finances. Through determination, I climbed the ranks in the hospitality industry, eventually becoming a group bar manager in Manchester and a very active competitor in the cocktail scene.',
    'My relentless pursuit of excellence and innovation led me to open "Mother Cocktail Bar" in Toronto, focusing on fermentation techniques and honest, humble guest service. My dedication culminated in being named the "Canada World Class Bartender of the Year" in 2022 and coaching two Global winners in the same competition in 2023 & 2024.',
    'My story is one of craftsmanship, resilience, and the unwavering belief that the journey and the company is just as important as the destination.',
    'In the past 4 years I had the incredible honour to travel many countries sharing the love for the hospitality, cocktail making & fermentation.',
  ],
  closingQuote: '"I TRAIN LIKE I NEVER WON... AND I COMPETE LIKE | NEVER LOST" - Eileen Gu.',
};

export const EDITORIAL_STORIES = [
  {
    label: 'FERMENTATION',
    headline: 'Fermentation',
    body: [
      'Many would say that fermentation is simply a preserving technique developed by our ancestors to aid survival, but I see it as much more. I consider it a lifestyle that deepens your understanding of the creation of food and drinks.',
      "It's an incredible feeling not just to make but to create something from scratch, with love and care at every single step. Think about bread, koji, or even kombucha; we start with the simplest ingredients, such as grains, rice, or sweet tea, and end up with warm slices, tons of flavor, and bubbles. Does this process not make you shiver or, at the very least, spark your curiosity? Well, it certainly did for me, and I do not regret a single second of this fantastic journey.",
    ],
  },
  {
    label: 'SECRET DINERS',
    headline: 'Secret Diners',
    body: [
      "Even before I opened Mother Cocktail Bar, I had a professional dream: to collaborate with chefs on food and cocktail pairings. As often happens, things do not go as planned, so I decided to start a side hustle organizing a culinary-event-based experience where food and cocktails could harmonize together.",
      "What if our guests didn't know the menu until they sat down? I thought that could make everything more challenging, more mysterious, and more unique. Thus, the name SECRET DINERS was born.",
      'After almost 35 events, we brought the dinner series into restaurants, bars, and art galleries, and I had the luxury of collaborating with so many talented chefs. What started as a joke has become one of the things I am most proud of professionally.',
    ],
  },
  {
    label: 'SUSTAINABILITY',
    headline: 'Sustainability',
    body: [
      'Certainly, this is a word that has been over-repeated in many shapes and forms, often focusing on re-utilizing instead of prioritizing non-wasting. Each of us has a different approach to this matter; mine is very simple: "If you cannot sustain yourself, it\'s unlikely you will sustain the people around you." Your body, your mind, your surroundings, and especially your time are the most important factors in embracing sustainability and sharing it with others.',
      'This empowers the message within your own community, with the hope of extending it to other communities, thereby creating a chain of truly sustainable living on our planet Earth.',
    ],
  },
  {
    label: 'MOTHER COCKTAIL BAR',
    headline: 'Mother Cocktail Bar',
    body: [
      "Co-owned by renowned bartender and bar operator Massimo Zitti (Canada World Class Bartender of the Year 2022, ICCO Best Cocktail Bartender 2023, and official Canada's World Class Coach 2023/2024 — both leading Canada to win the World Title), Mother Cocktail Bar, located on Queen Street West in Toronto, is a top-ranked destination for innovative, fermentation-driven cocktails where hospitality meets sustainability and humble guest service.",
      "Recognized as No. 7 on Canada's Best 100 (2023) and No. 37 in North America's 50 Best Bars, Mother is acclaimed for its driven culture and avant-garde drink techniques and flavor discovery.",
      'Mother was born in 2019 from like-minded individuals who believed that the city of Toronto needed something new and different. Over time, this little cocktail hub on Queen Street became one of the industry\'s favorite bars and gained international recognition for bringing a "new wave" of cocktail-making to the city.',
      'When asked what he is most proud of, Massi (aka Thirsty Dreamer) will genuinely say: "Seeing staff and guests having fun, respecting our duties during service, and observing young talented professionals getting progressively better at their craft."',
      'Mother Cocktail Bar has the honor of collaborating with other fantastic establishments like Handshake Speakeasy (Mexico City), Overstory (NYC), Odd Couple (Shanghai), Passing Fences (UK), Double Chicken Please, Gokan, Punch Room - Edition Hotel - Tokyo, Nutmeg & Clove and many others..',
    ],
  },
] as const;

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
  email: 'massi@motherdrinks.co',
  phone: '437-985-7677',
};

export const INQUIRY_TYPES = [
  { value: 'speaking', label: 'Public speaking' },
  { value: 'brand_collaboration', label: 'Brand collaboration' },
  { value: 'event', label: 'Events' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'contact', label: 'General contact' },
] as const;

export const POST_CATEGORIES = ['Sustainability', 'Founder Story', 'Fermentation', 'Hospitality', 'Cocktails', 'Recipes', 'Ideas'];
