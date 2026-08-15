import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Plus, Building2, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface Branch {
  id: string;
  name: string;
  code: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  isActive: boolean;
}

export const BranchesPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { success, error: toastError } = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (token) {
      fetchBranches();
    }
  }, [token]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/branches`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      
      if (response.data?.success && response.data?.data) {
        setBranches(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setBranches([]);
      }
    } catch (err: any) {
      console.error('Error fetching branches:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load branches';
      toastError(errorMessage);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingBranch) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/v1/branches/${editingBranch.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = response.data?.data || { ...editingBranch, ...formData };
        setBranches((prev) => prev.map((b) => (b.id === editingBranch.id ? updated : b)));
        success('Branch updated successfully');
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/branches`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newBranch = response.data?.data || { id: Date.now().toString(), ...formData, isActive: true };
        setBranches((prev) => [newBranch, ...prev]);
        success('Branch created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchBranches();
    } catch (err: any) {
      console.error('Error saving branch:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.message ||
                          err.response?.data?.errors?.[0] || 
                          err.message ||
                          'Failed to save branch';
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      phone: branch.phone || '',
      email: branch.email || '',
      address: branch.address || '',
      city: branch.city || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/v1/branches/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBranches((prev) => prev.filter((b) => b.id !== id));
      success('Branch deleted successfully');
    } catch (err: any) {
      console.error('Error deleting branch:', err);
      toastError(err.response?.data?.message || 'Failed to delete branch');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    });
    setEditingBranch(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your business locations
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex justify-center items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Loading branches...</span>
            </div>
          </CardContent>
        </Card>
      ) : branches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No branches yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first branch to start using the POS system
            </p>
            <Button onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Branch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <Card key={branch.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {branch.name}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(branch)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(branch.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Code:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{branch.code}</code></div>
                  {branch.phone && <div><span className="font-medium">Phone:</span> {branch.phone}</div>}
                  {branch.email && <div><span className="font-medium">Email:</span> {branch.email}</div>}
                  {branch.city && <div><span className="font-medium">City:</span> {branch.city}</div>}
                  {branch.address && <div className="text-muted-foreground">{branch.address}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingBranch ? 'Edit Branch' : 'Add Branch'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Main Branch"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                    Branch Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="MAIN-01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254700000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="branch@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                    rows={3}
                    className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingBranch ? 'Update' : 'Create'} Branch</>
                    )}
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
