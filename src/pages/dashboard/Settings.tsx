import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Building, Printer, Database, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
          <p className="mt-1 text-sm text-gray-500">Configure your InvenPOS system preferences.</p>
        </div>

        <div className="px-6 py-5 sm:p-0">
          <div className="sm:flex">
            {/* Tabs */}
            <div className="w-full sm:w-64 sm:border-r border-gray-200">
              <nav className="flex sm:flex-col sm:space-y-1 sm:py-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-3 sm:mb-0 text-sm font-medium rounded-md flex items-center ${
                    activeTab === 'general'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Building className="mr-3 h-5 w-5 flex-shrink-0" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-3 sm:mb-0 text-sm font-medium rounded-md flex items-center ${
                    activeTab === 'users'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <User className="mr-3 h-5 w-5 flex-shrink-0" />
                  Users & Permissions
                </button>
                <button
                  onClick={() => setActiveTab('receipt')}
                  className={`px-4 py-3 sm:mb-0 text-sm font-medium rounded-md flex items-center ${
                    activeTab === 'receipt'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Printer className="mr-3 h-5 w-5 flex-shrink-0" />
                  Receipt Settings
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-3 sm:mb-0 text-sm font-medium rounded-md flex items-center ${
                    activeTab === 'database'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Database className="mr-3 h-5 w-5 flex-shrink-0" />
                  Database Connection
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="mt-5 sm:mt-0 sm:flex-1 sm:px-6 sm:py-6">
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Business Information</h4>
                    <p className="mt-1 text-sm text-gray-500">This information will appear on your receipts.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        className="mt-1 input w-full"
                        defaultValue="InvenPOS Restaurant"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        className="mt-1 input w-full"
                        defaultValue="123 Main Street, Suite 101&#10;New York, NY 10001"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="mt-1 input w-full"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="mt-1 input w-full"
                          defaultValue="contact@invenpos.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                        Logo
                      </label>
                      <div className="mt-1 flex items-center">
                        <div className="h-16 w-16 border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="ml-5 btn btn-outline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG or JPG up to 2MB. Recommended size: 200x200px.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-base font-medium text-gray-900">User Management</h4>
                    <p className="mt-1 text-sm text-gray-500">Manage user access and permissions.</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <p className="text-sm text-gray-700">
                      This demo version simulates user management. In a production environment, you would be
                      able to add, edit, and remove users with different permission levels.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Admin User
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            admin@example.com
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Administrator
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Cashier User
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            cashier@example.com
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Cashier
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'receipt' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Receipt Preferences</h4>
                    <p className="mt-1 text-sm text-gray-500">Customize your receipt appearance and content.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="receiptHeader" className="block text-sm font-medium text-gray-700">
                        Receipt Header
                      </label>
                      <textarea
                        id="receiptHeader"
                        name="receiptHeader"
                        rows={2}
                        className="mt-1 input w-full"
                        defaultValue="Thank you for dining with us!"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="receiptFooter" className="block text-sm font-medium text-gray-700">
                        Receipt Footer
                      </label>
                      <textarea
                        id="receiptFooter"
                        name="receiptFooter"
                        rows={2}
                        className="mt-1 input w-full"
                        defaultValue="Please come again! www.invenpos.com"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="showLogo"
                        name="showLogo"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                        Show logo on receipt
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="showQR"
                        name="showQR"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="showQR" className="ml-2 block text-sm text-gray-700">
                        Include QR code for digital receipt
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
                        Font Size
                      </label>
                      <select
                        id="fontSize"
                        name="fontSize"
                        className="mt-1 input w-full"
                        defaultValue="medium"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="printer" className="block text-sm font-medium text-gray-700">
                        Default Printer
                      </label>
                      <select
                        id="printer"
                        name="printer"
                        className="mt-1 input w-full"
                        defaultValue="system"
                      >
                        <option value="system">System Default Printer</option>
                        <option value="thermal">Thermal Receipt Printer</option>
                        <option value="pdf">Save as PDF</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'database' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-base font-medium text-gray-900">PostgreSQL Database Connection</h4>
                    <p className="mt-1 text-sm text-gray-500">Configure your database connection settings.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="dbHost" className="block text-sm font-medium text-gray-700">
                        Host
                      </label>
                      <input
                        type="text"
                        id="dbHost"
                        name="dbHost"
                        className="mt-1 input w-full"
                        placeholder="localhost"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dbPort" className="block text-sm font-medium text-gray-700">
                          Port
                        </label>
                        <input
                          type="text"
                          id="dbPort"
                          name="dbPort"
                          className="mt-1 input w-full"
                          placeholder="5432"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dbName" className="block text-sm font-medium text-gray-700">
                          Database Name
                        </label>
                        <input
                          type="text"
                          id="dbName"
                          name="dbName"
                          className="mt-1 input w-full"
                          placeholder="invenpos"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="dbUser" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="dbUser"
                        name="dbUser"
                        className="mt-1 input w-full"
                        placeholder="postgres"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dbPassword" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        id="dbPassword"
                        name="dbPassword"
                        className="mt-1 input w-full"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="button"
                        className="btn btn-outline"
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;