import React, { useState, useEffect, useCallback } from "react";
import { getServiceRequests, updateServiceRequestStatus, getAllServiceRequestsForCSV } from "../../services/adminService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useToast } from "../../hooks/use-toast";
import { Search, Eye, Package, User, Calendar, DollarSign, Filter, RefreshCw, Award, Download, TreePine } from "lucide-react";
import CertificateGenerator from "../../components/CertificateGenerator";

interface ServiceRequest {
  id: string;
  requestId: string;
  type: 'TREE_PLANTATION' | 'WASTE_MANAGEMENT' | 'ENVIRONMENTAL_CONSULTING' | 'ECO_TOURISM' | 'OTHER';
  status: 'PENDING' | 'IN_PROCESS' | 'VERIFICATION' | 'FULFILLED' | 'CANCELLED';
  customerName: string;
  customerEmail?: string;
  customerMobile: string;
  customerAddress: string;
  customerPincode: string;
  customerNotes?: string;
  total?: number;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ServiceRequestsResponse {
  serviceRequests: ServiceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROCESS: "bg-blue-100 text-blue-800",
  VERIFICATION: "bg-purple-100 text-purple-800",
  FULFILLED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const typeColors = {
  TREE_PLANTATION: "bg-green-100 text-green-800",
  WASTE_MANAGEMENT: "bg-blue-100 text-blue-800",
  ENVIRONMENTAL_CONSULTING: "bg-purple-100 text-purple-800",
  ECO_TOURISM: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-800",
};

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROCESS", label: "In Process" },
  { value: "VERIFICATION", label: "Verification" },
  { value: "FULFILLED", label: "Fulfilled" },
  { value: "CANCELLED", label: "Cancelled" },
];

const typeOptions = [
  { value: "TREE_PLANTATION", label: "Tree Plantation" },
  { value: "WASTE_MANAGEMENT", label: "Waste Management" },
  { value: "ENVIRONMENTAL_CONSULTING", label: "Environmental Consulting" },
  { value: "ECO_TOURISM", label: "Eco Tourism" },
  { value: "OTHER", label: "Other" },
];

export default function AdminServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
  });
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const { toast } = useToast();

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await getServiceRequests({
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        status: filters.status && filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
      });
      
      console.log('Service requests response:', response);
      
      if (response.serviceRequests && Array.isArray(response.serviceRequests)) {
        setServiceRequests(response.serviceRequests);
        setPagination(response.pagination || {
          page: 1,
          limit: 10,
          total: response.serviceRequests.length,
          pages: Math.ceil(response.serviceRequests.length / 10)
        });
      } else {
        setServiceRequests([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          pages: 0
        }));
      }
    } catch (error: any) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch service requests",
        variant: "destructive",
      });
      setServiceRequests([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServiceRequests();
    }, 500);

    return () => clearTimeout(timer);
  }, [pagination?.page, filters.search, filters.status, filters.type]);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      setUpdating(requestId);
      await updateServiceRequestStatus(requestId, newStatus);
      toast({
        title: "Success",
        description: `Request status updated to ${newStatus}`,
      });
      fetchServiceRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleQuickFulfill = async (requestId: string) => {
    try {
      setUpdating(requestId);
      await updateServiceRequestStatus(requestId, 'FULFILLED');
      toast({
        title: "Success",
        description: "Request marked as fulfilled",
      });
      fetchServiceRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Error fulfilling request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark request as fulfilled",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getTotalItems = (items?: ServiceRequest['items']) => {
    if (!items) return 0;
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const downloadCSV = async () => {
    try {
      setDownloading(true);
      
      // Show loading state
      toast({
        title: "Downloading",
        description: "Generating comprehensive report with service requests and tree analysis...",
      });

      // Fetch all service requests for CSV export
      const response = await getAllServiceRequestsForCSV({
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined,
        type: filters.type !== 'all' ? filters.type : undefined,
      });

      const allServiceRequests = response.serviceRequests;

      if (!allServiceRequests || allServiceRequests.length === 0) {
        toast({
          title: "No Data",
          description: "No service requests found to export",
          variant: "destructive",
        });
        return;
      }

      // Define CSV headers
      const headers = [
        'Request ID',
        'Customer Name',
        'Customer Email',
        'Customer Mobile',
        'Customer Address',
        'Customer Pincode',
        'Request Type',
        'Status',
        'Total Amount',
        'Total Items',
        'Item Details',
        'Customer Notes',
        'Created Date',
        'Updated Date'
      ];

      // Convert service requests to CSV format
      const csvData = allServiceRequests.map(request => {
        const itemDetails = request.items ? 
          request.items.map(item => `${item.name} (Qty: ${item.quantity}, Price: ${item.price})`).join('; ') 
          : '';
        
        return [
          request.requestId,
          request.customerName,
          request.customerEmail || '',
          request.customerMobile,
          request.customerAddress,
          request.customerPincode,
          request.type.replace('_', ' '),
          request.status.replace('_', ' '),
          request.total ? `${request.total}` : '',
          getTotalItems(request.items),
          itemDetails,
          request.customerNotes || '',
          formatDate(request.createdAt),
          formatDate(request.updatedAt)
        ];
      });

      // ===== Tree-wise Analysis =====
      interface TreeData {
        treeName: string;
        totalQuantity: number;
        totalRevenue: number;
        statusBreakdown: { [status: string]: { quantity: number; revenue: number; requests: number } };
      }

      const treeMap = new Map<string, TreeData>();

      allServiceRequests.forEach(request => {
        if (request.items && request.items.length > 0) {
          request.items.forEach(item => {
            const key = item.name;
            
            if (!treeMap.has(key)) {
              treeMap.set(key, {
                treeName: item.name,
                totalQuantity: 0,
                totalRevenue: 0,
                statusBreakdown: {}
              });
            }

            const treeData = treeMap.get(key)!;
            const itemRevenue = item.price * item.quantity;

            // Update totals
            treeData.totalQuantity += item.quantity;
            treeData.totalRevenue += itemRevenue;

            // Update status breakdown
            if (!treeData.statusBreakdown[request.status]) {
              treeData.statusBreakdown[request.status] = { quantity: 0, revenue: 0, requests: 0 };
            }
            
            treeData.statusBreakdown[request.status].quantity += item.quantity;
            treeData.statusBreakdown[request.status].revenue += itemRevenue;
            treeData.statusBreakdown[request.status].requests += 1;
          });
        }
      });

      const treeHeaders = [
        'Tree Name',
        'Total Quantity',
        'Total Revenue',
        'Pending Qty',
        'Pending Revenue',
        'Pending Requests',
        'In Process Qty',
        'In Process Revenue', 
        'In Process Requests',
        'Verification Qty',
        'Verification Revenue',
        'Verification Requests',
        'Fulfilled Qty',
        'Fulfilled Revenue',
        'Fulfilled Requests',
        'Cancelled Qty',
        'Cancelled Revenue',
        'Cancelled Requests'
      ];

      const treeData = Array.from(treeMap.values()).map(tree => [
        tree.treeName,
        tree.totalQuantity,
        `${tree.totalRevenue}`,
        tree.statusBreakdown['PENDING']?.quantity || 0,
        `${tree.statusBreakdown['PENDING']?.revenue || 0}`,
        tree.statusBreakdown['PENDING']?.requests || 0,
        tree.statusBreakdown['IN_PROCESS']?.quantity || 0,
        `${tree.statusBreakdown['IN_PROCESS']?.revenue || 0}`,
        tree.statusBreakdown['IN_PROCESS']?.requests || 0,
        tree.statusBreakdown['VERIFICATION']?.quantity || 0,
        `${tree.statusBreakdown['VERIFICATION']?.revenue || 0}`,
        tree.statusBreakdown['VERIFICATION']?.requests || 0,
        tree.statusBreakdown['FULFILLED']?.quantity || 0,
        `${tree.statusBreakdown['FULFILLED']?.revenue || 0}`,
        tree.statusBreakdown['FULFILLED']?.requests || 0,
        tree.statusBreakdown['CANCELLED']?.quantity || 0,
        `${tree.statusBreakdown['CANCELLED']?.revenue || 0}`,
        tree.statusBreakdown['CANCELLED']?.requests || 0
      ]);

      // Create combined CSV content
      const csvContent = [
        // Service Requests Section
        '=== SERVICE REQUESTS DATA ===',
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ),
        '', // Empty line separator
        '', // Empty line separator
        // Tree Report Section
        '=== TREE-WISE ANALYSIS REPORT ===',
        treeHeaders.join(','),
        ...treeData.map(row => 
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `complete-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Complete report downloaded: ${allServiceRequests.length} requests + tree analysis`,
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Error",
        description: "Failed to download CSV file",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Manage Service Requests</h1>
          <p className="text-gray-600 mt-1">View and manage all customer service requests</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadCSV} 
            disabled={downloading || loading} 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className={`h-4 w-4 mr-2 ${downloading ? 'animate-spin' : ''}`} />
            {downloading ? 'Downloading...' : 'Complete Report'}
          </Button>
          <Button onClick={fetchServiceRequests} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-green-900">{pagination?.total || 0}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {serviceRequests.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">P</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Process</p>
                <p className="text-2xl font-bold text-blue-600">
                  {serviceRequests.filter(r => r.status === 'IN_PROCESS').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">I</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fulfilled</p>
                <p className="text-2xl font-bold text-green-600">
                  {serviceRequests.filter(r => r.status === 'FULFILLED').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">F</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by customer name or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              <span>Showing {serviceRequests.length} of {pagination?.total || 0} requests</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>
            Showing {serviceRequests.length} of {pagination?.total || 0} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading requests...</span>
            </div>
          ) : serviceRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">
                        #{request.requestId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.customerName}</div>
                          <div className="text-sm text-gray-500">{request.customerEmail || request.customerMobile}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[request.type]}>
                          {request.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getTotalItems(request.items)} items
                          {request.items && request.items.length > 0 && (
                            <div className="text-gray-500">
                              {request.items.slice(0, 2).map(item => item.name).join(', ')}
                              {request.items.length > 2 && ` +${request.items.length - 2} more`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {request.total ? formatCurrency(request.total) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[request.status]}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {request.status === 'VERIFICATION' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    disabled={updating === request.id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {updating === request.id ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Fulfill"
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Mark as Fulfilled</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to mark this request as fulfilled? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleQuickFulfill(request.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Fulfill Request
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            {request.status === 'FULFILLED' && (
                              <CertificateGenerator serviceRequest={request}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  <Award className="h-4 w-4" />
                                </Button>
                              </CertificateGenerator>
                            )}
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Request #{selectedRequest.requestId}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium">Customer Information</h4>
                <p className="text-sm text-gray-600">{selectedRequest.customerName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.customerEmail}</p>
                <p className="text-sm text-gray-600">{selectedRequest.customerMobile}</p>
                <p className="text-sm text-gray-600">{selectedRequest.customerAddress}</p>
                <p className="text-sm text-gray-600">Pincode: {selectedRequest.customerPincode}</p>
              </div>

              <div>
                <h4 className="font-medium">Request Information</h4>
                <p className="text-sm text-gray-600">Type: {selectedRequest.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">Total: {selectedRequest.total ? formatCurrency(selectedRequest.total) : 'N/A'}</p>
                <p className="text-sm text-gray-600">Items: {getTotalItems(selectedRequest.items)}</p>
              </div>

              {selectedRequest.items && selectedRequest.items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Request Items</h4>
                  <div className="space-y-2">
                    {selectedRequest.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.customerNotes && (
                <div>
                  <h4 className="font-medium">Customer Notes</h4>
                  <p className="text-sm text-gray-600">{selectedRequest.customerNotes}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Update Status</h4>
                <Select
                  value={selectedRequest.status}
                  onValueChange={(value) => handleStatusUpdate(selectedRequest.id, value)}
                  disabled={updating === selectedRequest.id}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updating === selectedRequest.id && (
                  <p className="text-sm text-gray-500 mt-2">Updating status...</p>
                )}
              </div>

              {/* Certificate Generation */}
              {selectedRequest.status === 'FULFILLED' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Certificate Generation</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate an appreciation certificate for the customer's environmental contribution.
                  </p>
                  <CertificateGenerator serviceRequest={selectedRequest}>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Award className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </Button>
                  </CertificateGenerator>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange((pagination?.page || 1) - 1)}
                    className={(pagination?.page || 1) <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pagination?.pages || 1) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === (pagination?.page || 1)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {(pagination?.pages || 0) > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pagination?.pages || 1)}
                        isActive={(pagination?.page || 1) === (pagination?.pages || 1)}
                        className="cursor-pointer"
                      >
                        {pagination?.pages || 1}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange((pagination?.page || 1) + 1)}
                    className={(pagination?.page || 1) >= (pagination?.pages || 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 