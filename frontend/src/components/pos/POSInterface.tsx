import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Scan,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Tag,
  DollarSign,
  CreditCard,
  Smartphone,
  Clock,
  Check,
  X,
  Star,
  Grid3x3,
  List,
  Printer,
  Download,
  Package,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppSelector } from '@hooks/useAppSelector';
import { printReceipt, downloadReceiptText } from '@utils/receipt';
import axios from 'axios';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  image?: string;
  barcode?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  barcode: string;
  category?: string;
  stock?: number;
}

interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
}

interface SaleResponse {
  id: string;
  saleNumber: string;
  total: number;
  amountPaid: number;
  change: number;
  createdAt: string;
}

type PaymentMethod = 'cash' | 'card' | 'mpesa' | 'split';
type ViewMode = 'grid' | 'list';

export const POSInterface: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [cashReceived, setCashReceived] = useState('');
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<SaleResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Fetch products and branches on mount
  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchBranches();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      const productsData = Array.isArray(response.data?.data) ? response.data.data : [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      const branchesData = Array.isArray(response.data?.data) ? response.data.data : [];
      setBranches(branchesData);
      // Auto-select first branch if none selected
      if (branchesData.length > 0) {
        setSelectedBranch(branchesData[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Show user-friendly error
      alert('Failed to load branches. Please refresh the page.');
    }
  };

  // Mock data - filtered by real products when available
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
  ];

  // Use real products if available, otherwise show recent/favorites from mock
  const displayProducts = products.length > 0 ? products : [];
  
  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentProducts = products.length > 0 
    ? products.slice(0, 4).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        barcode: p.barcode || '000000'
      }))
    : [
        { id: '1', name: 'Fresh Milk', price: 2.99, image: null, barcode: '123456' },
        { id: '2', name: 'White Bread', price: 1.99, image: null, barcode: '123457' },
        { id: '3', name: 'Apple', price: 0.99, image: null, barcode: '123458' },
        { id: '4', name: 'Orange Juice', price: 3.49, image: null, barcode: '123459' },
      ];

  const favoriteProducts = products.length > 0
    ? products.slice(4, 6).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        barcode: p.barcode || '000000'
      }))
    : [
        { id: '5', name: 'Coca Cola', price: 1.49, image: null, barcode: '123460' },
        { id: '6', name: 'Butter', price: 4.99, image: null, barcode: '123461' },
      ];

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        {
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          barcode: product.barcode,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const applyDiscount = (id: string, discount: number) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, discount } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = item.discount ? (itemTotal * item.discount) / 100 : 0;
      return sum + (itemTotal - discountAmount);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    return received - calculateTotal();
  };

  const processPayment = async () => {
    if (!selectedBranch) {
      alert('Please select a branch before processing payment. If no branches are available, please contact your administrator.');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to cart before processing payment');
      return;
    }

    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived) || 0;
      if (received < calculateTotal()) {
        alert('Insufficient cash received');
        return;
      }
    }

    setProcessing(true);

    try {
      // Prepare sale data
      const saleData = {
        branchId: parseInt(selectedBranch),
        customerId: customer ? parseInt(customer.id) : null,
        items: cart.map(item => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount || 0,
          tax: 16, // 16% tax rate
        })),
        payments: [{
          method: paymentMethod,
          amount: paymentMethod === 'cash' 
            ? parseFloat(cashReceived) 
            : calculateTotal(),
          reference: paymentMethod === 'mpesa' ? `MPESA-${Date.now()}` : undefined,
        }],
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: 0,
        total: calculateTotal(),
        amountPaid: paymentMethod === 'cash' 
          ? parseFloat(cashReceived) 
          : calculateTotal(),
        changeAmount: calculateChange(),
        notes: customer ? `Customer: ${customer.name}` : undefined,
      };

      // Create sale via API
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/pos/sales`,
        saleData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const sale = response.data?.data;
      
      if (sale) {
        setLastSale({
          id: sale.id,
          saleNumber: sale.saleNumber,
          total: sale.total,
          amountPaid: sale.amountPaid,
          change: sale.changeAmount || 0,
          createdAt: sale.createdAt,
        });

        // Show receipt modal
        setShowPaymentModal(false);
        setShowReceiptModal(true);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!lastSale) return;

    const branch = branches.find(b => b.id === selectedBranch);
    
    printReceipt({
      saleNumber: lastSale.saleNumber,
      date: new Date(lastSale.createdAt),
      cashier: user?.firstName || user?.email || 'Cashier',
      customer: customer ? { name: customer.name, phone: customer.phone } : undefined,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.price * item.quantity * (1 - (item.discount || 0) / 100),
      })),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: 0,
      total: lastSale.total,
      amountPaid: lastSale.amountPaid,
      change: lastSale.change,
      paymentMethod: paymentMethod,
      branch: branch ? {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
      } : undefined,
    });
  };

  const handleDownloadReceipt = () => {
    if (!lastSale) return;

    const branch = branches.find(b => b.id === selectedBranch);
    
    downloadReceiptText({
      saleNumber: lastSale.saleNumber,
      date: new Date(lastSale.createdAt),
      cashier: user?.firstName || user?.email || 'Cashier',
      customer: customer ? { name: customer.name, phone: customer.phone } : undefined,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.price * item.quantity * (1 - (item.discount || 0) / 100),
      })),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: 0,
      total: lastSale.total,
      amountPaid: lastSale.amountPaid,
      change: lastSale.change,
      paymentMethod: paymentMethod,
      branch: branch ? {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
      } : undefined,
    });
  };

  const completeTransaction = () => {
    clearCart();
    setShowReceiptModal(false);
    setLastSale(null);
    setCashReceived('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Point of Sale
              </h1>
            </div>
            
            {/* Branch Selector - Prominent */}
            {branches.length > 0 ? (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Branch:
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-lg text-sm font-medium text-blue-900 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-600 rounded-lg">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  ⚠️ No branches available - Contact admin
                </span>
              </div>
            )}
            
            {customer && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  {customer.name}
                </span>
                <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
                  {customer.loyaltyPoints} pts
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Filters */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or scan barcode..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Scan className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
              
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* All Products - Searchable */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Products'}
                </h3>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredProducts.map((product) => (
                      <motion.button
                        key={product.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
                      >
                        <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-2 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.stock && product.stock < 10 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Only {product.stock} left
                          </p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            {!searchQuery && selectedCategory === 'all' && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Favorites
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {favoriteProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg p-4 border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600 transition-all"
                    >
                      <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Products */}
            {!searchQuery && selectedCategory === 'all' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recently Sold
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {recentProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-2 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Order
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                {cart.length} items
              </span>
            </div>
            {!customer && (
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                Add Customer
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => applyDiscount(item.id, 10)}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          Discount
                        </button>
                      </div>

                      {item.discount && (
                        <div className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                          {item.discount}% discount applied
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-3 opacity-50" />
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs mt-1">Scan or select products to add</p>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (16%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${calculateTax().toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0 || !selectedBranch}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg shadow-lg transition-all"
              >
                <DollarSign className="w-5 h-5" />
                {!selectedBranch ? 'Select Branch First' : 'Complete Payment'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Payment
              </h3>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    paymentMethod === 'mpesa'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-medium">M-Pesa</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('split')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    paymentMethod === 'split'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
                  <Tag className="w-6 h-6" />
                  <span className="text-sm font-medium">Split</span>
                </button>
              </div>

              {/* Cash Payment Input */}
              {paymentMethod === 'cash' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cash Received
                  </label>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {parseFloat(cashReceived) > 0 && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Change</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${calculateChange().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={processing || (paymentMethod === 'cash' && parseFloat(cashReceived) < calculateTotal())}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && lastSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receipt #{lastSale.saleNumber}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${lastSale.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${lastSale.amountPaid.toFixed(2)}
                  </span>
                </div>
                {lastSale.change > 0 && (
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-green-600 dark:text-green-400">Change</span>
                    <span className="text-green-600 dark:text-green-400">
                      ${lastSale.change.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  Print Receipt
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Receipt
                </button>
                <button
                  onClick={completeTransaction}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Complete & New Sale
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
