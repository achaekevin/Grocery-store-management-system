import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Package, Plus, Search, AlertTriangle, TrendingDown, FileDown } from 'lucide-react';
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
    name: string;
  };
  quantity: number;
  reorderLevel: number;
  lastRestocked?: string;
}

export const InventoryPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterLowStock, setFilterLowStock] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInventory();
    }
  }, [token]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
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
          <Button onClick={() => toast.info('Add stock feature coming soon')}>
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
          variant={filterLowStock ? 'default' : 'outline'}
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
