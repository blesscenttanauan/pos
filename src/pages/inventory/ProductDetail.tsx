import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Package, Tag, DollarSign, BarChart2, Calendar, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ProductModal from '../../components/inventory/ProductModal';

// Mock product data (same as in Inventory.tsx)
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulating API call to fetch product details
    setLoading(true);
    setTimeout(() => {
      const foundProduct = MOCK_PRODUCTS.find(p => p.id === id) || null;
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleUpdateProduct = (updatedProduct: Product) => {
    // For demo, we'll just update our local state
    setProduct(updatedProduct);
    setIsModalOpen(false);
  };

  const handleGoBack = () => {
    navigate('/inventory');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-2 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={handleGoBack}
          className="mt-4 btn btn-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Inventory
        </button>
      </div>
    );
  }

  const profit = product.price - product.cost;
  const profitMargin = (profit / product.price) * 100;

  return (
    <div className="pb-8">
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="btn btn-outline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900">{product.name}</h2>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Product image */}
          <div className="md:col-span-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="md:col-span-2 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">{product.category}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Current Stock</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">
                    <span className={
                      product.stock === 0 
                        ? 'text-red-600'
                        : product.stock <= product.minStock
                          ? 'text-amber-600'
                          : 'text-green-600'
                    }>
                      {product.stock}
                    </span>
                    <span className="text-gray-600 font-normal"> / {product.minStock} min</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cost / Profit</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">
                    {formatCurrency(product.cost)} / <span className="text-green-600">{formatCurrency(profit)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">
                    {profitMargin.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1 text-md font-semibold text-gray-900">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Stock trends chart would go here in a real application */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stock History</h3>
              <div className="bg-gray-50 rounded-md p-6 text-center text-gray-500">
                Stock history visualization would appear here in a production environment.
                This would include a chart showing stock levels over time and recent inventory adjustments.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateProduct}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;