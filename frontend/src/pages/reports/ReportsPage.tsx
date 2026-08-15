import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { FileText, Download, Calendar, TrendingUp, Package, Banknote, Users, Eye, Loader2, FileSpreadsheet } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface SavedReport {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  url: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
}

export const ReportsPage: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  console.log('ReportsPage - Token exists:', !!token);

  // Fetch saved reports
  useEffect(() => {
    if (token) {
      fetchSavedReports();
      fetchTemplates();
    }
  }, [token]);

  const fetchSavedReports = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we always set an array
      setSavedReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      // Always set empty array on error
      setSavedReports([]);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reports/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure we always set an array
      setTemplates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Always set empty array on error
      setTemplates([]);
    }
  };

  const generateReport = async (type: string, name: string, format: 'pdf' | 'excel') => {
    console.log('Generate Report clicked:', { type, name, format, hasToken: !!token });
    
    if (!token) {
      toast.error('Please login to generate reports');
      return;
    }

    setGeneratingReport(`${type}-${format}`);
    
    try {
      console.log('Making API call to:', `${import.meta.env.VITE_API_BASE_URL}/reports/generate`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reports/generate`,
        {
          type,
          period: 'month',
          format
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob' // Get binary data
        }
      );

      console.log('Report generated successfully, downloading...');

      // Create blob and download
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_report_${new Date().getTime()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${name} (${format.toUpperCase()}) downloaded successfully!`);
      
      // Refresh saved reports
      fetchSavedReports();
    } catch (error: any) {
      console.error('Error generating report:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 404) {
        toast.error('Report generation endpoint not found - backend may need restart');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized - please login again');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to generate reports');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to backend server');
      } else {
        toast.error(`Failed to generate ${name}: ${error.message}`);
      }
    } finally {
      setGeneratingReport(null);
    }
  };

  const reportTypes = [
    {
      type: 'sales',
      icon: TrendingUp,
      title: 'Sales Report',
      description: 'View detailed sales performance and trends',
      color: 'text-blue-600'
    },
    {
      type: 'inventory',
      icon: Package,
      title: 'Inventory Report',
      description: 'Track stock levels and movements',
      color: 'text-green-600'
    },
    {
      type: 'financial',
      icon: Banknote,
      title: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      color: 'text-purple-600'
    },
    {
      type: 'customer',
      icon: Users,
      title: 'Customer Report',
      description: 'Customer behavior and purchase patterns',
      color: 'text-orange-600'
    },
    {
      type: 'expense',
      icon: Calendar,
      title: 'Expense Report',
      description: 'Detailed breakdown of business expenses',
      color: 'text-red-600'
    },
    {
      type: 'product',
      icon: FileText,
      title: 'Product Performance',
      description: 'Best and worst performing products',
      color: 'text-indigo-600'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Generate and download business reports in PDF or Excel format
        </p>
      </div>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isPdfGenerating = generatingReport === `${report.type}-pdf`;
          const isExcelGenerating = generatingReport === `${report.type}-excel`;
          
          return (
            <Card key={report.type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${report.color}`} />
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {report.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => generateReport(report.type, report.title, 'pdf')}
                    disabled={isPdfGenerating || isExcelGenerating}
                  >
                    {isPdfGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => generateReport(report.type, report.title, 'excel')}
                    disabled={isPdfGenerating || isExcelGenerating}
                  >
                    {isExcelGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {!Array.isArray(savedReports) || savedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports Generated</h3>
              <p className="text-muted-foreground max-w-md">
                Generate reports to analyze your business performance and make data-driven decisions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(report.url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(report.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
