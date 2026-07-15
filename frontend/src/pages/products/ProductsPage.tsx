import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit, Eye } from 'lucide-react';
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
import { PRODUCTS, CATEGORIES, BRANDS } from '@services/mockData';
import { Product } from '@types/index';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@components/ui/Modal';
import { useDebounce } from '@hooks/useDebounce';

export const ProductsPage: React.FC = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.barcode.includes(debouncedSearch);

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, debouncedSearch, selectedCategory, selectedBrand]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.qty === 0) return { label: 'Out of Stock', variant: 'danger' as const };
    if (product.qty <= product.reorder) return { label: 'Low Stock', variant: 'warning' as const };
    return { label: 'In Stock', variant: 'success' as const };
  };

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
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
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
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="flex items-center justify-between p-4">
          <span className="text-sm font-medium">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Edit className="h-4 w-4" />}>
              Bulk Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <Card>
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
                <TableHead>Brand</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    No products found
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
                            {product.image}
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
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{product.qty}</span>
                        <span className="text-xs text-muted-foreground">
                          {' '}
                          / {product.reorder}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(product.cost)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(product.expiry)}
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
                            icon={<Edit className="h-4 w-4" />}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="h-4 w-4 text-red-600" />}
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
      </Card>

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
                  {viewProduct.image}
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
                    {formatCurrency(viewProduct.cost)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Selling Price
                  </label>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {formatCurrency(viewProduct.price)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Stock
                  </label>
                  <p className="mt-1 text-lg font-semibold">{viewProduct.qty} {viewProduct.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reorder Level
                  </label>
                  <p className="mt-1">{viewProduct.reorder} {viewProduct.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Expiry Date
                  </label>
                  <p className="mt-1">{formatDate(viewProduct.expiry)}</p>
                </div>
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
            <Button icon={<Edit className="h-4 w-4" />}>Edit Product</Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};
