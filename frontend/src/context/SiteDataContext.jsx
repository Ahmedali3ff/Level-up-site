import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const SiteDataContext = createContext({ content: { en: {}, ar: {} }, social: [] });

// Loads editable text blocks and social links once for the public site.
export function SiteDataProvider({ children }) {
  const [content, setContent] = useState({ en: {}, ar: {} });
  const [social, setSocial] = useState([]);

  useEffect(() => {
    api('/content/map').then(setContent).catch(() => {});
    api('/social-links?limit=20').then((d) => setSocial(d.items)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ content, social }), [content, social]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const { lang } = useLanguage();
  const { content, social } = useContext(SiteDataContext);
  // text(key, fallback): admin-edited text for the current language, or the fallback.
  const text = (key, fallback) => content[lang]?.[key] || fallback;
  return { text, social };
}
