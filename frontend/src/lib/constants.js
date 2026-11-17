// Keys match the values stored by the backend. Order of categoryKeys matches the
// `categories` array in the translation files.
export const categoryKeys = ['scholarships', 'competitions', 'programs', 'volunteering', 'digital_skills', 'english', 'technology', 'research'];

export const categoryLabels = [
  'Scholarships & Educational Opportunities',
  'Competitions & Challenges',
  'Programs & Workshops',
  'Volunteering & Internships',
  'Digital Skills',
  'English & Communication',
  'Technology & Innovation',
  'Research & Personal Development',
];

export const programStatuses = ['coming_soon', 'open', 'ongoing', 'closed', 'completed', 'postponed'];

// Order matches next.sections[3..10] in the translation files.
export const activityTypes = ['program', 'competition', 'challenge', 'project', 'hackathon', 'workshop', 'team_experience', 'showcase'];

// Editable text blocks (Website Content). Pages fall back to built-in placeholder text when empty.
export const contentSections = [
  { key: 'home.hero_text', label: 'Home - hero introduction' },
  { key: 'home.about_text', label: 'Home - About LevelUp' },
  { key: 'home.next_text', label: 'Home - NEXT introduction' },
  { key: 'about.who_we_are', label: 'About - Who We Are' },
  { key: 'about.our_story', label: 'About - Our Story' },
  { key: 'about.mission', label: 'About - Our Mission' },
  { key: 'about.vision', label: 'About - Our Vision' },
  { key: 'about.values', label: 'About - Our Values' },
  { key: 'about.goals', label: 'About - Our Goals' },
  { key: 'about.what_we_do', label: 'About - What We Do' },
  { key: 'about.approach', label: 'About - Our Approach' },
  { key: 'about.community', label: 'About - Our Community' },
  { key: 'next.intro', label: 'NEXT - introduction' },
  { key: 'next.about', label: 'NEXT - About NEXT' },
  { key: 'next.vision', label: 'NEXT - Our Vision' },
  { key: 'next.approach', label: 'NEXT - Our Approach' },
  { key: 'impact.intro', label: 'Impact - introduction' },
  { key: 'impact.programs', label: 'Impact - Programs & Initiatives' },
  { key: 'impact.community', label: 'Impact - Community Growth' },
  { key: 'impact.events', label: 'Impact - Activities & Events' },
  { key: 'impact.partnerships', label: 'Impact - Partnerships' },
  { key: 'impact.achievements', label: 'Impact - Selected Achievements' },
  { key: 'partner.intro', label: 'Partner - introduction' },
  { key: 'partner.why', label: 'Partner - Why Collaborate' },
  { key: 'contact.intro', label: 'Contact - introduction' },
];
