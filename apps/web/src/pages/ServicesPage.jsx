
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Smartphone, Globe, Cloud, Palette, Code, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const ServicesPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const services = [
    {
      icon: <Smartphone className="w-16 h-16" />,
      title: 'Mobile App Development',
      description: 'Native iOS and Android apps, cross-platform solutions with React Native and Flutter. From concept to deployment, we build apps that users love.',
    },
    {
      icon: <Globe className="w-16 h-16" />,
      title: 'Web Development',
      description: 'Modern, responsive web applications using React, Vue, and Angular. Progressive web apps that work seamlessly across all devices.',
    },
    {
      icon: <Cloud className="w-16 h-16" />,
      title: 'Cloud Solutions',
      description: 'AWS, Azure, and Google Cloud infrastructure. Scalable, secure cloud architecture and migration services for your business.',
    },
    {
      icon: <Palette className="w-16 h-16" />,
      title: 'UI/UX Design',
      description: 'User-centered design that combines aesthetics with functionality. Wireframing, prototyping, and user testing for optimal experiences.',
    },
    {
      icon: <Code className="w-16 h-16" />,
      title: 'API Development',
      description: 'RESTful and GraphQL APIs built with Node.js, Python, and Go. Secure, documented, and scalable backend solutions.',
    },
    {
      icon: <Server className="w-16 h-16" />,
      title: 'DevOps Services',
      description: 'CI/CD pipelines, containerization with Docker and Kubernetes, automated testing, and continuous monitoring.',
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pb.collection('service_inquiries').create(formData, { $autoCancel: false });
      toast({
        title: 'Success!',
        description: 'Your inquiry has been submitted. We will contact you soon.',
      });
      setFormData({ name: '', email: '', service: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Our Services - Maiu Technologies</title>
        <meta name="description" content="Comprehensive technology services including mobile app development, web solutions, cloud services, and more." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Comprehensive technology solutions to transform your business and drive innovation
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105 group"
                >
                  <div className="text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Inquiry Form */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Request a Service</h2>
              <p className="text-xl text-gray-600">
                Interested in our services? Fill out the form below and we'll get back to you shortly.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 bg-white text-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 bg-white text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="service" className="text-gray-700">Service Interested In</Label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                  >
                    <option value="">Select a service</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cloud Solutions">Cloud Solutions</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="API Development">API Development</option>
                    <option value="DevOps Services">DevOps Services</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 bg-white text-gray-900"
                    placeholder="Tell us about your project..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
