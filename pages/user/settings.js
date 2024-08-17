import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { FiGlobe, FiBell, FiLock, FiUser } from 'react-icons/fi';

const UserSettings = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#292680]">{t('settings')}</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiGlobe className="mr-2 text-[#6f6cd3]" />
              {t('languageSettings')}
            </h2>
            <p className="text-gray-600 mb-4">{t('chooseLanguage')}</p>
            <LanguageSwitcher />
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiBell className="mr-2 text-[#6f6cd3]" />
              {t('notificationSettings')}
            </h2>
            <p className="text-gray-600 mb-4">{t('manageNotifications')}</p>
            {/* Add notification settings controls here */}
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2 text-[#6f6cd3]" />
              {t('privacySettings')}
            </h2>
            <p className="text-gray-600 mb-4">{t('managePrivacy')}</p>
            {/* Add privacy settings controls here */}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiUser className="mr-2 text-[#6f6cd3]" />
              {t('accountSettings')}
            </h2>
            <p className="text-gray-600 mb-4">{t('manageAccount')}</p>
            {/* Add account settings controls here */}
          </div>
        </div>

        <button className="bg-[#6f6cd3] text-white py-2 px-4 rounded hover:bg-[#5956b3] transition duration-300">
          {t('saveChanges')}
        </button>
      </div>
    </Layout>
  );
};

export default UserSettings;