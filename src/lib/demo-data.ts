import { type SalesData, type InventoryData, type ReviewData, type BusinessSummary } from './data-processing';

export const generateDemoSalesData = (): SalesData[] => {
  const products = ['Blue Kurta', 'Red Saree', 'Cotton Shirt', 'Denim Jeans', 'Silk Dupatta', 'Woolen Shawl'];
  const categories = ['Ethnic', 'Western', 'Accessories'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'];
  
  const data: SalesData[] = [];
  const startDate = new Date('2024-08-01');
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 90));
    
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const basePrice = Math.floor(Math.random() * 2000) + 500;
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Product: product,
      Category: categories[Math.floor(Math.random() * categories.length)],
      Quantity: quantity,
      Amount: basePrice * quantity,
      Customer_Age: Math.floor(Math.random() * 40) + 20,
      Location: locations[Math.floor(Math.random() * locations.length)]
    });
  }
  
  return data;
};

export const generateDemoInventoryData = (): InventoryData[] => {
  const products = ['Blue Kurta', 'Red Saree', 'Cotton Shirt', 'Denim Jeans', 'Silk Dupatta', 'Woolen Shawl'];
  const categories = ['Ethnic', 'Western', 'Accessories'];
  const suppliers = ['Fashion_Co', 'Style_Hub', 'Trend_Makers', 'Elite_Fashion'];
  
  return products.map(product => ({
    Product: product,
    Category: categories[Math.floor(Math.random() * categories.length)],
    Stock: Math.floor(Math.random() * 50) + 5,
    Price: Math.floor(Math.random() * 2000) + 500,
    Supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    Min_Alert: Math.floor(Math.random() * 10) + 5
  }));
};

export const generateDemoReviewData = (): ReviewData[] => {
  const products = ['Blue Kurta', 'Red Saree', 'Cotton Shirt', 'Denim Jeans', 'Silk Dupatta', 'Woolen Shawl'];
  const platforms = ['Google', 'Facebook', 'Website', 'Amazon'];
  
  const positiveReviews = [
    'Excellent quality and fast delivery!',
    'Great product, highly recommended',
    'Good value for money',
    'Beautiful design and comfortable fit',
    'Amazing customer service',
    'Perfect for festive occasions'
  ];
  
  const negativeReviews = [
    'Product quality could be better',
    'Delivery was delayed',
    'Not as shown in pictures',
    'Expensive for the quality',
    'Size was not accurate',
    'Customer support needs improvement'
  ];
  
  const data: ReviewData[] = [];
  const startDate = new Date('2024-08-01');
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 90));
    
    const rating = Math.floor(Math.random() * 5) + 1;
    const isPositive = rating >= 4;
    const reviewTexts = isPositive ? positiveReviews : negativeReviews;
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Rating: rating,
      Review: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      Product: products[Math.floor(Math.random() * products.length)],
      Platform: platforms[Math.floor(Math.random() * platforms.length)]
    });
  }
  
  return data;
};

export const getDemoBusinessSummary = (): {
  summary: BusinessSummary;
  data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] };
} => {
  const sales = generateDemoSalesData();
  const inventory = generateDemoInventoryData();
  const reviews = generateDemoReviewData();
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.Amount, 0);
  const totalOrders = sales.length;
  const averageOrderValue = totalRevenue / totalOrders;
  
  const productRevenue = sales.reduce((acc, sale) => {
    acc[sale.Product] = (acc[sale.Product] || 0) + sale.Amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topProducts = Object.entries(productRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([product, revenue]) => ({ product, revenue }));
  
  const lowStockItems = inventory
    .filter(item => item.Stock < item.Min_Alert!)
    .sort((a, b) => a.Stock - b.Stock)
    .slice(0, 5)
    .map(item => ({ product: item.Product, stock: item.Stock }));
  
  const averageRating = reviews.reduce((sum, review) => sum + review.Rating, 0) / reviews.length;
  
  const summary: BusinessSummary = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topProducts,
    lowStockItems,
    averageRating,
    sentimentScore: 0.3 // Slightly positive
  };
  
  return {
    summary,
    data: { sales, inventory, reviews }
  };
};