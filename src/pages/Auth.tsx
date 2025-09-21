import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Eye, EyeOff, IndianRupee, BarChart3, Users, 
  TrendingUp, Shield, Zap, CheckCircle, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Login Successful!', description: 'Welcome back.' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Account Created!', description: 'You have been logged in.' });
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: BarChart3, text: "AI-Powered Business Insights" },
    { icon: Users, text: "Customer Behavior Analysis" },
    { icon: TrendingUp, text: "Sales Forecasting" },
    { icon: IndianRupee, text: "Financial Optimization" },
    { icon: Shield, text: "Enterprise-Grade Security" },
    { icon: Zap, text: "Real-time Analytics" }
  ];

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 to-orange-900/30">
      {/* Left side - Auth Form */}
      <div className="flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2"
            >
              <Sparkles className="w-7 h-7 text-orange-400" />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                नफाNuksan
              </span>
            </motion.div>
            <p className="text-orange-200/80 text-sm">
              The Co-Pilot for Indian SMEs
            </p>
          </div>

          <Card className="bg-gray-900/80 backdrop-blur-md border-orange-500/20 shadow-xl shadow-orange-500/10">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-white text-center">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-orange-200/70 text-center">
                {isLogin ? 'Sign in to access your AI co-pilot' : 'Join thousands of Indian SMEs growing with AI'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-orange-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@yourbusiness.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-orange-500/30 focus:border-orange-400 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-orange-200">Password</Label>
                    {isLogin && (
                      <a href="#" className="text-sm text-orange-400 hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-gray-800/50 border-orange-500/30 focus:border-orange-400 text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-300 hover:text-orange-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 h-11 mt-2 shadow-lg shadow-orange-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent mr-2"
                      />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-orange-200/80">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 font-medium text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {isLogin ? 'Sign up now' : 'Sign in'}
                </button>
              </div>
            </CardContent>
          </Card>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-xs text-orange-300/50"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Feature Showcase */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-orange-900/30 to-amber-900/20 p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-amber-400 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-2xl font-bold z-10"
        >
          <Sparkles className="text-orange-400"/> 
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            नफाNuksan
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-1 flex flex-col justify-center z-10"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-4">
              AI-Powered Growth for <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Indian Businesses
              </span>
            </h2>
            <p className="text-orange-100/80 text-lg max-w-md">
              Transform your business data into actionable insights with our specialized AI co-pilot designed for the Indian market.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className="flex items-center gap-2 p-3 rounded-lg bg-orange-900/20 backdrop-blur-sm border border-orange-500/20"
              >
                <feature.icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-orange-100/90 text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-orange-100/80 text-sm">
                <span className="font-medium text-amber-300">63 Million+</span> Indian SMEs are transforming with AI
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-orange-100/80 text-sm">
                <span className="font-medium text-amber-300">3X Faster</span> decision making with real-time insights
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-orange-100/80 text-sm">
                <span className="font-medium text-amber-300">90%</span> of businesses see growth in first 3 months
              </p>
            </div>
          </div>
        </motion.div>
         <br></br>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-auto z-10"
        >
          <blockquote className="space-y-4 p-6 bg-orange-900/20 backdrop-blur-sm rounded-xl border border-orange-500/20">
            <p className="text-orange-100/90 text-lg italic">
              "Vyaaparik has been the co-pilot that revolutionized how we see our own data. We're not just selling; we're strategizing with every transaction."
            </p>
            <footer className="text-amber-300 font-medium">Anjali Mehta, CEO of Mumbai Fashion Hub</footer>
          </blockquote>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
