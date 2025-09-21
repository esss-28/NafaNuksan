import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { IndianRupee, ShoppingBag, Star, TrendingUp, Bot, User, Sparkles, Lightbulb, BarChart2, Send, Brain, Zap, Target, Database, ChevronDown, Maximize2, Minimize2, X, MessageSquare, Activity, PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart3, Layers, Cpu, Wifi, WifiOff, ArrowRight, MousePointer2 } from 'lucide-react';
import { type BusinessSummary } from '@/lib/data-processing';
import { runAgenticQuery } from '@/lib/gemini';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid, Pie, PieChart, Cell, Line, LineChart } from 'recharts';
import Markdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, onSnapshot, Timestamp,  query, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatViewProps {
  session: { id: string; title: string; createdAt: any; summary: BusinessSummary };
}

type Message = {
  id?: string;
  sender: 'user' | 'assistant';
  text: string;
  insight?: string;
  recommendations?: string[];
  chartData?: any[];
  createdAt?: any; // Add this line to include the timestamp
};

const COLORS = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#4ECDC4', '#45B7D1'];

// Subtle floating particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-0.5 h-0.5 bg-orange-400/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const TypingIndicator = () => (
  <motion.div
    className="flex items-center gap-3 p-4 bg-[#2A2D3A]/50 rounded-xl border border-gray-700/50 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
      <Brain className="w-4 h-4 text-white" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-gray-300 text-sm">AI is analyzing</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-orange-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const ChatView: React.FC<ChatViewProps> = ({ session }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [businessData, setBusinessData] = useState<any>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !session) return;

    const dataDocRef = doc(db, 'users', user.uid, 'sessions', session.id, 'data', 'fullData');
    getDoc(dataDocRef).then(docSnap => {
      if (docSnap.exists()) setBusinessData(docSnap.data());
    });

    const q = query(collection(db, 'users', user.uid, 'sessions', session.id, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const loadedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      if (loadedMessages.length === 0) {
        setMessages([{
          sender: 'assistant',
          text: `# Welcome to नफाNuksan 🚀\n\nI'm your intelligent business analyst, ready to dive deep into **${session.title}** data.\n\n## What I can help you with:\n\n**📊 Advanced Analytics** - Comprehensive sales insights and performance trends\n\n**🎯 Strategic Planning** - Data-driven business recommendations\n\n**📈 Market Intelligence** - Customer behavior and market opportunity analysis\n\n**⚡ Real-time Insights** - Live business monitoring and alerts\n\nLet's unlock the potential in your data. What would you like to explore first?`
        }]);
      } else setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [user, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading || !user) return;

    const userMessage: Message = { text: queryText, sender: 'user' };
    setInput('');
    setIsLoading(true);

    await addDoc(collection(db, 'users', user.uid, 'sessions', session.id, 'messages'), { ...userMessage, createdAt: serverTimestamp() });

    try {
      const context = { businessSummary: session.summary, ...businessData };
      const response = await runAgenticQuery(queryText, context);

      const assistantMessage: Message = {
        sender: 'assistant',
        text: response.analysis,
        insight: response.insights,
        recommendations: response.recommendations,
        chartData: response.charts,
      };

      await addDoc(collection(db, 'users', user.uid, 'sessions', session.id, 'messages'), { ...assistantMessage, createdAt: serverTimestamp() });
    } catch (error) {
      console.error("Error with Gemini or Firestore:", error);
      await addDoc(collection(db, 'users', user.uid, 'sessions', session.id, 'messages'), {
        sender: 'assistant',
        text: "I encountered an issue while processing your request. Please try again, and I'll do my best to provide the insights you need.",
        createdAt: serverTimestamp()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const SummaryCard = ({ icon, title, value, subtitle }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string, 
    subtitle?: string
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-[#2A2D3A] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-white text-lg">{title}</h4>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      </div>
      <p className="text-2xl font-bold text-orange-400">{value}</p>
    </motion.div>
  );

  const suggestionButtons = [
    { text: "Show me sales trends for last quarter", icon: TrendingUp },
    { text: "Which products need restocking urgently?", icon: Database },
    { text: "Analyze customer sentiment patterns", icon: Star },
    { text: "Suggest marketing strategies for Diwali", icon: Target },
    { text: "Compare performance by product category", icon: BarChart2 },
    { text: "Identify growth opportunities", icon: Zap }
  ];

  const renderChart = (chartData: any[]) => {
    if (!chartData || chartData.length === 0) return null;
    const firstItem = chartData[0];
    const isPieChart = firstItem.hasOwnProperty('fill');
    const isLineChart = chartData.length > 5;

    const ChartContainer = ({ children, title, icon }: { children: React.ReactNode, title: string, icon: React.ReactNode }) => (
      <div className="mt-8 p-6 bg-[#2A2D3A]/80 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
            {icon}
          </div>
          <h4 className="font-semibold text-white text-lg">{title}</h4>
        </div>
        {children}
      </div>
    );

    if (isPieChart) {
      return (
        <ChartContainer title="Data Distribution" icon={<PieChartIcon className="w-4 h-4 text-white" />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']} 
                contentStyle={{ 
                  backgroundColor: '#2A2D3A', 
                  borderColor: '#F59E0B',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    } else if (isLineChart) {
      return (
        <ChartContainer title="Trend Analysis" icon={<LineChartIcon className="w-4 h-4 text-white" />}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <RechartsTooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']} 
                contentStyle={{ 
                  backgroundColor: '#2A2D3A', 
                  borderColor: '#F59E0B',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#F59E0B" 
                strokeWidth={2} 
                activeDot={{ r: 6, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    } else {
      return (
        <ChartContainer title="Performance Metrics" icon={<BarChart3 className="w-4 h-4 text-white" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <RechartsTooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']} 
                contentStyle={{ 
                  backgroundColor: '#2A2D3A', 
                  borderColor: '#F59E0B',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              {chartData[0]?.value2 && <Bar dataKey="value2" fill="#10B981" radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }
  };

  const SuggestedQuestions = ({ onSelect }: { onSelect: (question: string) => void }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 p-6 bg-[#2A2D3A]/50 rounded-xl border border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <MousePointer2 className="w-5 h-5 text-orange-400" />
        <h4 className="font-semibold text-white">Continue exploring</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestionButtons.map((btn, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ scale: 1.02, x: 4 }}
            onClick={() => onSelect(btn.text)}
            className="flex items-center gap-3 p-3 bg-[#1E2139]/50 hover:bg-[#1E2139] rounded-lg border border-gray-700/50 hover:border-gray-600/50 text-left transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20 group-hover:from-orange-500/30 group-hover:to-amber-500/30 flex items-center justify-center">
              <btn.icon className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-gray-300 group-hover:text-white text-sm font-medium">{btn.text}</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-orange-400 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className={`flex bg-[#1E2139] text-white font-sans relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}>
      <FloatingParticles />
      
      {/* Left Sidebar */}
      <motion.div 
        className="w-80 bg-[#2A2D3A] p-6 flex flex-col gap-6 border-r border-gray-700/50 overflow-y-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{session.title}</h2>
            <p className="text-sm text-gray-400">AI-Powered Business Intelligence</p>
          </div>
          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </UiTooltipTrigger>
              <UiTooltipContent side="bottom">
                <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>
        </div>

        <AnimatePresence>
          {showSummary && session.summary && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SummaryCard 
                icon={<IndianRupee className="w-6 h-6 text-white" />} 
                title="Total Revenue" 
                value={`₹${session.summary.totalRevenue.toLocaleString('en-IN')}`} 
                subtitle="Overall Performance"
              />
              <SummaryCard 
                icon={<ShoppingBag className="w-6 h-6 text-white" />} 
                title="Total Orders" 
                value={session.summary.totalOrders.toLocaleString('en-IN')} 
                subtitle="Customer Transactions"
              />
              <SummaryCard 
                icon={<Star className="w-6 h-6 text-white" />} 
                title="Average Rating" 
                value={`${session.summary.averageRating.toFixed(1)} ⭐`} 
                subtitle="Customer Satisfaction"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          variant="outline" 
          onClick={() => setShowSummary(!showSummary)}
          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 rounded-lg"
        >
          <Layers className="w-4 h-4 mr-2" />
          {showSummary ? 'Hide Summary' : 'Show Summary'}
        </Button>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-green-300 font-medium text-sm">AI System Online</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-3xl ${msg.sender === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-6 rounded-xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white ml-12'
                          : 'bg-[#2A2D3A]/80 text-white border border-gray-700/50'
                      }`}
                    >
                      <div className="prose prose-invert max-w-none">
                        <Markdown 
                          components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-semibold text-white mb-3">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-medium text-white mb-2">{children}</h3>,
                            p: ({children}) => <p className="text-white/90 leading-relaxed mb-3 last:mb-0">{children}</p>,
                            strong: ({children}) => <strong className="text-orange-300 font-semibold">{children}</strong>,
                            ul: ({children}) => <ul className="list-disc list-inside text-white/90 space-y-1 mb-3">{children}</ul>,
                            li: ({children}) => <li className="text-white/80">{children}</li>,
                            code: ({children}) => <code className="bg-black/20 px-2 py-1 rounded text-orange-300 text-sm">{children}</code>
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>
                      
                      {msg.chartData && renderChart(msg.chartData)}
                      
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-blue-400" />
                            <h4 className="font-semibold text-white">AI Recommendations</h4>
                          </div>
                          <ul className="space-y-2">
                            {msg.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                                <Sparkles className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.insight && (
                        <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-green-400" />
                            <h4 className="font-semibold text-white">Key Insights</h4>
                          </div>
                          <p className="text-white/80 text-sm">{msg.insight}</p>
                        </div>
                      )}
                    </div>

                    {/* Show suggested questions only after AI responses */}
                    {msg.sender === 'assistant' && idx === messages.length - 1 && !isLoading && (
                      <SuggestedQuestions onSelect={handleSend} />
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700/50 p-6 bg-[#2A2D3A]/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  placeholder="Ask me anything about your business data..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  className="bg-[#1E2139] border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 text-base resize-none min-h-[48px]"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl px-4 py-3 h-12 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4 px-1">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-400" />
                  AI Ready
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-blue-400" />
                  Connected
                </div>
              </div>
              
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium AI
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;