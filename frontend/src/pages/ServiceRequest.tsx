
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ServiceRequest = () => {
  const { serviceType } = useParams();
  const { toast } = useToast();
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    serviceType: serviceType || '',
    urgency: '',
    description: '',
    preferredDate: ''
  });

  const serviceOptions = {
    'waste-management': {
      title: 'Waste-Scrap Management',
      description: 'Professional waste collection and recycling services',
      icon: '♻️'
    },
    'conservation': {
      title: 'Conservation Guidance',
      description: 'Expert environmental conservation consultation',
      icon: '📚'
    },
    'events': {
      title: 'Eco-Events Registration',
      description: 'Join environmental awareness and community events',
      icon: '📅'
    }
  };

  const currentService = serviceOptions[serviceType as keyof typeof serviceOptions] || {
    title: 'Service Request',
    description: 'Submit your service request',
    icon: '🌱'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.address || !formData.serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Generate request ID
    const newRequestId = `SR${Date.now().toString().slice(-6)}`;
    setRequestId(newRequestId);
    setRequestSubmitted(true);

    toast({
      title: "Request Submitted Successfully!",
      description: `Your request ID is: ${newRequestId}`,
    });
  };

  if (requestSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-earth-brown mb-4">Request Submitted Successfully!</h1>
                <div className="bg-earth-beige p-4 rounded-lg mb-6">
                  <p className="text-lg font-semibold text-earth-brown">Your Request ID:</p>
                  <p className="text-2xl font-bold text-earth-green">{requestId}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  Please save this Request ID for future reference. Our team will contact you within 24 hours 
                  to discuss your {currentService.title.toLowerCase()} requirements.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-earth-green hover:bg-earth-green/90">
                    <a href="/">Return to Home</a>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-earth-green text-earth-green hover:bg-earth-green hover:text-white">
                    <a href="/services">View Other Services</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{currentService.icon}</div>
              <CardTitle className="text-earth-brown text-2xl">{currentService.title}</CardTitle>
              <p className="text-gray-600">{currentService.description}</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Service Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Please describe your requirements in detail..."
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-earth-green hover:bg-earth-green/90"
                  size="lg"
                >
                  Submit Service Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceRequest;
