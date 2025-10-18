import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { cartService, CartItem } from '@/services/cartService';
import { serviceRequestService } from '@/services/serviceRequest';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    notes: '',
    preferredDate: ''
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      // Validate quantity
      if (newQuantity < 1) {
        toast({
          title: "Invalid Quantity",
          description: "Quantity cannot be less than 1",
          variant: "destructive"
        });
        return;
      }

      // Find the item to check stock
      const item = cartItems.find(i => i.id === itemId);
      if (!item) return;

      // Check if new quantity exceeds stock
      if (newQuantity > item.tree.stock) {
        toast({
          title: "Stock Limit",
          description: `Only ${item.tree.stock} items available in stock`,
          variant: "destructive"
        });
        return;
      }

      // Optimistically update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Update backend
      await cartService.updateCartItem(itemId, newQuantity);
    } catch (error) {
      // Revert local state on error
      await fetchCartItems();
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // Optimistically update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Update backend
      await cartService.removeFromCart(itemId);
    } catch (error) {
      // Revert local state on error
      await fetchCartItems();
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.tree.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate total
      const total = calculateTotal();

      // Create service request with cart items
      const serviceRequest = await serviceRequestService.createServiceRequest({
        type: 'TREE_PLANTATION',
        customerName: checkoutForm.name,
        customerMobile: checkoutForm.mobile,
        customerEmail: checkoutForm.email,
        customerAddress: checkoutForm.address,
        customerPincode: checkoutForm.pincode,
        customerNotes: checkoutForm.notes,
        items: cartItems.map(item => ({
          name: item.tree.name,
          quantity: item.quantity,
          price: item.tree.price
        })),
        total
      });

      // Clear cart after successful service request creation
      await cartService.clearCart();

      toast({
        title: "Thank You!",
        description: `Your request has been submitted successfully. Request ID: ${serviceRequest.requestId}`,
      });

      // Reset form
      setCheckoutForm({
        name: '',
        mobile: '',
        email: '',
        address: '',
        pincode: '',
        notes: '',
        preferredDate: ''
      });

      // Navigate to track requests page with request ID and new order flag
      navigate(`/track-requests?requestId=${serviceRequest.requestId}&new=true`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearCart = async () => {
    try {
      // Optimistically clear local state
      setCartItems([]);
      
      // Update backend
      await cartService.clearCart();
      
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      // Revert local state on error
      await fetchCartItems();
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-earth-brown mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Start adding some trees to your cart to make a difference!</p>
              <Button asChild className="bg-earth-green hover:bg-earth-green/90">
                <Link to="/trees">Browse Trees</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-earth-cream to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 sm:pb-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-green mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button asChild>
                <Link to="/trees" className="bg-earth-green hover:bg-earth-green/90">
                  Browse Trees
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <CardTitle className="text-lg sm:text-xl">Your Cart</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearCart}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.tree.imageUrl}
                            alt={item.tree.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 w-full sm:w-auto">
                            <h3 className="font-medium text-base sm:text-lg">{item.tree.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{item.tree.scientificName}</p>
                            
                            {/* Mobile: Price and Remove in a row */}
                            <div className="flex items-center justify-between sm:hidden mb-3">
                              <p className="font-medium text-lg">₹{item.tree.price * item.quantity}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 p-1"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 mr-2">Qty:</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.tree.stock}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Desktop: Price and Remove */}
                          <div className="hidden sm:flex sm:flex-col sm:items-end sm:text-right">
                            <p className="font-medium text-lg mb-2">₹{item.tree.price * item.quantity}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Checkout Form */}
              <div className="lg:sticky lg:top-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Checkout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg sm:text-xl font-medium p-3 bg-earth-cream rounded-lg">
                        <span>Total:</span>
                        <span className="text-earth-green">₹{calculateTotal()}</span>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={checkoutForm.name}
                            onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile">Mobile Number *</Label>
                          <Input
                            id="mobile"
                            type="tel"
                            value={checkoutForm.mobile}
                            onChange={(e) => setCheckoutForm({...checkoutForm, mobile: e.target.value})}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={checkoutForm.email}
                            onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Textarea
                            id="address"
                            value={checkoutForm.address}
                            onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            value={checkoutForm.pincode}
                            onChange={(e) => setCheckoutForm({...checkoutForm, pincode: e.target.value})}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            value={checkoutForm.notes}
                            onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                            disabled={isSubmitting}
                            placeholder="Any special instructions for tree plantation..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredDate">Preferred Date</Label>
                          <Input
                            id="preferredDate"
                            type="date"
                            value={checkoutForm.preferredDate}
                            onChange={(e) => setCheckoutForm({...checkoutForm, preferredDate: e.target.value})}
                            disabled={isSubmitting}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-earth-green hover:bg-earth-green/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Processing...' : 'Place Order'}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
