import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  TrendingUp, Users, IndianRupee, Sparkles, Brain, BarChart3, 
  ArrowRight, Shield, Zap, Globe, Target, Clock, CheckCircle, 
  Star, Award, ChevronDown, X, PlayCircle, Package, MessageCircle, Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import HeroBusiness from '@/assets/hero-business.jpg';
import IndianMarket from '@/assets/indian-market.png';
import DashboardPreview from '@/assets/dashboard-preview.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const refs = {
    hero: useRef(null),
    stats: useRef(null),
    problem: useRef(null),
    solution: useRef(null),
    features: useRef(null),
    howItWorks: useRef(null),
    testimonials: useRef(null),
    pricing: useRef(null),
    cta: useRef(null)
  };

  const isInView = {
    hero: useInView(refs.hero, { once: true, margin: "-20%" }),
    stats: useInView(refs.stats, { once: true, margin: "-10%" }),
    problem: useInView(refs.problem, { once: true, margin: "-10%" }),
    solution: useInView(refs.solution, { once: true, margin: "-10%" }),
    features: useInView(refs.features, { once: true, margin: "-10%" }),
    howItWorks: useInView(refs.howItWorks, { once: true, margin: "-10%" }),
    testimonials: useInView(refs.testimonials, { once: true, margin: "-10%" }),
    pricing: useInView(refs.pricing, { once: true, margin: "-10%" }),
    cta: useInView(refs.cta, { once: true, margin: "-10%" })
  };
      
// Particle background effect with orange theme
useEffect(() => {
  const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let particlesArray: Particle[] = [];
  const numberOfParticles = 100;
  const particleColors = ['rgba(251, 146, 60, 0.4)', 'rgba(249, 115, 22, 0.4)', 'rgba(234, 88, 12, 0.4)', 'rgba(194, 65, 12, 0.3)'];
  
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  const init = () => {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  };
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  };
  
  init();
  animate();
  
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900/20 overflow-hidden">
      {/* Animated Background */}
      <canvas id="particle-canvas" className="fixed top-0 left-0 w-full h-full opacity-40 z-0"></canvas>
      
      {/* Hero Section */}
      <section ref={refs.hero} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HeroBusiness} alt="Indian SME Business" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-gray-900/80 to-amber-900/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.hero ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView.hero ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2 text-orange-400" />
              <span className="text-orange-300 font-medium">AI-Powered Growth for Indian SMEs</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight">
              <span className="block">🤖 नफाNuksan</span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent mt-2">Your Balance & Bloom</span>
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Business Co-Pilot</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your raw business data into actionable, AI-powered strategy tailored for the Indian market. Stop guessing. Start growing.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView.hero ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/30 text-lg px-8 py-4 group transform hover:scale-105 transition-all duration-300">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4 bg-transparent border-orange-300/50 text-orange-100 hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            animate={isInView.hero ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <ChevronDown className="w-8 h-8 text-orange-300 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={refs.stats} className="relative py-20 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.stats ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Revolutionizing Indian SMEs</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Empowering businesses across India with AI-driven insights and strategies
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, value: "63 Million+", label: "Indian SMEs poised for an AI revolution", delay: 0, color: "text-orange-400" },
              { icon: IndianRupee, value: "90% Untapped", label: "Business data is never analyzed. We change that.", delay: 0.1, color: "text-amber-400" },
              { icon: TrendingUp, value: "3X Faster", label: "Go from raw data to strategic decisions in minutes, not weeks.", delay: 0.2, color: "text-yellow-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView.stats ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: stat.delay }}
              >
                <Card className="text-center p-8 h-full bg-gradient-to-br from-gray-900/90 to-orange-900/20 backdrop-blur-sm border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/20 group transform hover:scale-105">
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-3xl font-bold mb-2 text-white">{stat.value}</h3>
                  <p className="text-orange-90/70">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Problem Section */}
      <section ref={refs.problem} className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.problem ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">The Challenge for Indian SMEs</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Traditional business intelligence tools weren't built for the unique challenges of the Indian market
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView.problem ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {[
                  { title: "Data Overload, Insights Underload", description: "SMEs collect vast amounts of data but lack the tools to extract meaningful insights." },
                  { title: "Complex Market Dynamics", description: "The Indian market has unique regional, cultural, and economic factors that generic tools miss." },
                  { title: "High Cost of Expertise", description: "Hiring data scientists and analysts is prohibitively expensive for most small businesses." },
                  { title: "Slow Decision Making", description: "By the time insights are manually derived, market conditions have already changed." }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-red-500/20 p-2 rounded-full mr-4 flex-shrink-0 border border-red-500/30">
                      <X className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-orange-200/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView.problem ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
              
              <div className="w-full h-96 bg-gradient-to-br from-gray-800 via-gray-900 to-orange-900/30 
                              rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden 
                              border border-orange-500/20">
                <img 
                  src={IndianMarket}
                  alt="Indian Market Challenges" 
                  className="w-full h-full object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* Solution Section */}
      <section ref={refs.solution} className="relative py-20 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.solution ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">The नफाNuksan Solution</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Purpose-built AI technology that understands the nuances of Indian business
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView.solution ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
              <div className="w-full h-96 bg-gradient-to-br from-gray-800 via-gray-900 to-orange-900/30 rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden border border-orange-500/20">
                <img 
                  src={DashboardPreview}  
                  alt="AI Solution Dashboard Preview" 
                  className="w-full h-full object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView.solution ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                {[
                  { title: "Market-Specific Intelligence", description: "Our AI understands regional trends, festivals, seasons and economic factors unique to India.", icon: Globe, color: "text-orange-400" },
                  { title: "Actionable Insights", description: "Get clear, implementable recommendations—not just complex data visualizations.", icon: Target, color: "text-amber-400" },
                  { title: "Real-Time Analysis", description: "Make decisions based on current market conditions, not last month's data.", icon: Clock, color: "text-yellow-400" },
                  { title: "Accessible to Everyone", description: "No technical expertise needed—just ask questions in plain language.", icon: Users, color: "text-orange-300" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-orange-500/20 p-2 rounded-full mr-4 flex-shrink-0 border border-orange-500/30">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-orange-200/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={refs.features} className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Everything you need to make data-driven decisions for your business
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Predictive Analytics", description: "Forecast sales, demand, and market trends with remarkable accuracy.", icon: BarChart3, color: "text-orange-400", bgColor: "bg-orange-500/10" },
              { title: "Customer Insights", description: "Understand your customers' behavior, preferences, and purchasing patterns.", icon: Users, color: "text-amber-400", bgColor: "bg-amber-500/10" },
              { title: "Competitive Analysis", description: "See how you stack up against competitors and identify market opportunities.", icon: Shield, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
              { title: "Inventory Optimization", description: "Maintain ideal stock levels to minimize costs and maximize sales.", icon: Package, color: "text-orange-300", bgColor: "bg-orange-600/10" },
              { title: "Personalized Marketing", description: "Create targeted campaigns that resonate with your audience.", icon: Target, color: "text-amber-300", bgColor: "bg-amber-600/10" },
              { title: "Financial Health Monitoring", description: "Track cash flow, profitability, and financial metrics in real-time.", icon: IndianRupee, color: "text-yellow-300", bgColor: "bg-yellow-600/10" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView.features ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-gradient-to-br from-gray-900/90 to-orange-900/20 backdrop-blur-sm border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 group hover:shadow-lg hover:shadow-orange-500/20 transform hover:scale-105">
                  <div className={`p-3 rounded-lg ${feature.bgColor} w-fit mb-4 group-hover:scale-110 transition-transform border border-orange-500/20`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-black-200/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section ref={refs.howItWorks} className="relative py-20 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.howItWorks ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Transforming your business data into actionable insights in four simple steps
            </p>
          </motion.div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500/30 to-amber-500/30 hidden md:block"></div>
            
            <div className="space-y-12 md:space-y-0">
              {[
                { title: "Connect Your Data", description: "Securely link your sales, inventory, and customer data from any platform.", icon: Link, side: "left", color: "text-orange-400", bgColor: "bg-orange-500/20" },
                { title: "Ask Your Questions", description: "Use regional language to ask business questions—no technical skills needed.", icon: MessageCircle, side: "right", color: "text-amber-400", bgColor: "bg-amber-500/20" },
                { title: "Get AI-Powered Insights", description: "Our specialized AI analyzes your data in the context of the Indian market.", icon: Brain, side: "left", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
                { title: "Implement & Grow", description: "Receive actionable recommendations and track their impact on your business.", icon: TrendingUp, side: "right", color: "text-orange-300", bgColor: "bg-orange-600/20" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView.howItWorks ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row items-center ${step.side === 'left' ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center z-10 relative border border-orange-500/30`}>
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <div className={`absolute inset-0 ${step.bgColor} rounded-full animate-ping opacity-75`}></div>
                    </div>
                  </div>
                  <div className={`md:w-1/2 ${step.side === 'left' ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-orange-900/20 backdrop-blur-sm border-orange-500/20">
                      <div className="text-lg font-semibold text-orange-400 mb-2">Step {index + 1}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-black-200/70">{step.description}</p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section ref={refs.testimonials} className="relative py-20 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.testimonials ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Success Stories</h2>
            <p className="text-xl text-orange-200/80 max-w-3xl mx-auto">
              Hear from Indian SMEs who have transformed their businesses with नफाNuksan
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Rajesh Kumar", company: "Delhi Textiles", content: "नफाNuksan helped us identify regional demand patterns we never noticed. Our sales have increased by 37% in just three months.", avatar: "RK", color: "text-orange-400" },
              { name: "Priya Sharma", company: "Mumbai Spices", content: "The inventory optimization feature alone has saved us over ₹50,000 monthly in reduced waste and better stock management.", avatar: "PS", color: "text-amber-400" },
              { name: "Vikram Singh", company: "Bangalore Electronics", content: "As a small business, we couldn't afford a data analyst. नफाNuksan gives us the same insights at a fraction of the cost.", avatar: "VS", color: "text-yellow-400" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6 h-full bg-gradient-to-br from-gray-900/90 to-orange-900/20 backdrop-blur-sm border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/20">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mr-4 border border-orange-500/30">
                      <span className={`font-semibold ${testimonial.color}`}>{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-orange-200/70">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-black-200/80 mb-4">"{testimonial.content}"</p>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section ref={refs.cta} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-orange-900/80 via-gray-900/90 to-amber-900/80"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8">
              <Award className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Ready to Transform Your Business?</h2>
            <p className="text-xl text-orange-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Indian SMEs who are already using नफाNuksan to make smarter decisions and grow their businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white shadow-xl shadow-orange-500/30 text-lg px-8 py-4 group transform hover:scale-105 transition-all duration-300">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-orange-200/60 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                Free 30-day trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;