import Papa from 'papaparse';

export interface SalesData {
  Date: string;
  Product: string;
  Category: string;
  Quantity: number;
  Amount: number;
  Customer_Age?: number;
  Location?: string;
}

export interface InventoryData {
  Product: string;
  Category: string;
  Stock: number;
  Price: number;
  Supplier?: string;
  Min_Alert?: number;
}

export interface ReviewData {
  Date: string;
  Rating: number;
  Review: string;
  Product: string;
  Platform?: string;
}

export interface BusinessSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ product: string; revenue: number }>;
  lowStockItems: Array<{ product: string; stock: number }>;
  averageRating: number;
  sentimentScore: number;
}

export function parseCsvFile<T>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value, header) => {
        // Convert numeric fields
        if (typeof header === 'string' && ['Quantity', 'Amount', 'Stock', 'Price', 'Rating', 'Customer_Age', 'Min_Alert'].includes(header)) {
          const num = parseFloat(value);
          return isNaN(num) ? value : num;
        }
        return value;
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve(results.data as T[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function generateBusinessSummary(
  salesData: SalesData[], 
  inventoryData: InventoryData[], 
  reviewData: ReviewData[]
): BusinessSummary {
  // Calculate total revenue and orders
  const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.Amount || 0), 0);
  const totalOrders = salesData.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top products by revenue
  const productRevenue = salesData.reduce((acc, sale) => {
    const product = sale.Product;
    acc[product] = (acc[product] || 0) + (sale.Amount || 0);
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([product, revenue]) => ({ product, revenue }));

  // Low stock items
  const lowStockItems = inventoryData
    .filter(item => item.Stock < (item.Min_Alert || 5))
    .sort((a, b) => a.Stock - b.Stock)
    .slice(0, 10)
    .map(item => ({ product: item.Product, stock: item.Stock }));

  // Average rating and sentiment
  const totalRating = reviewData.reduce((sum, review) => sum + (review.Rating || 0), 0);
  const averageRating = reviewData.length > 0 ? totalRating / reviewData.length : 0;

  // Simple sentiment analysis (basic keywords)
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing'];
  
  let sentimentScore = 0;
  reviewData.forEach(review => {
    const text = review.Review.toLowerCase();
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    sentimentScore += (positiveCount - negativeCount);
  });

  // Normalize sentiment score (-1 to 1)
  const normalizedSentiment = reviewData.length > 0 ? 
    Math.max(-1, Math.min(1, sentimentScore / reviewData.length)) : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topProducts,
    lowStockItems,
    averageRating,
    sentimentScore: normalizedSentiment
  };
}

export function validateSalesData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['Date', 'Product', 'Quantity', 'Amount'];

  if (data.length === 0) {
    errors.push('No data found in the file');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  requiredFields.forEach(field => {
    if (!(field in firstRow)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Check data types
  data.slice(0, 5).forEach((row, index) => {
    if (row.Quantity && isNaN(Number(row.Quantity))) {
      errors.push(`Row ${index + 1}: Quantity must be a number`);
    }
    if (row.Amount && isNaN(Number(row.Amount))) {
      errors.push(`Row ${index + 1}: Amount must be a number`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateInventoryData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['Product', 'Stock', 'Price'];

  if (data.length === 0) {
    errors.push('No data found in the file');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  requiredFields.forEach(field => {
    if (!(field in firstRow)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateReviewData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['Date', 'Rating', 'Review', 'Product'];

  if (data.length === 0) {
    errors.push('No data found in the file');
    return { valid: false, errors };
  }

  const firstRow = data[0];
  requiredFields.forEach(field => {
    if (!(field in firstRow)) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return { valid: errors.length === 0, errors };
}