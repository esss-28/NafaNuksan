
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, doc, getDoc, onSnapshot, query, addDoc, 
  orderBy, serverTimestamp, Timestamp  // Add Timestamp here
} from 'firebase/firestore';
import { 
  Send, Bot, User, TrendingUp, BarChart3, Lightbulb, 
  Sparkles, Brain, IndianRupee, Zap, Shield, Target,
  X, Maximize2, Minimize2, BookOpen, FileText, Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { runAgenticQuery, type GeminiResponse } from '@/lib/gemini';
import { setFullData } from '@/lib/tools';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: GeminiResponse;
}

interface ChatInterfaceProps {
  businessSummary: BusinessSummary;
  businessData: {
    sales: SalesData[];
    inventory: InventoryData[];
    reviews: ReviewData[];
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ businessSummary, businessData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Make data available to tools
  useEffect(() => {
    setFullData(businessData);
  }, [businessData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `Namaste! Welcome to **नफाNuksan** - your intelligent business co-pilot. 🚀

I've analyzed your business data and I'm ready to help you make smarter decisions tailored for the Indian market.

### 📊 Your Business Snapshot
- **Total Revenue**: ₹${businessSummary.totalRevenue.toLocaleString('en-IN')}
- **Total Orders**: ${businessSummary.totalOrders}
- **Avg Order Value**: ₹${businessSummary.averageOrderValue.toFixed(0)}
- **Customer Rating**: ${businessSummary.averageRating.toFixed(1)}/5 ⭐

I can help you analyze sales trends, optimize inventory, understand customer feedback, and create growth strategies specifically for the Indian market.

What would you like to explore today?`,
      timestamp: new Date(),
      response: {
        insights: "Your business data has been successfully analyzed with a focus on Indian market dynamics",
        analysis: "I have comprehensive insights about your sales, inventory, and customer feedback ready for analysis",
        recommendations: [
          "Analyze sales performance by product category",
          "Identify inventory items needing restock",
          "Review customer sentiment trends",
          "Generate growth strategies for Indian market"
        ]
      }
    };
    setMessages([welcomeMessage]);
  }, [businessSummary]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const contextData = {
        businessSummary,
        sampleSalesData: businessData.sales.slice(0, 10),
        sampleInventoryData: businessData.inventory.slice(0, 10),
        sampleReviews: businessData.reviews.slice(0, 10)
      };

      const response = await runAgenticQuery(inputValue, contextData);

      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.analysis,
        timestamp: new Date(),
        response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try your question again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "AI Response Error",
        description: "Please try your question again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionButtons = [
    { 
      text: "Analyze my sales trends for last quarter", 
      icon: TrendingUp 
    },
    { 
      text: "Which products should I prioritize for restocking?", 
      icon: Database 
    },
    { 
      text: "Create a marketing strategy for Indian festivals", 
      icon: Target 
    },
    { 
      text: "How can I improve customer satisfaction?", 
      icon: Lightbulb 
    },
    { 
      text: "Generate a competitor analysis report", 
      icon: BarChart3 
    },
    { 
      text: "Suggest pricing optimizations for Indian market", 
      icon: IndianRupee 
    }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: `Welcome back! How can I assist with your business today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 300);
  };

  return (
    <div className={`flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-gradient-to-r from-orange-900/20 to-amber-900/10 backdrop-blur-lg p-4 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                नफाNuksan
              </h1>
              <p className="text-sm text-orange-300/80">Business Intelligence Co-Pilot</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Sales
              </Badge>
              <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                <Database className="w-3 h-3 mr-1" />
                Inventory
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                <Lightbulb className="w-3 h-3 mr-1" />
                Insights
              </Badge>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-orange-300 hover:text-orange-400 hover:bg-orange-500/20">
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={clearChat} className="text-orange-300 hover:text-orange-400 hover:bg-orange-500/20">
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Data Overview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block w-80 border-r bg-gradient-to-b from-orange-900/10 to-amber-900/5 p-6 overflow-y-auto"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-orange-300 mb-3">Business Overview</h2>
              <div className="space-y-3">
                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-200/80">Total Revenue</span>
                      <IndianRupee className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      ₹{businessSummary.totalRevenue.toLocaleString('en-IN')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-200/80">Avg Order Value</span>
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      ₹{businessSummary.averageOrderValue.toFixed(0)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-200/80">Customer Rating</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      {businessSummary.averageRating.toFixed(1)}/5
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-orange-300 mb-3">Quick Insights</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-900/10 border border-orange-500/20">
                  <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200/80">
                    <span className="font-medium text-amber-300">High Demand:</span> Coastal Explorer Yacht is your top seller but low in stock
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-900/10 border border-orange-500/20">
                  <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200/80">
                    <span className="font-medium text-amber-300">Customer Satisfaction:</span> 4.7/5 average rating with positive feedback on quality
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-900/10 border border-orange-500/20">
                  <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-200/80">
                    <span className="font-medium text-amber-300">Opportunity:</span> Festival season approaching - ideal for targeted marketing
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-orange-300 mb-3">Data Sources</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-orange-900/10">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-orange-200/80">Sales Records: {businessData.sales.length} entries</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-orange-900/10">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-orange-200/80">Inventory: {businessData.inventory.length} items</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-orange-900/10">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-orange-200/80">Customer Reviews: {businessData.reviews.length} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900/50 to-gray-950">
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
                      >
                        <Bot className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`max-w-2xl rounded-2xl p-5 ${message.type === 'user' 
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ml-12' 
                          : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/20 mr-12'
                        } shadow-lg`}
                      >
                        <div className="space-y-3">
                          {/* Message Header */}
                          <div className="flex items-center gap-2">
                            {message.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Brain className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="text-sm font-medium">
                              {message.type === 'user' ? 'You' : 'नफाNuksan'}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Message Content */}
                          <div className="prose prose-invert max-w-none">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>

                          {/* Recommendations */}
                          {message.response && message.response.recommendations && message.response.recommendations.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <h4 className="font-medium text-sm flex items-center gap-1 text-amber-400">
                                <Lightbulb className="w-4 h-4" />
                                Recommended Actions
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {message.response.recommendations.slice(0, 3).map((rec, index) => (
                                  <Button
                                    key={index}
                                    variant={message.type === 'ai' ? "outline" : "secondary"}
                                    size="sm"
                                    className="text-xs h-7 rounded-full border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                                    onClick={() => handleSuggestionClick(rec)}
                                  >
                                    {rec}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sources */}
                          {message.response && message.response.sources && message.response.sources.length > 0 && (
                            <div className="space-y-2 pt-2">
                              <h4 className="font-medium text-sm flex items-center gap-1 text-blue-400">
                                <FileText className="w-4 h-4" />
                                Sources
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {message.response.sources.slice(0, 3).map((source, index) => (
                                  <a
                                    key={index}
                                    href={source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-300 hover:text-blue-200 underline truncate max-w-xs"
                                  >
                                    Source {index + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>


                    {message.type === 'user' && (
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gray-600"
                      >
                        <User className="w-5 h-5 text-gray-300" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-orange-500/20 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-amber-300">Analyzing your business data...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 border-t bg-gradient-to-r from-orange-900/10 to-amber-900/5 backdrop-blur-sm"
            >
              <div className="max-w-3xl mx-auto">
                <p className="text-sm text-orange-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Try asking me:</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {suggestionButtons.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-left h-auto p-3 justify-start bg-orange-900/10 border-orange-500/30 text-orange-200 hover:bg-orange-500/20 hover:text-orange-100"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <suggestion.icon className="w-4 h-4 mr-2 text-amber-400" />
                        <span className="text-sm">{suggestion.text}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t bg-gradient-to-r from-orange-900/20 to-amber-900/10 backdrop-blur-lg sticky bottom-0"
          >
            <div className="max-w-3xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about sales, inventory, customer feedback, or growth strategies..."
                  className="h-12 text-base bg-gray-800/50 border-orange-500/30 focus:border-orange-400 text-white pl-4 pr-12"
                  disabled={isLoading}
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-12 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30"
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;