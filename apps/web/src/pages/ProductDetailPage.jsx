
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ShoppingCart, Plus, Minus, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext.jsx';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await pb.collection('products').getOne(id, { $autoCancel: false });
        setProduct(productData);

        // Fetch related products from same category
        if (productData.category) {
          const related = await pb.collection('products').getList(1, 4, {
            filter: `category = "${productData.category}" && id != "${id}"`,
            $autoCancel: false,
          });
          setRelatedProducts(related.items);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Success!',
      description: `${quantity} x ${product.name} added to cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = product.features ? product.features.split(',').map((f) => f.trim()) : [];

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Maiu Technologies`}</title>
        <meta name="description" content={product.description || `Details about ${product.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>

          {/* Product Details */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                {product.image ? (
                  <img
                    src={pb.files.getUrl(product, product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code className="w-32 h-32 text-purple-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                {product.category && (
                  <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    {product.category}
                  </span>
                )}
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>

                {product.detailed_description && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.detailed_description}</p>
                  </div>
                )}

                {features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Features</h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-purple-600">${product.price}</span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-lg py-6"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/products/${relatedProduct.id}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                      {relatedProduct.image ? (
                        <img
                          src={pb.files.getUrl(relatedProduct, relatedProduct.image)}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code className="w-12 h-12 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-purple-600 font-bold">${relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
