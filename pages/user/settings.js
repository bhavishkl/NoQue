import React from 'react';
import Layout from '../../components/layout';
import { FiGlobe, FiBell, FiLock, FiUser } from 'react-icons/fi';

const UserSettings = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#292680]">Settings</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiGlobe className="mr-2 text-[#6f6cd3]" />
              Language Settings
            </h2>
            <p className="text-gray-600 mb-4">Choose your preferred language</p>
            {/* Language selection controls can be added here */}
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiBell className="mr-2 text-[#6f6cd3]" />
              Notification Settings
            </h2>
            <p className="text-gray-600 mb-4">Manage your notification preferences</p>
            {/* Add notification settings controls here */}
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiLock className="mr-2 text-[#6f6cd3]" />
              Privacy Settings
            </h2>
            <p className="text-gray-600 mb-4">Manage your privacy preferences</p>
            {/* Add privacy settings controls here */}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiUser className="mr-2 text-[#6f6cd3]" />
              Account Settings
            </h2>
            <p className="text-gray-600 mb-4">Manage your account details</p>
            {/* Add account settings controls here */}
          </div>
        </div>

        <button className="bg-[#6f6cd3] text-white py-2 px-4 rounded hover:bg-[#5956b3] transition duration-300">
          Save Changes
        </button>
      </div>
    </Layout>
  );
};

export default UserSettings;