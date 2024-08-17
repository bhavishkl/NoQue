import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => changeLanguage('en')} className="px-2 py-1 text-sm bg-gray-200 rounded">EN</button>
      <button onClick={() => changeLanguage('hi')} className="px-2 py-1 text-sm bg-gray-200 rounded">HI</button>
      <button onClick={() => changeLanguage('kn')} className="px-2 py-1 text-sm bg-gray-200 rounded">KN</button>
      <button onClick={() => changeLanguage('gu')} className="px-2 py-1 text-sm bg-gray-200 rounded">GU</button>
    </div>
  );
};

export default LanguageSwitcher;