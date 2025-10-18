
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Recycle, BookOpen, Calendar, Users, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

const Services = () => {
  const services = [
    {
      icon: TreePine,
      title: 'Tree Plantation',
      description: 'Comprehensive tree plantation services with native species selection, planting guidance, and after-care support.',
      features: ['Native Species Selection', 'Professional Planting', 'After-care Support', 'Growth Monitoring'],
      link: '/trees',
      // price: 'Starting from ₹150/tree'
    },
    {
      icon: Recycle,
      title: 'Waste-Scrap Management',
      description: 'Efficient waste collection, segregation, and recycling services for rural communities.',
      features: ['Door-to-door Collection', 'Waste Segregation', 'Recycling Services', 'Compost Production'],
      link: '/services/waste-management',
      // price: 'Starting from ₹500/month'
    },
    
    {
      icon: Calendar,
      title: 'Eco-Events Registration',
      description: 'Join environmental awareness programs, tree planting drives, and community conservation events.',
      features: ['Awareness Programs', 'Community Events', 'Workshops', 'Volunteer Opportunities'],
      link: '/services/events',
      // price: 'Free participation'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
        {/* Header Section */}
        <div className="bg-earth-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Our Services</h1>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                Comprehensive eco-sustainability solutions designed specifically for rural communities. 
                We provide end-to-end support for all your environmental conservation needs.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-2 hover:border-earth-green/30">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-earth-green/10 p-3 rounded-lg">
                      <service.icon className="h-8 w-8 text-earth-green" />
                    </div>
                    <div>
                      <CardTitle className="text-earth-brown text-xl">{service.title}</CardTitle>
                      {/* <p className="text-earth-green font-medium">{service.price}</p> */}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-600 mb-6">
                    {service.description}
                  </CardDescription>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-earth-brown mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-earth-green rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={service.link}>
                    <Button className="w-full bg-earth-green hover:bg-earth-green/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-earth-brown text-center mb-8">Why Choose Himsols?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-earth-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-earth-green" />
                </div>
                <h3 className="font-semibold text-earth-brown mb-2">Community Focused</h3>
                <p className="text-gray-600 text-sm">
                  Designed specifically for rural communities with local expertise and understanding.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-earth-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-earth-green" />
                </div>
                <h3 className="font-semibold text-earth-brown mb-2">Sustainable Solutions</h3>
                <p className="text-gray-600 text-sm">
                  Environmentally friendly practices that create long-term positive impact.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-earth-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-earth-green" />
                </div>
                <h3 className="font-semibold text-earth-brown mb-2">Expert Guidance</h3>
                <p className="text-gray-600 text-sm">
                  Professional advice and support from environmental conservation experts.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-earth-brown mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">Contact us today to discuss your sustainability needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-earth-green hover:bg-earth-green/90">
                  Contact Us
                </Button>
              </Link>
              <Link to="/trees">
                <Button variant="outline" size="lg" className="border-earth-green text-earth-green hover:bg-earth-green hover:text-white">
                  Start with Tree Plantation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
