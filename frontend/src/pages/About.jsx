import { Card, PageHeader, Section } from '../components/ui.jsx';
import { useSiteData } from '../context/SiteDataContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

// Same order as about.sections in the translation files.
const keys = ['who_we_are', 'our_story', 'mission', 'vision', 'values', 'goals', 'what_we_do', 'approach', 'community'];

export default function About() {
  const { t } = useLanguage();
  const { text } = useSiteData();
  return (
    <>
      <PageHeader title={t('about.title')} subtitle={t('about.intro')} />
      <Section>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {t('about.sections').map((title, i) => (
            <Card key={title} title={title}>{text(`about.${keys[i]}`, t('common.placeholder'))}</Card>
          ))}
        </div>
      </Section>
    </>
  );
}
