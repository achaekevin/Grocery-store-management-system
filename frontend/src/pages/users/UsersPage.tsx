import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Users, Plus, Search, Edit, Trash2, Shield, UserCheck, X, Loader2, Mail, Phone, Lock } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: any[];
}

export const UsersPage: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    status: 'active',
  });

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRoles();
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = Array.isArray(response.data?.data) ? response.data.data : (response.data?.data?.users || []);
      setUsers(items);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const roleItems = Array.isArray(response.data?.data) ? response.data.data : [];
      setRoles(roleItems);
      if (roleItems.length > 0 && !formData.roleId) {
        setFormData(prev => ({ ...prev, roleId: roleItems[0].id }));
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      roleId: roles.length > 0 ? roles[0].id : '',
      status: 'active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      roleId: user.role?.id || (roles.length > 0 ? roles[0].id : ''),
      status: user.isActive ? 'active' : 'inactive',
    });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          roleId: formData.roleId || (roles.find(r => r.name === 'Cashier')?.id || roles[0]?.id),
          status: formData.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('User added successfully! Redirecting to dashboard...');
      setShowAddModal(false);
      resetForm();
      const dest = user?.role?.name === 'Customer' || user?.role === 'Customer' ? '/customer/dashboard' : '/dashboard';
      setTimeout(() => {
        navigate(dest);
      }, 1000);
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        roleId: formData.roleId,
        status: formData.status,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${editingUser.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('User updated successfully!');
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove user ${name}?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-800',
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Cashier': 'bg-green-100 text-green-800',
      'Inventory Clerk': 'bg-orange-100 text-orange-800',
      'Accountant': 'bg-yellow-100 text-yellow-800',
      'Customer': 'bg-teal-100 text-teal-800',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users & Roles</h1>
          <p className="mt-1 text-muted-foreground">
            Manage system users, branch assignments, and role permissions
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('users')}
          className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
            selectedTab === 'users'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Users ({users.length})
        </button>
        <button
          onClick={() => setSelectedTab('roles')}
          className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
            selectedTab === 'roles'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Roles ({roles.length})
        </button>
      </div>

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-muted-foreground">Loading users...</p>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search' : 'No users created yet'}
                </p>
                <Button onClick={handleOpenAddModal} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add First User
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {user.isActive ? (
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <UserCheck className="h-3.5 w-3.5 mr-1" /> Active
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Badge className={getRoleColor(user.role?.name || 'Unknown')}>
                          {user.role?.name || 'Staff User'}
                        </Badge>
                      </div>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" /> {user.phone}
                        </p>
                      )}
                      {user.branch && (
                        <p className="text-xs text-muted-foreground">
                          Branch: <span className="font-semibold">{user.branch.name}</span>
                        </p>
                      )}
                      <div className="flex gap-2 mt-4 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 cursor-pointer"
                          onClick={() => handleOpenEditModal(user)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 cursor-pointer"
                          onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Roles Tab */}
      {selectedTab === 'roles' && (
        <div className="space-y-4">
          {roles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No roles found</h3>
                <p className="text-muted-foreground">Roles will appear once loaded from server</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {role.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {role.description || `System permissions for ${role.name}`}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Permissions Granted: {role.permissions?.length || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit User Modal */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Users className="h-5 w-5 text-primary" />
                  {editingUser ? 'Edit System User' : 'Add New System User'}
                </CardTitle>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                  }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>

            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">First Name *</label>
                    <Input
                      placeholder="e.g. Dennis"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Last Name *</label>
                    <Input
                      placeholder="e.g. Mutua"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="user@groceryos.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!!editingUser}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                    <Input
                      placeholder="0712345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password (min 8 chars) *'}
                  </label>
                  <Input
                    type="password"
                    placeholder={editingUser ? '••••••••' : 'Enter strong password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">System Role *</label>
                    <select
                      value={formData.roleId}
                      onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingUser(null);
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="cursor-pointer">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingUser ? 'Saving...' : 'Adding...'}
                      </>
                    ) : (
                      editingUser ? 'Save Changes' : 'Add User'
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
