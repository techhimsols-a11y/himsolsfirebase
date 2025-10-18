import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tree } from '@/types/tree';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllTrees } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useMutation } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';
import { Link } from 'react-router-dom';

const TreeCatalogContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  const { data: trees = [], isLoading, error } = useQuery({
    queryKey: ['trees'],
    queryFn: getAllTrees,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCartItems,
  });

  const addToCartMutation = useMutation({
    mutationFn: (tree: Tree) => cartService.addToCart(tree.id, 1),
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setAddingItemId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      setAddingItemId(null);
    },
  });

  const handleAddToCart = (tree: Tree) => {
    setAddingItemId(tree.id);
    addToCartMutation.mutate(tree);
  };

  // Ensure trees is always an array
  const safeTrees = Array.isArray(trees) ? trees : [];
  const categories = ['All', ...Array.from(new Set(safeTrees.map(tree => tree.category)))];
  
  const filteredTrees = selectedCategory === 'All' 
    ? safeTrees 
    : safeTrees.filter(tree => tree.category === selectedCategory);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
        {/* Header Section */}
        <div className="bg-earth-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Tree Plantation Catalog</h1>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                Choose from our carefully selected native trees. Each tree comes with planting guidance and care instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Cart Button */}
        <Link 
          to="/cart" 
          className="fixed bottom-20 left-4 sm:bottom-8 sm:left-8 bg-earth-green text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-earth-green/90 transition-colors z-40"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </Link>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Category Filter */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-earth-brown mb-3 sm:mb-4">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs sm:text-sm ${selectedCategory === category ? "bg-earth-green hover:bg-earth-green/90" : "border-earth-green text-earth-green hover:bg-earth-green hover:text-white"}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tree Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-24 sm:pb-16">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-xl transition-shadow">
                  <Skeleton className="w-full h-40 sm:h-48 rounded-t-lg" />
                  <CardHeader className="p-4 sm:p-6">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 pb-24 sm:pb-16">
              <p className="text-red-500 mb-4">Error loading trees. Please try again later.</p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          ) : filteredTrees.length === 0 ? (
            <div className="text-center py-12 pb-24 sm:pb-16">
              <p className="text-gray-500">No trees found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-24 sm:pb-16">
              {filteredTrees.map((tree) => (
                <Card key={tree.id} className="hover:shadow-xl transition-shadow border-2 hover:border-earth-green/30">
                  <div className="relative">
                    <img 
                      src={tree.imageUrl} 
                      alt={tree.name}
                      className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-earth-green text-xs">
                      {tree.category}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-earth-brown text-lg sm:text-xl">{tree.name}</CardTitle>
                    <CardDescription className="italic text-sm">
                      {tree.scientificName}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-gray-600 mb-4 text-sm">{tree.description}</p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Growth Time:</span>
                        <span className="font-medium">{tree.growthTime}</span>  
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Max Height:</span>
                        <span className="font-medium">{tree.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stock:</span>
                        <span className="font-medium">{tree.stock} available</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {tree.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-lg font-semibold text-earth-brown">
                      ₹{tree.price}
                      </span>
                      <Button 
                        onClick={() => handleAddToCart(tree)}
                        className="bg-earth-green hover:bg-earth-green/90 text-sm"
                        size="sm"
                        disabled={tree.stock === 0 || (addToCartMutation.isPending && addingItemId === tree.id)}
                      >
                        {addToCartMutation.isPending && addingItemId === tree.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </span>
                        ) : tree.stock === 0 ? (
                          'Out of Stock'
                        ) : (
                          'Add to Cart'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const TreeCatalog = () => (
  <ErrorBoundary>
    <TreeCatalogContent />
  </ErrorBoundary>
);

export default TreeCatalog;
