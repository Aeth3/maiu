
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        userId: currentUser.id,
        items: JSON.stringify(cart),
        subtotal,
        tax,
        total,
        status: 'pending',
        shipping_address: JSON.stringify(shippingData),
        created_date: new Date().toISOString(),
      };

      await pb.collection('orders').create(orderData, { $autoCancel: false });

      setOrderComplete(true);
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation - Maiu Technologies</title>
          <meta name="description" content="Your order has been placed successfully" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. We've sent a confirmation email to {shippingData.email}.
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Maiu Technologies</title>
        <meta name="description" content="Complete your purchase" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-20 h-1 ${step > s ? 'bg-purple-600' : 'bg-gray-300'}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={shippingData.name}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-700">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-gray-700">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-700">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-gray-700">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={shippingData.zip}
                      onChange={handleShippingChange}
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-700">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1 text-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="expiry" className="text-gray-700">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        required
                        className="mt-1 text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-700">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        required
                        className="mt-1 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {shippingData.name}<br />
                      {shippingData.address}<br />
                      {shippingData.city}, {shippingData.state} {shippingData.zip}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-600">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
