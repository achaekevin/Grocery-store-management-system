import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Package, Plus, Search, AlertTriangle, TrendingDown, FileDown, X, Edit } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    category?: {
      name: string;
    };
  };
  branch?: {
    id: string;
    name: string;
  };
  branchId?: string;
  productId?: string;
  quantity: number;
  reorderLevel: number;
  lastRestocked?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
}

interface Branch {
  id: string;
  name: string;
  code?: string;
}

interface StockFormData {
  productId: string;
  branchId: string;
  quantity: string;
  unitCost: string;
  reorderLevel: string;
  batchNumber: string;
  expiryDate: string;
  notes: string;
}

export const InventoryPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<StockFormData>({
    productId: '',
    branchId: '',
    quantity: '',
    unitCost: '',
    reorderLevel: '10',
    batchNumber: '',
    expiryDate: '',
    notes: ''
  });
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInventory();
      fetchProducts();
      fetchBranches();
    }
  }, [token]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/inventory/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Group inventory transactions by product and branch to get current stock levels
      const inventoryMap = new Map<string, InventoryItem>();
      const transactions = Array.isArray(response.data?.data) ? response.data.data : [];
      
      // Get unique inventory items from transactions
      for (const transaction of transactions) {
        const key = `${transaction.productId}-${transaction.branchId}`;
        if (!inventoryMap.has(key)) {
          inventoryMap.set(key, {
            id: key,
            product: transaction.product || { id: transaction.productId, name: 'Unknown', sku: 'N/A' },
            productId: transaction.productId,
            branchId: transaction.branchId,
            branch: transaction.branch,
            quantity: transaction.quantityAfter || 0,
            reorderLevel: 10,
            lastRestocked: transaction.createdAt
          });
        }
      }
      
      setInventory(Array.from(inventoryMap.values()));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 }
      });
      setProducts(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 }
      });
      setBranches(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.branchId || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/stock-in`,
        {
          productId: parseInt(formData.productId),
          branchId: parseInt(formData.branchId),
          quantity: parseFloat(formData.quantity),
          unitCost: formData.unitCost ? parseFloat(formData.unitCost) : 0,
          batchNumber: formData.batchNumber || undefined,
          expiryDate: formData.expiryDate || undefined,
          notes: formData.notes || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Stock added successfully');
      setShowAddModal(false);
      resetForm();
      fetchInventory();
    } catch (error: any) {
      console.error('Error adding stock:', error);
      toast.error(error.response?.data?.message || 'Failed to add stock');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItem || !adjustQuantity) {
      toast.error('Please enter adjustment quantity');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/adjust`,
        {
          productId: parseInt(selectedItem.productId!),
          branchId: parseInt(selectedItem.branchId!),
          newQuantity: parseFloat(adjustQuantity),
          reason: adjustReason || 'Manual adjustment',
          notes: adjustReason
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Stock adjusted successfully');
      setShowAdjustModal(false);
      setSelectedItem(null);
      setAdjustQuantity('');
      setAdjustReason('');
      fetchInventory();
    } catch (error: any) {
      console.error('Error adjusting stock:', error);
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      branchId: '',
      quantity: '',
      unitCost: '',
      reorderLevel: '10',
      batchNumber: '',
      expiryDate: '',
      notes: ''
    });
  };

  const openAdjustModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustQuantity(item.quantity.toString());
    setShowAdjustModal(true);
  };

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity <= reorderLevel) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterLowStock || item.quantity <= item.reorderLevel;
    
    return matchesSearch && matchesFilter;
  });

  const lowStockCount = inventory.filter(item => item.quantity <= item.reorderLevel).length;
  const outOfStockCount = inventory.filter(item => item.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage stock levels across all branches
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Export feature coming soon')}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div onClick={() => navigate('/products')} className="cursor-pointer">
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">Unique products</p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => setFilterLowStock(true)} className="cursor-pointer">
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => setFilterLowStock(true)} className="cursor-pointer">
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Urgent attention required</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={filterLowStock ? 'primary' : 'outline'}
          onClick={() => setFilterLowStock(!filterLowStock)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Low Stock Only
        </Button>
      </div>

      {/* Inventory List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading inventory...</p>
          </CardContent>
        </Card>
      ) : filteredInventory.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No inventory items found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterLowStock 
                ? 'Try adjusting your filters' 
                : 'No inventory items have been added yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Branch</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Reorder Level</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity, item.reorderLevel);
                    return (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{item.product?.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.product?.sku}</td>
                        <td className="px-4 py-3 text-sm">{item.product?.category?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{item.branch?.name || 'All Branches'}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">{item.reorderLevel}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={status.color}>{status.text}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAdjustModal(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Stock</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleAddStock} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} {branch.code ? `(${branch.code})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit Cost
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unitCost}
                      onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                      placeholder="Enter unit cost"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Batch Number
                    </label>
                    <Input
                      type="text"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      placeholder="Enter batch number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Stock'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Adjust Stock</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedItem(null);
                    setAdjustQuantity('');
                    setAdjustReason('');
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold">{selectedItem.product?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Current Quantity</p>
                <p className="font-semibold">{selectedItem.quantity}</p>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(e.target.value)}
                    placeholder="Enter new quantity"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason
                  </label>
                  <textarea
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Reason for adjustment (optional)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAdjustModal(false);
                      setSelectedItem(null);
                      setAdjustQuantity('');
                      setAdjustReason('');
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adjusting...' : 'Adjust Stock'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
