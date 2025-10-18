
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setFormSubmitted(true);
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form after submission
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', mobile: '', email: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 8618982400',
      subtitle: 'Mon-Sat, 9 AM - 6 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'connect@himsols.com',
      subtitle: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Shimla',
      subtitle: 'Environmental Conservation Hub'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon - Sat: 9 AM - 6 PM',
      subtitle: 'Sunday: Emergency only'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
        {/* Header Section */}
        <div className="bg-earth-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Get in touch with our team for any queries about our eco-sustainability services. 
                We're here to help you make a positive environmental impact.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-earth-brown text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
                </CardHeader>
                
                <CardContent>
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-earth-brown mb-2">Message Sent!</h3>
                      <p className="text-gray-600">Thank you for contacting us. We'll respond within 24 hours.</p>
                    </div>
                  ) : (
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
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Tell us about your requirements or questions..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-earth-green hover:bg-earth-green/90"
                        size="lg"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-earth-brown mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  We're committed to helping rural communities achieve their sustainability goals. 
                  Contact us through any of the following channels:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-l-4 border-earth-green">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-earth-green/10 p-3 rounded-lg">
                          <info.icon className="h-6 w-6 text-earth-green" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-earth-brown">{info.title}</h3>
                          <p className="text-gray-900">{info.details}</p>
                          <p className="text-sm text-gray-600">{info.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Info */}
              <Card className="bg-earth-beige">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-brown mb-3">Why Contact Us?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Free consultation for all sustainability projects</li>
                    <li>• Expert advice on tree plantation and conservation</li>
                    <li>• Custom solutions for your community needs</li>
                    <li>• Support in both Hindi and English</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-earth-brown text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-brown mb-2">How quickly do you respond?</h3>
                  <p className="text-gray-600 text-sm">We respond to all inquiries within 24 hours during business days.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-brown mb-2">Do you provide services in rural areas?</h3>
                  <p className="text-gray-600 text-sm">Yes, we specialize in serving rural communities across the region.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-brown mb-2">Is consultation free?</h3>
                  <p className="text-gray-600 text-sm">Initial consultation and advice are completely free of charge.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-earth-brown mb-2">What languages do you support?</h3>
                  <p className="text-gray-600 text-sm">We provide support in both Hindi and English languages.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
