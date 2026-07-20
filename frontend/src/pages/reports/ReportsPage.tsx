import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { FileText, Download, Calendar, TrendingUp, Package, DollarSign, Users, Eye, Loader2 } from 'lucide-react';
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

  // Fetch saved reports
  useEffect(() => {
    if (token) {
      fetchSavedReports();
      fetchTemplates();
    }
  }, [token]);

  const fetchSavedReports = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/saved`, {
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/templates`, {
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

  const generateReport = async (type: string, name: string) => {
    setGeneratingReport(type);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reports/generate`,
        {
          type,
          period: 'month',
          format: 'pdf'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`${name} generated successfully!`);
      
      // If URL is returned, download the report
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }

      // Refresh saved reports
      fetchSavedReports();
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Report generation not yet implemented on backend');
      } else {
        toast.error(`Failed to generate ${name}`);
      }
      console.error('Error generating report:', error);
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
      icon: DollarSign,
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
          Generate and view business reports and insights
        </p>
      </div>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isGenerating = generatingReport === report.type;
          
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
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => generateReport(report.type, report.title)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
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
