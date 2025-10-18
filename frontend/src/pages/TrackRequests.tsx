import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { serviceRequestService, ServiceRequest } from '@/services/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useSearchParams } from 'react-router-dom';

const TrackRequests = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [requestId, setRequestId] = useState(searchParams.get('requestId') || '');
  const [isSearching, setIsSearching] = useState(!!searchParams.get('requestId'));
  const isNewRequest = searchParams.get('new') === 'true';

  const { data: serviceRequest, isLoading, error, refetch } = useQuery({
    queryKey: ['serviceRequest', requestId],
    queryFn: () => serviceRequestService.getServiceRequest(requestId),
    enabled: isSearching && requestId.length > 0,
    retry: false
  });

  useEffect(() => {
    const urlRequestId = searchParams.get('requestId');
    if (urlRequestId) {
      setRequestId(urlRequestId);
      setIsSearching(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    refetch();
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'IN_PROCESS': return 'bg-blue-500';
      case 'VERIFICATION': return 'bg-purple-500';
      case 'FULFILLED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-earth-brown mb-8 text-center">Track Your Request</h1>
          
          {isNewRequest && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Thank You for Your Request!</h2>
                <p className="text-green-700">
                  We have received your request and will get back to you within 2-3 working days. 
                  You can track your request status using the request ID below.
                </p>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter your Request ID"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-earth-green hover:bg-earth-green/90">
                Track
              </Button>
            </div>
          </form>

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Request not found. Please check your Request ID.</p>
            </div>
          )}

          {serviceRequest && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">Request #{serviceRequest.requestId}</CardTitle>
                    <Badge className={getStatusColor(serviceRequest.status)}>
                      {serviceRequest.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Created on</p>
                    <p className="font-medium">{new Date(serviceRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{serviceRequest.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mobile</p>
                        <p className="font-medium">{serviceRequest.customerMobile}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{serviceRequest.customerEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{serviceRequest.customerAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pincode</p>
                        <p className="font-medium">{serviceRequest.customerPincode}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Request Items</h3>
                    <div className="space-y-4">
                      {serviceRequest.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="font-semibold">Total Amount</p>
                        <p className="font-semibold">₹{serviceRequest.total}</p>
                      </div>
                    </div>
                  </div>

                  {serviceRequest.customerNotes && (
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-gray-600">{serviceRequest.customerNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackRequests; 