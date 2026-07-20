import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Users, Plus, Search, Edit, Trash2, Shield, UserCheck } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  permissions: string[];
}

export const UsersPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');

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
      setUsers(Array.isArray(response.data?.data) ? response.data.data : []);
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
      setRoles(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-800',
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Cashier': 'bg-green-100 text-green-800',
      'Inventory Manager': 'bg-orange-100 text-orange-800',
      'Accountant': 'bg-yellow-100 text-yellow-800',
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
            Manage system users and role permissions
          </p>
        </div>
        <Button onClick={() => toast.info('Add user feature coming soon')}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('users')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'users'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Users
        </button>
        <button
          onClick={() => setSelectedTab('roles')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'roles'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Roles
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
                placeholder="Search users..."
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
                <p className="text-muted-foreground">Loading users...</p>
              </CardContent>
            </Card>
          ) : filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search' : 'No users have been created yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {user.isActive ? (
                        <UserCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <span className="text-xs text-red-500">Inactive</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Badge className={getRoleColor(user.role?.name || 'Unknown')}>
                          {user.role?.name || 'No Role'}
                        </Badge>
                      </div>
                      {user.branch && (
                        <p className="text-sm text-muted-foreground">
                          Branch: {user.branch.name}
                        </p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toast.info('Edit user feature coming soon')}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Delete user feature coming soon')}
                        >
                          <Trash2 className="h-3 w-3" />
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
          <div className="flex justify-end">
            <Button onClick={() => toast.info('Add role feature coming soon')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          {roles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No roles found</h3>
                <p className="text-muted-foreground">No roles have been created yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {role.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {role.description || 'No description'}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Permissions: {role.permissions?.length || 0}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toast.info('Edit role feature coming soon')}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Delete role feature coming soon')}
                        >
                          <Trash2 className="h-3 w-3" />
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
    </div>
  );
};
