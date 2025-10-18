import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getServiceRequests } from '../../services/adminService';
import CertificateGenerator from '@/components/CertificateGenerator';
import { Award, Search, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

const AdminCertificateGenerator = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [isBirthdayWish, setIsBirthdayWish] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = serviceRequests.filter(request =>
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerMobile.includes(searchTerm)
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(serviceRequests);
    }
  }, [searchTerm, serviceRequests]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await getServiceRequests({
        page: 1,
        limit: 100, // Get more requests for searching
        status: 'FULFILLED' // Only fulfilled requests can get certificates
      });
      
      if (response.serviceRequests && Array.isArray(response.serviceRequests)) {
        setServiceRequests(response.serviceRequests);
        setFilteredRequests(response.serviceRequests);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSelect = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setCustomMessage(''); // Reset custom message when selecting new request
    setIsBirthdayWish(false);
  };

  const getTotalPlants = (request: ServiceRequest) => {
    if (!request.items) return 0;
    return request.items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Certificate Generator</h1>
          <p className="text-gray-600 mt-1">Generate appreciation certificates for customers</p>
        </div>
        <Award className="h-8 w-8 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Customer
            </CardTitle>
            <CardDescription>
              Choose a customer with fulfilled service request to generate certificate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, request ID, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Customer List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading customers...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No fulfilled requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest?.id === request.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRequestSelect(request)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.customerName}</h4>
                        <p className="text-sm text-gray-500">#{request.requestId}</p>
                        <p className="text-sm text-gray-600">{request.customerMobile}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {getTotalPlants(request)} plants • {formatDate(request.updatedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {request.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Options */}
        <Card>
          <CardHeader>
            <CardTitle>Certificate Options</CardTitle>
            <CardDescription>
              Customize the certificate message and type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRequest ? (
              <>
                {/* Selected Customer Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">Selected Customer</h4>
                  <p className="text-green-700">{selectedRequest.customerName}</p>
                  <p className="text-sm text-green-600">
                    Request #{selectedRequest.requestId} • {getTotalPlants(selectedRequest)} plants
                  </p>
                </div>

                {/* Certificate Type */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="birthday"
                    checked={isBirthdayWish}
                    onCheckedChange={(checked) => setIsBirthdayWish(checked === true)}
                  />
                  <Label htmlFor="birthday" className="text-sm font-medium">
                    Generate as Birthday Wish Certificate 🎂
                  </Label>
                </div>

                {/* Custom Message */}
                <div>
                  <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                  <Textarea
                    id="customMessage"
                    placeholder="Enter a custom congratulatory message in Hindi or English..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use automatic message based on service type and occasion
                  </p>
                </div>

                {/* Preview and Generate */}
                <div className="pt-4 border-t">
                  <CertificateGenerator
                    serviceRequest={selectedRequest}
                    isBirthdayWish={isBirthdayWish}
                    customMessage={customMessage || undefined}
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Award className="h-4 w-4 mr-2" />
                      Preview & Generate Certificate
                    </Button>
                  </CertificateGenerator>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Customer Selected</h3>
                <p className="text-gray-600">Please select a customer from the list to generate a certificate.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{serviceRequests.length}</div>
              <div className="text-sm text-green-600">Eligible Customers</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">
                {serviceRequests.reduce((total, request) => total + getTotalPlants(request), 0)}
              </div>
              <div className="text-sm text-blue-600">Total Plants Contributed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">
                {new Set(serviceRequests.map(r => r.type)).size}
              </div>
              <div className="text-sm text-purple-600">Service Types</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCertificateGenerator;
