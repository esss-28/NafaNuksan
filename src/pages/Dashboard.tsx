
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import DataUpload from '@/components/DataUpload';
import ChatView from '@/components/ChatView';
import DemoLoader from '@/components/DemoLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, MessageSquare, LogOut, Loader, Sparkles, 
  BarChart3, TrendingUp, Users, Database, IndianRupee, 
  UploadCloud, Brain, Zap, ChevronRight, X
} from 'lucide-react';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  summary: BusinessSummary;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [showNewAnalysis, setShowNewAnalysis] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'sessions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userSessions = snapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
  } as ChatSession;
});
      setSessions(userSessions);
      if (!activeSession && userSessions.length > 0) {
        setActiveSession(userSessions[0]);
      }
      setLoadingSessions(false);
    });
    return () => unsubscribe();
  }, [user, activeSession]);

  const handleNewAnalysis = async (summary: BusinessSummary, data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }) => {
    if (!user) return;
    const newSession = {
      title: `Analysis - ${new Date().toLocaleDateString()}`,
      createdAt: new Date(),
      summary,
    };
    const docRef = await addDoc(collection(db, 'users', user.uid, 'sessions'), newSession);
    
    // Store the detailed data in a sub-collection
    await setDoc(doc(db, 'users', user.uid, 'sessions', docRef.id, 'data', 'fullData'), data);

    setActiveSession({ id: docRef.id, ...newSession });
    setShowNewAnalysis(false);
  };

  const handleNewAnalysisClick = () => {
    setShowNewAnalysis(true);
    setActiveSession(null);
  };

  const handleLoadDemo = (summary: BusinessSummary, data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }) => {
    handleNewAnalysis(summary, data);
  };

  const formatDate = (timestamp: any): string => {
  try {
    let date: Date;
    
    // Handle different timestamp formats
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp?.toDate instanceof Function) {
      // Firestore Timestamp object
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      // Raw Firestore timestamp with seconds
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Fallback: try to create a date anyway
      date = new Date(timestamp);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`bg-gray-800/80 backdrop-blur-lg border-r border-gray-700/50 flex flex-col p-5 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}
      >
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                नफाNuksan
              </h2>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              onClick={handleNewAnalysisClick} 
              className="w-full mb-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> 
              New Analysis
            </Button>

            <h3 className="text-sm font-semibold text-gray-400 mb-3 px-2">Recent Sessions</h3>
          </motion.div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loadingSessions ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin text-orange-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <motion.button
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setActiveSession(session);
                    setShowNewAnalysis(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                    activeSession?.id === session.id 
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-white' 
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(session.createdAt)}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4 border-t border-gray-700/50 mt-4"
          >
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-gray-400">Premium Account</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => signOut(getAuth())}
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50 mt-2"
            >
              <LogOut className="w-4 h-4 mr-2" /> 
              Sign Out
            </Button>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {showNewAnalysis ? (
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-950 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 mb-4"
                >
                  <UploadCloud className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent mb-2">
                  Analyze Your Business Data
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Upload your business data or try our demo to get AI-powered insights tailored for Indian SMEs
                </p>
              </div>

              <DataUpload onComplete={handleNewAnalysis} />
              
              <div className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              </div>

              <DemoLoader onLoadDemo={handleLoadDemo} />
            </motion.div>
          </div>
        ) : activeSession ? (
          <ChatView session={activeSession} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-950">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 mb-6">
                <Brain className="w-12 h-12 text-amber-400" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                Welcome to नफाNuksan
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Your intelligent business co-pilot for Indian SMEs. Analyze sales, optimize inventory, and unlock growth opportunities with AI-powered insights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-2">
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                    </div>
                    <CardTitle className="text-lg">Sales Analysis</CardTitle>
                    <CardDescription className="text-gray-400">
                      Identify trends and opportunities
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-2">
                      <Database className="w-6 h-6 text-amber-400" />
                    </div>
                    <CardTitle className="text-lg">Inventory Optimization</CardTitle>
                    <CardDescription className="text-gray-400">
                      Smart stock management
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-yellow-400" />
                    </div>
                    <CardTitle className="text-lg">Customer Insights</CardTitle>
                    <CardDescription className="text-gray-400">
                      Understand your audience
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Button
                onClick={handleNewAnalysisClick}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30 px-8 py-6 text-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start New Analysis
              </Button>

              <p className="text-gray-500 mt-6">
                Already have data? Select a previous session from the sidebar
              </p>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;