import React, { useState } from 'react';
import { Search, Scan, Plus, Minus, Trash2, User, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartTotal,
  selectCartSubtotal,
  selectCartTax,
} from '@store/slices/cartSlice';
import { PRODUCTS, CATEGORIES } from '@services/mockData';
import { Product } from '@types/index';
import { formatCurrency } from '@utils/format';
import { cn } from '@utils/cn';

export const POSPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const subtotal = useAppSelector(selectCartSubtotal);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    return matchesCategory && matchesSearch && product.qty > 0;
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ id: productId, quantity }));
    }
  };

  const handleCheckout = () => {
    // Handle checkout logic
    alert('Checkout functionality - coming soon!');
  };

  return (
    <div className="grid h-full lg:grid-cols-[1fr_400px]">
      {/* Left Panel - Products */}
      <div className="flex flex-col border-r bg-secondary/30">
        {/* Search & Filters */}
        <div className="border-b bg-card p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              icon={<Scan className="h-4 w-4" />}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('')}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-accent'
              )}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const inCart = items.find((item) => item.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className={cn(
                    'rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-md',
                    inCart && 'border-primary ring-2 ring-primary/20'
                  )}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="text-3xl">{product.image}</div>
                    {product.qty <= product.reorder && (
                      <Badge variant="warning" className="text-[10px]">
                        Low
                      </Badge>
                    )}
                  </div>
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">{product.qty} left</span>
                  </div>
                  {inCart && (
                    <div className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary/10 py-1">
                      <span className="text-xs font-semibold text-primary">
                        {inCart.cartQty} in cart
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="flex flex-col bg-card">
        {/* Cart Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Current Sale</h2>
            <Button variant="ghost" size="sm" icon={<User className="h-4 w-4" />}>
              Customer
            </Button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Scan or select products to start a sale
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4 text-red-600" />}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleUpdateQuantity(item.id, item.cartQty - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.cartQty}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleUpdateQuantity(item.id, item.cartQty + 1)}
                        disabled={item.cartQty >= item.qty}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold">{formatCurrency(item.subtotal)}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <>
            <div className="border-t p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (16%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="border-t p-4 space-y-2">
              <Button className="w-full" onClick={handleCheckout}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with Card
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleCheckout}>
                  Cash
                </Button>
                <Button variant="outline" onClick={handleCheckout}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  M-Pesa
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" size="sm">
                  Hold Sale
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearCart())}
                  className="text-red-600"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
