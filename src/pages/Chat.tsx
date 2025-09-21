import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';

interface ChatProps {
  businessSummary: BusinessSummary;
  businessData: {
    sales: SalesData[];
    inventory: InventoryData[];
    reviews: ReviewData[];
  };
}

const Chat: React.FC<ChatProps> = ({ businessSummary, businessData }) => {
  return (
    <div className="h-screen">
      <ChatInterface businessSummary={businessSummary} businessData={businessData} />
    </div>
  );
};

export default Chat;