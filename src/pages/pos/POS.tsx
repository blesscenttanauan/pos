import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  QrCode,
  Printer,
  AlertCircle,
  Search,
  ArrowRight
} from 'lucide-react';
import { Product, OrderItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from '../../components/pos/CheckoutModal';
import Receipt from '../../components/pos/Receipt';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';

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
  {
    id: '6',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing',
    price: 7.99,
    category: 'Salads',
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 15,
    minStock: 5,
    cost: 3.00,
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-05T12:00:00Z',
  },
  {
    id: '7',
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon',
    price: 2.99,
    category: 'Beverages',
    imageUrl: 'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 30,
    minStock: 10,
    cost: 0.60,
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-05T12:00:00Z',
  },
  {
    id: '8',
    name: 'Cheesecake Slice',
    description: 'New York style cheesecake',
    price: 5.99,
    category: 'Desserts',
    imageUrl: 'https://images.pexels.com/photos/14000520/pexels-photo-14000520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    stock: 12,
    minStock: 5,
    cost: 2.50,
    createdAt: '2025-01-04T12:00:00Z',
    updatedAt: '2025-01-04T12:00:00Z',
  },
];

// Get unique categories
const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));

const POS = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const cart = useCartStore();
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter products based on category and search term
    let filtered = products;
    
    if (activeCategory) {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, searchTerm, products]);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      toast.success('Receipt printed successfully!');
    },
  });

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleCheckout = (paymentMethod: string) => {
    // In a real app, we would send this to the backend
    const orderData = {
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      discount: cart.discount,
      total: cart.total,
      paymentMethod,
      customerName: cart.customerName || 'Guest',
      createdAt: new Date().toISOString(),
      businessInfo: {
        name: 'InvenPOS Restaurant',
        address: '123 Main Street, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'contact@invenpos.com',
      },
      qrCodeData: `https://invenpos.com/receipt/${Math.floor(Math.random() * 1000000)}`,
    };
    
    setReceiptData(orderData);
    setShowReceipt(true);
    setIsCheckoutModalOpen(false);
    
    // Clear cart after successful checkout
    cart.clearCart();
    
    toast.success('Order completed successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Products section (left side) */}
        <div className="w-full lg:w-2/3 flex flex-col overflow-hidden">
          {/* Categories and search */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex mb-4">
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
            </div>
            
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('')}
                className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                  activeCategory === ''
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products grid */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="aspect-square w-full relative overflow-hidden"
                      onClick={() => handleAddToCart(product)}
                    >
                      <img 
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                        <button
                          className="btn btn-primary w-full py-1.5 text-sm flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Cart
                        </button>
                      </div>
                      {product.stock <= product.minStock && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                          Low Stock: {product.stock}
                        </div>
                      )}
                    </div>
                    <div 
                      className="p-3 cursor-pointer"
                      onClick={() => handleAddToCart(product)}
                    >
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-green-600 font-semibold mt-1">{formatCurrency(product.price)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Cart section (right side) */}
        <div className="hidden lg:flex lg:w-1/3 border-l border-gray-200 bg-white flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
              Current Order
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-gray-500">Add items to get started.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">{item.productName}</span>
                      <span className="text-gray-900">{formatCurrency(item.subtotal)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(cart.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              disabled={cart.items.length === 0}
              className="mt-4 btn btn-primary w-full flex items-center justify-center"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Checkout
            </button>
          </div>
        </div>
        
        {/* Mobile cart button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-10">
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="btn btn-primary h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                {cart.items.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onCheckout={handleCheckout}
        cart={cart}
      />
      
      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowReceipt(false)}
            />

            {/* Modal */}
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl w-full max-w-md">
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Receipt</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowReceipt(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div ref={receiptRef}>
                  <Receipt data={receiptData} />
                </div>
                
                <div className="mt-6 flex flex-col space-y-3">
                  <button
                    onClick={handlePrint}
                    className="btn btn-primary flex items-center justify-center"
                  >
                    <Printer className="h-5 w-5 mr-2" />
                    Print Receipt
                  </button>
                  
                  <button
                    onClick={() => {
                      // In a real app, we would handle sharing the receipt
                      toast.success('QR code for receipt has been shared');
                    }}
                    className="btn btn-outline flex items-center justify-center"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Share Receipt QR
                  </button>
                  
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="btn btn-outline flex items-center justify-center"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    New Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;