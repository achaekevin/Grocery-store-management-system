import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { addToCustomerCart, removeFromWishlist } from '@store/slices/customerPortalSlice';
import { useToast } from '@hooks/useToast';

export const CustomerWishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success } = useToast();
  const { wishlist } = useAppSelector((state) => state.customerPortal);

  const handleAddToCart = (product: any) => {
    dispatch(addToCustomerCart({ product, quantity: 1 }));
    success(`Added ${product.name} to basket!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Saved Wishlist</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Keep track of your favorite grocery items and easily move them to your basket
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="h-16 w-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Explore the catalog and tap the heart icon on products you want to save for later.
            </p>
          </div>
          <Link
            to="/customer/shop"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition"
          >
            <ShoppingBag className="h-4 w-4" /> Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 rounded-full text-rose-500 hover:bg-rose-50 shadow-xs transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 truncate">{product.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{product.unit} • {product.brand}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">KSh {product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
