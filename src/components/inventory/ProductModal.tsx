import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, ImageOff } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

const DEFAULT_PRODUCT: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
  stock: 0,
  minStock: 5,
  cost: 0,
};

const ProductModal = ({ isOpen, onClose, onSave, product }: ProductModalProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>(DEFAULT_PRODUCT);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // When product changes, update form data
  useEffect(() => {
    if (product) {
      const { id, createdAt, updatedAt, ...rest } = product;
      setFormData(rest);
      setPreviewUrl(rest.imageUrl);
    } else {
      setFormData(DEFAULT_PRODUCT);
      setPreviewUrl('');
    }
  }, [product]);

  // File dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      // In a real app, we would upload to server or cloud storage
      // For this demo, we'll use local file URL
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // In a real app, we would get the imageUrl from the server after upload
      // For this demo, we'll use a sample URL or the file preview URL
      setFormData({
        ...formData,
        imageUrl: fileUrl,
      });
    },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than zero');
      return;
    }

    // If editing, preserve id, createdAt, and update updatedAt
    if (product) {
      onSave({
        ...formData,
        id: product.id,
        createdAt: product.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // For new products, generate placeholder values (in a real app, the server would do this)
      onSave({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl w-full max-w-2xl"
            >
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {product ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 input w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                        Cost ($)
                      </label>
                      <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                        Barcode
                      </label>
                      <input
                        type="text"
                        id="barcode"
                        name="barcode"
                        value={formData.barcode || ''}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Current Stock *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="minStock" className="block text-sm font-medium text-gray-700">
                        Minimum Stock *
                      </label>
                      <input
                        type="number"
                        id="minStock"
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleChange}
                        className="mt-1 input w-full"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <div className="mt-1 flex flex-col sm:flex-row gap-4 items-center">
                      {/* Image preview */}
                      <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-10 w-10 text-gray-400" />
                        )}
                      </div>

                      {/* Upload area */}
                      <div 
                        {...getRootProps()} 
                        className={`flex-1 p-6 border-2 border-dashed rounded-md cursor-pointer ${
                          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center text-sm text-gray-600">
                          <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-center">
                            <span className="text-blue-600 font-medium">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG or JPG (max. 2MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Or paste image URL..."
                        className="input w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-outline mr-3"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {product ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;