import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Select } from '@components/ui/Select';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/Table';
import { formatCurrency, formatDate } from '@utils/format';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@components/ui/Modal';
import { useDebounce } from '@hooks/useDebounce';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand?: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  taxable: boolean;
  expiryDate?: string;
  image?: string;
}

interface NewProduct {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  taxable: boolean;
  expiryDate: string;
}

export const ProductsPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Form state for new product
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    unit: 'pcs',
    quantity: 0,
    reorderLevel: 10,
    costPrice: 0,
    sellingPrice: 0,
    taxable: true,
    expiryDate: '',
  });

  // Fetch products from API
  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    // Validation
    if (!newProduct.name || !newProduct.sku || !newProduct.barcode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        {
          ...newProduct,
          cost_price: newProduct.costPrice,
          selling_price: newProduct.sellingPrice,
          reorder_level: newProduct.reorderLevel,
          expiry_date: newProduct.expiryDate || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Product added successfully!');
      setShowAddModal(false);
      
      // Reset form
      setNewProduct({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        brand: '',
        unit: 'pcs',
        quantity: 0,
        reorderLevel: 10,
        costPrice: 0,
        sellingPrice: 0,
        taxable: true,
        expiryDate: '',
      });

      // Refresh products list
      fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  // Export products to Excel
  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/products/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create download link
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Products exported successfully!');
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    } finally {
      setExporting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.sku?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.barcode?.includes(debouncedSearch);

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return { label: 'Out of Stock', variant: 'danger' as const };
    if (product.quantity <= product.reorderLevel) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your product inventory and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            icon={exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            onClick={handleExport}
            disabled={exporting || products.length === 0}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedCategory ? 'No products found matching your filters' : 'No products yet. Click "Add Product" to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-input"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) =>
                              handleSelectProduct(product.id, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-2xl">
                              📦
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {product.unit}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{product.quantity}</span>
                          <span className="text-xs text-muted-foreground">
                            {' '}
                            / {product.reorderLevel}
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(product.costPrice)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(product.sellingPrice)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Eye className="h-4 w-4" />}
                              onClick={() => setViewProduct(product)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Trash2 className="h-4 w-4 text-red-600" />}
                              onClick={() => handleDeleteProduct(product.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <ModalBody>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g., Fresh Milk 1L"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SKU *</label>
              <Input
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                placeholder="e.g., MILK-001"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Barcode *</label>
              <Input
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                placeholder="e.g., 1234567890123"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="e.g., Dairy"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                placeholder="e.g., Fresh Foods"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit</label>
              <select
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilogram</option>
                <option value="g">Gram</option>
                <option value="l">Liter</option>
                <option value="ml">Milliliter</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cost Price</label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.costPrice}
                onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Selling Price</label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.sellingPrice}
                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reorder Level</label>
              <Input
                type="number"
                value={newProduct.reorderLevel}
                onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry Date</label>
              <Input
                type="date"
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newProduct.taxable}
                onChange={(e) => setNewProduct({ ...newProduct, taxable: e.target.checked })}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium">Taxable</label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddProduct} 
            disabled={saving}
            icon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          >
            {saving ? 'Adding...' : 'Add Product'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Product Modal */}
      {viewProduct && (
        <Modal
          isOpen={!!viewProduct}
          onClose={() => setViewProduct(null)}
          title="Product Details"
          size="lg"
        >
          <ModalBody>
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted text-6xl">
                  📦
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{viewProduct.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{viewProduct.category}</Badge>
                    <Badge variant="secondary">{viewProduct.brand}</Badge>
                    <Badge variant={getStockStatus(viewProduct).variant}>
                      {getStockStatus(viewProduct).label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="mt-1 font-mono">{viewProduct.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Barcode</label>
                  <p className="mt-1 font-mono">{viewProduct.barcode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost Price</label>
                  <p className="mt-1 text-lg font-semibold">
                    {formatCurrency(viewProduct.costPrice)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Selling Price
                  </label>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {formatCurrency(viewProduct.sellingPrice)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Stock
                  </label>
                  <p className="mt-1 text-lg font-semibold">{viewProduct.quantity} {viewProduct.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reorder Level
                  </label>
                  <p className="mt-1">{viewProduct.reorderLevel} {viewProduct.unit}</p>
                </div>
                {viewProduct.expiryDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Expiry Date
                    </label>
                    <p className="mt-1">{formatDate(viewProduct.expiryDate)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Taxable</label>
                  <p className="mt-1">{viewProduct.taxable ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setViewProduct(null)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};
