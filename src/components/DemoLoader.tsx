import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Database, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getDemoBusinessSummary } from '@/lib/demo-data';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';

interface DemoLoaderProps {
  onLoadDemo: (summary: BusinessSummary, data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }) => void;
}

const DemoLoader: React.FC<DemoLoaderProps> = ({ onLoadDemo }) => {
  const handleLoadDemo = () => {
    const { summary, data } = getDemoBusinessSummary();
    onLoadDemo(summary, data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-8"
    >
      <Card className="business-card p-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-business rounded-full flex items-center justify-center mx-auto">
            <Database className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold">Try Demo Mode</h3>
          <p className="text-sm text-muted-foreground">
            Don't have data ready? Experience Vyaaparik with sample data from "Mumbai Fashion Hub"
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              100 Sales
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              6 Products
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              50 Reviews
            </div>
          </div>
          
          <Button 
            onClick={handleLoadDemo}
            variant="outline"
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Load Demo Data
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default DemoLoader;