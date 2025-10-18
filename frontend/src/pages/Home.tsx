
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Recycle, BookOpen, Calendar, Users, Leaf } from 'lucide-react';
import Layout from '@/components/Layout';

const Home = () => {
  const services = [
    {
      icon: TreePine,
      title: 'Tree Plantation',
      description: 'Plant native trees and contribute to forest restoration. Choose from our wide variety of saplings.',
      link: '/trees',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: Recycle,
      title: 'Waste-Scrap Management',
      description: 'Efficient waste collection and recycling services for your community.',
      link: '/services/waste-management',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: BookOpen,
      title: 'Conservation Guidance',
      description: 'Expert advice on environmental conservation and sustainable living practices.',
      link: '/services/conservation',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: Calendar,
      title: 'Eco-Events Registration',
      description: 'Join environmental awareness events and community conservation activities.',
      link: '/services/events',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const stats = [
    { number: '100+', label: 'Trees Planted' },
    { number: '5+', label: 'Farmers Served' },
    { number: '2+', label: 'Events Organized' },
    { number: '10+', label: 'Volunteers' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-earth-cream to-earth-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-earth-brown mb-6">
                Building a Sustainable Future Together
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Join Himsols in creating an eco-friendly environment through tree plantation, 
                waste management, and conservation initiatives. Together, we can make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/trees">
                  <Button size="lg" className="bg-earth-green hover:bg-earth-green/90 w-full sm:w-auto">
                    Start Planting Trees
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-earth-green text-earth-green hover:bg-earth-green hover:text-white">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&h=600" 
                alt="Sunlight through green trees"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-6 w-6 text-earth-green" />
                  <span className="font-semibold text-earth-brown">Eco-Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-earth-brown mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive eco-sustainability solutions designed for rural communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-earth-green/30">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-earth-brown">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4 text-gray-600">
                    {service.description}
                  </CardDescription>
                  <Link to={service.link}>
                    <Button variant="outline" className="border-earth-green text-earth-green hover:bg-earth-green hover:text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-earth-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg opacity-90">Making a real difference in our communities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-earth-beige">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-earth-brown mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of others in building a sustainable future. Start your eco-journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/trees">
              <Button size="lg" className="bg-earth-green hover:bg-earth-green/90">
                Plant Your First Tree
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-earth-green text-earth-green hover:bg-earth-green hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
