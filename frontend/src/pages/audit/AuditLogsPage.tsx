import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { FileText, Search, Filter, Download, Activity } from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export const AuditLogsPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    if (token) {
      fetchAuditLogs();
    }
  }, [token]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/audit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'VIEW': 'bg-yellow-100 text-yellow-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${log.user?.firstName} ${log.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === 'all' || log.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  const actionTypes = ['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="mt-1 text-muted-foreground">
            Track all system activities and user actions
          </p>
        </div>
        <Button variant="outline" onClick={() => toast.info('Export feature coming soon')}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">All activities</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => 
                new Date(log.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Activities today</p>
          </CardContent>
        </Card>

        <div onClick={() => setFilterAction('CREATE')} className="cursor-pointer">
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Creates</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => log.action === 'CREATE').length}
              </div>
              <p className="text-xs text-muted-foreground">New records</p>
            </CardContent>
          </Card>
        </div>

        <div onClick={() => setFilterAction('DELETE')} className="cursor-pointer">
          <Card className="transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deletes</CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => log.action === 'DELETE').length}
              </div>
              <p className="text-xs text-muted-foreground">Deleted records</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by action, entity, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {actionTypes.map(action => (
            <option key={action} value={action}>
              {action === 'all' ? 'All Actions' : action}
            </option>
          ))}
        </select>
      </div>

      {/* Logs List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading audit logs...</p>
          </CardContent>
        </Card>
      ) : filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No audit logs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterAction !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No activities have been logged yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-sm font-medium">{log.entityType}</span>
                        <span className="text-sm text-muted-foreground">#{log.entityId?.slice(0, 8)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">
                          {log.user?.firstName} {log.user?.lastName}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{log.user?.email}</span>
                        {log.ipAddress && (
                          <>
                            <span className="mx-2">•</span>
                            <span>IP: {log.ipAddress}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                  {log.changes && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded">
                      <pre className="overflow-x-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
