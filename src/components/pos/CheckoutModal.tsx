import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, ShoppingCart, Clipboard, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (paymentMethod: string) => void;
  cart: any;
}

const CheckoutModal = ({ isOpen, onClose, onCheckout, cart }: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customAmount, setCustomAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState('');

  const handleAmountChange = (value: string) => {
    setCustomAmount(value);
    const amountPaid = parseFloat(value) || 0;
    setChangeAmount(Math.max(0, amountPaid - cart.total));
  };

  const handleDiscountChange = (value: string) => {
    setDiscountAmount(value);
    const discount = parseFloat(value) || 0;
    cart.setDiscount(discount);
  };

  const handlePayment = () => {
    onCheckout(paymentMethod);
  };

  const incrementQuantity = (itemId: string) => {
    const item = cart.items.find((i: any) => i.id === itemId);
    if (item) {
      cart.updateQuantity(itemId, item.quantity + 1);
    }
  };

  const decrementQuantity = (itemId: string) => {
    const item = cart.items.find((i: any) => i.id === itemId);
    if (item && item.quantity > 1) {
      cart.updateQuantity(itemId, item.quantity - 1);
    } else {
      cart.removeItem(itemId);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl w-full max-w-lg"
          >
            <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-500" />
                Checkout
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cart items summary */}
              <div className="max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item: any) => (
                    <li key={item.id} className="py-2">
                      <div className="flex justify-between">
                        <span className="text-gray-900">{item.productName}</span>
                        <span className="text-gray-900">{formatCurrency(item.subtotal)}</span>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-1 w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => incrementQuantity(item.id)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">{formatCurrency(item.price)} each</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Discount */}
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                  Discount Amount ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="discount"
                    className="input pl-10 block w-full"
                    placeholder="0.00"
                    value={discountAmount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Payment method selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md flex items-center justify-center ${
                      paymentMethod === 'cash'
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    Cash
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md flex items-center justify-center ${
                      paymentMethod === 'card'
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Card
                  </button>
                </div>
              </div>

              {/* Cash payment details */}
              {paymentMethod === 'cash' && (
                <div>
                  <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">
                    Amount Received ($)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amountPaid"
                      className="input pl-10 block w-full"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      min={cart.total.toString()}
                    />
                  </div>
                  
                  {changeAmount > 0 && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      Change: {formatCurrency(changeAmount)}
                    </div>
                  )}
                  
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[10, 20, 50].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 border border-gray-200"
                        onClick={() => handleAmountChange(amount.toString())}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[100, 'exact'].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 border border-gray-200"
                        onClick={() => handleAmountChange(amount === 'exact' ? cart.total.toString() : amount.toString())}
                      >
                        {amount === 'exact' ? 'Exact' : `$${amount}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Order summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <p>Subtotal</p>
                    <p>{formatCurrency(cart.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <p>Tax</p>
                    <p>{formatCurrency(cart.tax)}</p>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-sm text-red-600 mb-1">
                      <p>Discount</p>
                      <p>-{formatCurrency(cart.discount)}</p>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>Total</p>
                    <p>{formatCurrency(cart.total)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary flex items-center"
                onClick={handlePayment}
                disabled={paymentMethod === 'cash' && (!customAmount || parseFloat(customAmount) < cart.total)}
              >
                <Clipboard className="h-5 w-5 mr-2" />
                Complete Sale
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;