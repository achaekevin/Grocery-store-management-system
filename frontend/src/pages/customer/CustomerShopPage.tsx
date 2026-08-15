import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Plus,
  Minus,
  Heart,
  ShoppingCart,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
  Send,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import {
  addToCustomerCart,
  toggleWishlist,
  setSelectedCategory,
  setSearchQuery,
} from '@store/slices/customerPortalSlice';
import { customerApi, CustomerProduct } from '@services/customer.api';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();

  const { wishlist, selectedCategory, searchQuery, selectedBranch } = useAppSelector(
    (state) => state.customerPortal
  );
  const navigate = useNavigate();

  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<CustomerProduct | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  // Review state inside modal
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const categories = [
    { id: 'all', label: 'All Groceries' },
    { id: 'Fresh Produce', label: 'Fresh Produce' },
    { id: 'Dairy & Eggs', label: 'Dairy & Eggs' },
    { id: 'Bakery', label: 'Bakery' },
    { id: 'Beverages', label: 'Beverages' },
    { id: 'Groceries', label: 'Groceries' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: CustomerProduct, qty = 1) => {
    dispatch(addToCustomerCart({ product, quantity: qty }));
    success(`Added ${qty} × ${product.name} to basket!`);
    if (selectedProduct) {
      setSelectedProduct(null);
      setModalQuantity(1);
    }
  };

  const handleBuyNow = (product: CustomerProduct, qty = 1) => {
    dispatch(addToCustomerCart({ product, quantity: qty }));
    if (selectedProduct) {
      setSelectedProduct(null);
      setModalQuantity(1);
    }
    navigate('/customer/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!newReviewComment.trim()) {
      error('Please enter a review comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await customerApi.submitReview({
        productId: selectedProduct.id,
        rating: newReviewRating,
        comment: newReviewComment,
      });
      success('Thank you! Your verified purchase review has been published.');
      setNewReviewComment('');
    } catch (err) {
      error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Online Grocery Store</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Freshness guaranteed • Showing live stock availability for{' '}
            <span className="font-bold text-emerald-700">{selectedBranch}</span>
          </p>
        </div>

        {/* Controls: Search and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Filter items in catalog..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs shadow-2xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setSelectedCategory(cat.id))}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition shadow-2xs',
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Catalog Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="h-44 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try checking your spelling or clearing search filters.</p>
          </div>
          <button
            onClick={() => {
              dispatch(setSearchQuery(''));
              dispatch(setSelectedCategory('all'));
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const isWishlisted = wishlist.some((w) => w.id === product.id);
            const branchQty = product.branchStock?.[selectedBranch] ?? product.stockCount;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition flex flex-col group"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleWishlist(product));
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-slate-600 hover:text-rose-500 shadow-xs transition"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Tags */}
                  {product.tags?.[0] && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                      {product.tags[0]}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {branchQty > 0 ? `In Stock (${branchQty})` : 'Out of Stock'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{product.unit} • {product.brand}</p>
                  </div>

                  {/* Price & Action buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">KSh {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">KSh {product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToCart(product, 1)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-bold transition flex items-center justify-center"
                        title="Add to Basket"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleBuyNow(product, 1)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 whitespace-nowrap"
                        title="Instant Order & Pay"
                      >
                        <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" /> Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal with Branch Availability Checker */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-56 object-cover rounded-2xl border border-slate-200"
                />
                <div className="flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm mb-1">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>{selectedProduct.rating}</span>
                      <span className="text-slate-400 font-normal">({selectedProduct.reviewsCount} customer reviews)</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">KSh {selectedProduct.price}</p>
                    <p className="text-xs text-slate-500 font-medium">Packaging: {selectedProduct.unit}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{selectedProduct.description}</p>

                  {/* Quantity and Actions */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                          className="p-1 rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{modalQuantity}</span>
                        <button
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                          className="p-1 rounded-lg bg-white text-slate-700 shadow-2xs hover:bg-slate-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleAddToCart(selectedProduct, modalQuantity)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="h-4 w-4" /> Add to Basket
                      </button>

                      <button
                        onClick={() => handleBuyNow(selectedProduct, modalQuantity)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="h-4 w-4 text-amber-300 fill-amber-300" /> Order &amp; Pay Now (KSh {(selectedProduct.price * modalQuantity).toLocaleString()})
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-branch inventory availability */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Multi-Branch Live Stock Availability
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.entries(selectedProduct.branchStock || {}).map(([branch, count]) => {
                    const isAvail = count > 0;
                    return (
                      <div
                        key={branch}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between',
                          isAvail
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/60 border-rose-200 text-rose-950'
                        )}
                      >
                        <div>
                          <p className="truncate text-[11px]">{branch}</p>
                          <span className="text-[10px] font-normal opacity-80">{isAvail ? `${count} in stock` : 'Out of stock'}</span>
                        </div>
                        {isAvail ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-600" /> Write a Product Review
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="text-amber-400 hover:scale-110 transition"
                      >
                        <Star
                          className={`h-4 w-4 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience with this grocery item..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
