import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Code, 
  Cpu, 
  DollarSign,
  Play,
  Github,
  Mail,
  Phone,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjXLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buy');

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Software Projects",
      description: "Mobile apps, web applications, AI/ML solutions, and more"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Hardware Projects", 
      description: "IoT devices, robotics, electronics, and embedded systems"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Quality",
      description: "All projects are reviewed and verified before listing"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Earn Money",
      description: "Monetize your skills and projects with competitive pricing"
    }
  ];

  const stats = [
    { number: "10K+", label: "Students" },
    { number: "5K+", label: "Projects Sold" },
    { number: "₹50L+", label: "Earned by Students" },
    { number: "4.8★", label: "Average Rating" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Student, IIT Delhi",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "I sold my machine learning project for ₹15,000! ProjX made it so easy to showcase and sell my work."
    },
    {
      name: "Rahul Patel",
      role: "ECE Student, NIT Surat",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Found the perfect IoT solution for my final year project. Saved months of development time!"
    },
    {
      name: "Sneha Reddy",
      role: "IT Student, BITS Pilani",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "The quality of projects here is amazing. Great platform for students to learn and earn!"
    }
  ];

  const projectShowcase = [
    {
      title: "Smart Home Automation",
      category: "IoT & Electronics",
      price: "₹25,000",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      tags: ["Arduino", "IoT", "Mobile App"]
    },
    {
      title: "E-Commerce Platform",
      category: "Web Development",
      price: "₹18,000",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tags: ["React", "Node.js", "MongoDB"]
    },
    {
      title: "AI Chatbot System",
      category: "Machine Learning",
      price: "₹22,000",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop",
      tags: ["Python", "TensorFlow", "NLP"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">ProjX</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#projects" className="text-slate-300 hover:text-white transition-colors">Projects</a>
              <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Reviews</a>
              <Link to={'/login'} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
                Get Started
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-slate-300 hover:text-white">Features</a>
              <a href="#projects" className="block py-2 text-slate-300 hover:text-white">Projects</a>
              <a href="#testimonials" className="block py-2 text-slate-300 hover:text-white">Reviews</a>
              <Link to={'/login'} className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mt-2">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Join 10,000+ Students Earning Money</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Share Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Earn Money</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              The ultimate marketplace for student projects. Buy ready-made solutions or sell your innovative projects to fellow students worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to={'/dashboard'} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105">
                <span>Start Selling Projects</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ProjX?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built specifically for students, by students. We understand your needs and challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-400">Simple steps to start earning or find the perfect project</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-slate-800 rounded-xl p-1 flex">
              <button 
                onClick={() => setActiveTab('buy')}
                className={`px-6 py-3 rounded-lg transition-all ${activeTab === 'buy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                For Buyers
              </button>
              <button 
                onClick={() => setActiveTab('sell')}
                className={`px-6 py-3 rounded-lg transition-all ${activeTab === 'sell' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                For Sellers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeTab === 'buy' ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Browse Projects</h3>
                  <p className="text-slate-400">Explore thousands of verified projects across different categories and technologies.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Purchase & Download</h3>
                  <p className="text-slate-400">Secure payment process with instant access to project files and documentation.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Support</h3>
                  <p className="text-slate-400">Direct communication with project creators for guidance and customization.</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Upload Your Project</h3>
                  <p className="text-slate-400">Submit your project with detailed documentation, images, and demo videos.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Get Verified</h3>
                  <p className="text-slate-400">Our team reviews and verifies your project quality and functionality.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Start Earning</h3>
                  <p className="text-slate-400">Set your price and start earning money from your innovative projects.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section id="projects" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Projects</h2>
            <p className="text-xl text-slate-400">Discover high-quality projects from talented students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectShowcase.map((project, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{project.category}</span>
                    <span className="text-lg font-bold text-green-400">{project.price}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Students Say</h2>
            <p className="text-xl text-slate-400">Real success stories from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already earning money from their projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={'/login'} className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105">
              Sign Up as Seller
            </Link>
            <Link to={'your-project'} className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all hover:scale-105">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold">ProjX</span>
              </div>
              <p className="text-slate-400 mb-4">Empowering students to monetize their creativity and innovation.</p>
              <div className="flex space-x-4">
                <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Mail className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Phone className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Browse Projects</a></li>
                <li><a href="#" className="hover:text-white">Sell Projects</a></li>
                <li><a href="#" className="hover:text-white">Categories</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 ProjX. All rights reserved. Made with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjXLandingPage;