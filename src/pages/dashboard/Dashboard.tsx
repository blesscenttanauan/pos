import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowRight, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

// Mock data
const stats = [
  { name: 'Total Sales', value: 24890.50, icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { name: 'Total Orders', value: 354, icon: ShoppingCart, color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
  { name: 'Products', value: 76, icon: Package, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { name: 'Customers', value: 148, icon: Users, color: 'text-amber-500', bgColor: 'bg-amber-100' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Smith', date: '2025-01-12', amount: 124.99, status: 'completed' },
  { id: 'ORD-002', customer: 'Emily Johnson', date: '2025-01-11', amount: 75.50, status: 'completed' },
  { id: 'ORD-003', customer: 'Michael Brown', date: '2025-01-11', amount: 249.99, status: 'pending' },
  { id: 'ORD-004', customer: 'Sarah Williams', date: '2025-01-10', amount: 39.99, status: 'completed' },
  { id: 'ORD-005', customer: 'David Miller', date: '2025-01-10', amount: 89.99, status: 'completed' },
];

const lowStockItems = [
  { id: 1, name: 'Chicken Burger', stock: 5, minStock: 10 },
  { id: 2, name: 'French Fries (L)', stock: 3, minStock: 15 },
  { id: 3, name: 'Coca Cola 330ml', stock: 8, minStock: 20 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-800">{greeting}, {user?.username}</h2>
        <p className="mt-1 text-gray-600">Here's what's happening with your store today.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {typeof stat.value === 'number' && stat.name.includes('Sales') 
                    ? formatCurrency(stat.value) 
                    : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link to="/pos" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent orders</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
            <Link to="/inventory" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              Inventory <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No low stock items</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {lowStockItems.map((item) => (
                  <li key={item.id} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Current stock: <span className="font-medium text-red-600">{item.stock}</span> / Min: {item.minStock}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="border-l-2 border-gray-200 pl-4 space-y-6">
          <div className="relative">
            <div className="absolute -left-6 mt-1 h-4 w-4 rounded-full bg-blue-500"></div>
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">New order received</p>
                <p className="text-sm text-gray-500">Order #ORD-001 from John Smith</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                10 minutes ago
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 mt-1 h-4 w-4 rounded-full bg-green-500"></div>
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">Inventory updated</p>
                <p className="text-sm text-gray-500">5 new items added to inventory</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                1 hour ago
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 mt-1 h-4 w-4 rounded-full bg-purple-500"></div>
            <div className="flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-sm text-gray-500">Sarah Williams joined as Cashier</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                3 hours ago
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;