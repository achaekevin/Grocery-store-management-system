import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Loader2, X } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: string;
}

export const CustomersPage: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const items = Array.isArray(response.data?.data) ? response.data.data : (response.data?.data?.customers || []);
      const mapped = items.map((c: any) => {
        const parts = (c.name || '').split(' ');
        return {
          ...c,
          firstName: c.firstName || parts[0] || 'Customer',
          lastName: c.lastName || parts.slice(1).join(' ') || '',
        };
      });
      setCustomers(mapped);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Please fill in required fields (First name, Last name, Phone)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/customers`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Customer added successfully! Redirecting to dashboard...');
      setShowAddModal(false);
      resetForm();
      const dest = user?.role?.name === 'Customer' || user?.role === 'Customer' ? '/customer/dashboard' : '/dashboard';
      setTimeout(() => {
        navigate(dest);
      }, 1000);
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast.error(error.response?.data?.message || 'Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/customers/${editingCustomer.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Customer updated successfully!');
      setEditingCustomer(null);
      resetForm();
      fetchCustomers();
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast.error(error.response?.data?.message || 'Failed to update customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/customers/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Customer deleted successfully!');
      fetchCustomers();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      country: customer.country || '',
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCustomer(null);
    resetForm();
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="mt-1 text-muted-foreground">Manage your customer database</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No customers found</p>
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                Add Your First Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {customer.firstName} {customer.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Loyalty Points: {customer.loyaltyPoints || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(customer)}
                      className="rounded p-1 hover:bg-accent"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="rounded p-1 hover:bg-accent"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">
                      {customer.address}
                      {customer.city && `, ${customer.city}`}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Total Spent: KSh {customer.totalSpent?.toLocaleString() || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={closeModal} className="rounded p-1 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="mt-1"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Nairobi"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Kenya"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeModal} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
                  disabled={submitting}
                  icon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {submitting ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Add Customer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
