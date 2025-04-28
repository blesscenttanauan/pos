import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, RefreshCcw, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import ProductModal from '../../components/inventory/ProductModal';

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Chicken Burger',
    description: 'Crispy chicken burger with lettuce and mayo',
    price: 8.99,
    category: 'Burgers',
    imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 45,
    minStock: 10,
    cost: 3.50,
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2025-01-10T12:00:00Z',
  },
  {
    id: '2',
    name: 'French Fries (L)',
    description: 'Large portion of crispy french fries',
    price: 4.99,
    category: 'Sides',
    imageUrl: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 3,
    minStock: 15,
    cost: 1.20,
    createdAt: '2025-01-09T12:00:00Z',
    updatedAt: '2025-01-09T12:00:00Z',
  },
  {
    id: '3',
    name: 'Coca Cola 330ml',
    description: 'Refreshing cola drink, 330ml can',
    price: 2.49,
    category: 'Beverages',
    imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 8,
    minStock: 20,
    cost: 0.80,
    createdAt: '2025-01-08T12:00:00Z',
    updatedAt: '2025-01-08T12:00:00Z',
  },
  {
    id: '4',
    name: 'Veggie Burger',
    description: 'Plant-based burger with fresh veggies',
    price: 9.99,
    category: 'Burgers',
    imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 22,
    minStock: 5,
    cost: 4.20,
    createdAt: '2025-01-07T12:00:00Z',
    updatedAt: '2025-01-07T12:00:00Z',
  },
  {
    id: '5',
    name: 'Chicken Wings (8pc)',
    description: 'Spicy buffalo wings, 8 pieces',
    price: 12.99,
    category: 'Appetizers',
    imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 18,
    minStock: 8,
    cost: 6.50,
    createdAt: '2025-01-06T12:00:00Z',
    updatedAt: '2025-01-06T12:00:00Z',
  },
];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filtered products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    const matchesStock = stockFilter === 'low' 
      ? product.stock <= product.minStock
      : stockFilter === 'out' 
        ? product.stock === 0
        : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = (product: Product) => {
    // For demo, we'll just add it to our local state
    const newProduct = {
      ...product,
      id: String(products.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    // For demo, we'll just update our local state
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="pb-8">
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
            <p className="text-gray-600 mt-1">Manage your products, stock levels, and categories.</p>
          </div>
          <button
            onClick={() => {
              setCurrentProduct(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        {/* Search and filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 w-full"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="input pl-10 appearance-none pr-8"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShoppingBag className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <select
                  className="input pl-10 appearance-none pr-8"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setStockFilter('');
                }}
                className="btn btn-outline"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product table */}
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Filter className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p>No products found. Try adjusting your filters or add a new product.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.imageUrl} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {product.stock <= product.minStock ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                        ) : null}
                        <span className={`font-medium ${
                          product.stock === 0 
                            ? 'text-red-600'
                            : product.stock <= product.minStock
                              ? 'text-amber-600'
                              : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                        <span className="text-gray-500 ml-1">/ {product.minStock} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <Link 
                        to={`/inventory/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
        }}
        onSave={currentProduct ? handleUpdateProduct : handleAddProduct}
        product={currentProduct}
      />
    </div>
  );
};

export default Inventory;