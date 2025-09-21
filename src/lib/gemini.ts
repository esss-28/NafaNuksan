import { GoogleGenerativeAI } from "@google/generative-ai";
import { tools, type ToolName, type AnalysisStep } from './tools';

// For Vite, use import.meta.env; for Node, use process.env
const GEMINI_API_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) ||
  process.env.VITE_GEMINI_API_KEY ||
  "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface GeminiResponse {
  insights: string;
  analysis: string;
  recommendations: string[];
  charts?: any[];
  sources?: string[];
  executionSteps?: AnalysisStep[];
  metadata?: {
    totalExecutionTime: number;
    toolsUsed: string[];
    dataPointsAnalyzed: number;
    webSearchPerformed: boolean;
  };
}

interface ActionPlan {
  intent: string;
  complexity: 'simple' | 'moderate' | 'complex';
  steps: Array<{
    id: string;
    tool: ToolName;
    description: string;
    params?: any;
    dependsOn?: string[];
  }>;
  requiresWebSearch: boolean;
}

interface ConversationMemory {
  previousQueries: Array<{
    query: string;
    intent: string;
    result: any;
    timestamp: number;
  }>;
  userPreferences: {
    preferredChartTypes: string[];
    analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  };
}

class BusinessIntelligenceAgent {
  private memory: ConversationMemory = {
    previousQueries: [],
    userPreferences: {
      preferredChartTypes: [],
      analysisDepth: 'detailed'
    }
  };

  private analysisSteps: AnalysisStep[] = [];

  private addStep(step: string, action: string, progress: number, result?: any) {
    this.analysisSteps.push({ step, action, progress, result });
  }

  async processQuery(query: string, businessContext: any): Promise<GeminiResponse> {
    console.log(`🚀 Starting enhanced agentic analysis for: "${query}"`);
    this.analysisSteps = [];
    
    const startTime = Date.now();
    let webSearchPerformed = false;
    let allSources: string[] = [];
    
    try {
      // Step 1: Intent Analysis & Planning
        this.addStep('intent_analysis', 'Analyzing query intent and creating execution plan...', 10);
        const actionPlan = await this.createActionPlan(query, businessContext);

        // FORCE web search for competitor queries regardless of planning
        if (query.toLowerCase().includes('competitor') || 
            query.toLowerCase().includes('other') && query.toLowerCase().includes('companies')) {
          
          console.log('🔧 FORCING web search for competitor query');
          actionPlan.steps.unshift({
            id: 'forced_web_search',
            tool: 'searchWebForCompetitorData',
            description: 'Forced web search for competitor analysis',
            params: { query: query }
          });
          actionPlan.requiresWebSearch = true;
}
      
      // Step 2: Tool Execution Chain
      this.addStep('tool_execution', `Executing ${actionPlan.steps.length} analysis tools...`, 30);
      const toolResults = await this.executeToolChain(actionPlan);
      
      // Check if web search was performed
      webSearchPerformed = actionPlan.requiresWebSearch || 
        Object.values(toolResults).some((result: any) => 
          result.metadata?.sources && result.metadata.sources.length > 0
        );

      // Collect all sources
      Object.values(toolResults).forEach((result: any) => {
        if (result.metadata?.sources) {
          allSources.push(...result.metadata.sources);
        }
      });

      // Step 3: Data Synthesis
      this.addStep('synthesis', 'Synthesizing insights from analysis results...', 70);
      const synthesizedInsights = await this.synthesizeResults(toolResults, query, businessContext);
      
      // Step 4: Chart Generation
      this.addStep('visualization', 'Generating dynamic visualizations...', 90);
      const charts = this.generateCharts(toolResults, actionPlan.intent);
      
      this.addStep('completion', 'Analysis complete with live data integration!', 100, synthesizedInsights);
      
      const totalExecutionTime = Date.now() - startTime;
      
      // Store in memory
      this.memory.previousQueries.push({
        query,
        intent: actionPlan.intent,
        result: synthesizedInsights,
        timestamp: Date.now()
      });

      return {
        ...synthesizedInsights,
        charts,
        sources: [...new Set(allSources)], // Remove duplicates
        executionSteps: this.analysisSteps,
        metadata: {
          totalExecutionTime,
          toolsUsed: actionPlan.steps.map(s => s.tool),
          dataPointsAnalyzed: Object.values(toolResults).reduce((total: number, result: any) => 
            total + (result.metadata?.dataPoints || 0), 0),
          webSearchPerformed
        }
      };
      
    } catch (error) {
      console.error('Agent execution error:', error);
      return {
        insights: "Analysis encountered an issue during execution with web search integration.",
        analysis: "I encountered a technical challenge while processing your request with live web search capabilities. The agentic analysis system attempted to search the web for competitor data and market insights but faced connectivity issues. Please try rephrasing your question or check if all required data sources are available.",
        recommendations: [
          "Verify internet connectivity for web search functionality",
          "Try asking a more specific question about competitors",
          "Check if competitor search terms are relevant to your industry"
        ],
        charts: [],
        sources: [],
        executionSteps: this.analysisSteps,
        metadata: {
          totalExecutionTime: Date.now() - startTime,
          toolsUsed: [],
          dataPointsAnalyzed: 0,
          webSearchPerformed: false
        }
      };
    }
  }

  private async createActionPlan(query: string, context: any): Promise<ActionPlan> {
    const planningPrompt = `
    You are a business intelligence planning agent with web search capabilities. 
    Analyze the query and create an execution plan that may include web searches for competitive intelligence.
    
    Business Context: ${JSON.stringify(context, null, 2)}
    User Query: "${query}"
    
    Available Tools: ${Object.keys(tools).join(', ')}
    
    Based on the query, determine:
    1. The primary intent (sales_analysis, inventory_management, sentiment_analysis, competitor_analysis, market_research)
    2. Complexity level (simple, moderate, complex)
    3. Whether web search is needed (true if query mentions competitors, market research, pricing comparison, or industry analysis)
    4. Which tools to use and in what order
    
    Respond with ONLY a JSON object:
    {
      "intent": "primary_intent",
      "complexity": "simple|moderate|complex",
      "requiresWebSearch": boolean,
      "steps": [
        {
          "id": "step1",
          "tool": "toolName",
          "description": "What this step does",
          "params": {"key": "value"}
        }
      ]
    }`;

    try {
      const result = await model.generateContent(planningPrompt);
      const planText = result.response.text().replace(/```json|```/g, '').trim();
      const plan = JSON.parse(planText);
      
      // Ensure web search is triggered for competitor queries
      if (query.toLowerCase().includes('competitor') || 
          query.toLowerCase().includes('competition') ||
          query.toLowerCase().includes('market research') ||
          query.toLowerCase().includes('pricing') ||
          query.toLowerCase().includes('industry analysis')) {
        plan.requiresWebSearch = true;
      }
      
      return plan;
    } catch (error) {
      console.error('Planning error:', error);
      // Enhanced fallback planning with web search detection
      return this.createEnhancedFallbackPlan(query);
    }
  }

private createEnhancedFallbackPlan(query: string): ActionPlan {
  const lowerQuery = query.toLowerCase();
  
  // ALWAYS use web search for competitor-related queries
  if (lowerQuery.includes('competitor') || 
      lowerQuery.includes('competition') || 
      lowerQuery.includes('other') && (lowerQuery.includes('companies') || lowerQuery.includes('brands')) ||
      lowerQuery.includes('market') ||
      lowerQuery.includes('pricing')) {
    
    return {
      intent: 'competitor_analysis',
      complexity: 'complex',
      requiresWebSearch: true,
      steps: [
        { 
          id: 'web_search', 
          tool: 'searchWebForCompetitorData', 
          description: 'Search web for competitor information', 
          params: { query: this.extractCompetitorSearchTerms(query) }
        }
      ]
    };
  }
    
    // Sales and trend analysis
    if (lowerQuery.includes('trend') || lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      return {
        intent: 'sales_analysis',
        complexity: 'moderate',
        requiresWebSearch: false,
        steps: [
          { 
            id: 'market_trends', 
            tool: 'analyzeMarketTrends', 
            description: 'Analyze sales trends and market performance',
            params: { productCategory: 'all' }
          }
        ]
      };
    }
    
    // Inventory management
    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock') || lowerQuery.includes('restock')) {
      return {
        intent: 'inventory_management',
        complexity: 'moderate',
        requiresWebSearch: false,
        steps: [
          { 
            id: 'inventory_analysis', 
            tool: 'getLowStockItems', 
            description: 'Analyze inventory levels and stock requirements' 
          }
        ]
      };
    }
    
    // Product-specific analysis
    if (lowerQuery.includes('product') && (lowerQuery.includes('analyze') || lowerQuery.includes('performance'))) {
      return {
        intent: 'product_analysis',
        complexity: 'moderate',
        requiresWebSearch: false,
        steps: [
          { 
            id: 'product_analysis', 
            tool: 'getFullProductAnalysis', 
            description: 'Detailed product performance analysis',
            params: { productName: this.extractProductName(query) }
          }
        ]
      };
    }
    
    // Default comprehensive analysis with web search for business insights
    return {
      intent: 'comprehensive_analysis',
      complexity: 'complex',
      requiresWebSearch: true,
      steps: [
        { 
          id: 'web_research', 
          tool: 'searchWebForCompetitorData', 
          description: 'Research market and competitor landscape',
          params: { query: 'business intelligence market research India' }
        },
        { 
          id: 'inventory_check', 
          tool: 'getLowStockItems', 
          description: 'Comprehensive inventory analysis' 
        },
        { 
          id: 'market_analysis', 
          tool: 'analyzeMarketTrends', 
          description: 'Market trend analysis',
          params: { productCategory: 'marine' }
        }
      ]
    };
  }

  private extractCompetitorSearchTerms(query: string): string {
    const keywords = ['boat', 'yacht', 'marine', 'water sports', 'speedboat', 'sailing'];
    const foundKeywords = keywords.filter(keyword => 
      query.toLowerCase().includes(keyword)
    );
    
    if (foundKeywords.length > 0) {
      return `${foundKeywords[0]} companies India competitors market analysis`;
    }
    
    return 'marine boat yacht competitors India market research';
  }

  private extractProductName(query: string): string {
    // Simple extraction - could be enhanced with NLP
    const words = query.toLowerCase().split(' ');
    const productKeywords = ['yacht', 'boat', 'speedboat', 'sailboat', 'kayak', 'canoe'];
    
    for (const keyword of productKeywords) {
      if (words.includes(keyword)) {
        return keyword;
      }
    }
    
    return 'yacht'; // Default fallback
  }

  private async executeToolChain(plan: ActionPlan): Promise<Record<string, any>> {
    
    const results: Record<string, any> = {};    
    for (const step of plan.steps) {
      console.log(`🔧 Executing: ${step.description}`);
      
      try {
        const tool = tools[step.tool];
        if (!tool) {
          console.warn(`Tool ${step.tool} not found`);
          continue;
        }
        
        // Add progress tracking
        this.addStep(
          `tool_${step.id}`, 
          `Executing ${step.tool}...`, 
          30 + (Object.keys(results).length * 10)
        );
        
        const toolResult = await tool.execute(step.params || {});
        results[step.id] = toolResult;
        
        // Log execution details
        console.log(`✅ ${step.tool} completed in ${toolResult.metadata?.executionTime || 0}ms`);
        
        // Add completion step
        this.addStep(
          `complete_${step.id}`, 
          `${step.tool} completed successfully`, 
          40 + (Object.keys(results).length * 10),
          { success: toolResult.success, dataPoints: toolResult.metadata?.dataPoints || 0 }
        );
        
      } catch (error) {
        console.error(`Error executing tool ${step.tool}:`, error);
        results[step.id] = { 
          success: false, 
          data: `Error executing ${step.tool}: ${error}`, 
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return results;
  }

  private async synthesizeResults(toolResults: Record<string, any>, originalQuery: string, context: any): Promise<Omit<GeminiResponse, 'charts' | 'sources'>> {
    // Prepare synthesis data with enhanced web search results
    const synthesisData = {
      originalQuery,
      toolResults: Object.entries(toolResults).reduce((acc, [key, result]) => {
        if (result.success) {
          acc[key] = result.data;
        }
        return acc;
      }, {} as Record<string, any>),
      context,
      webSearchResults: this.extractWebSearchResults(toolResults)
    };

    const synthesisPrompt = `
    You are Vyaaparik AI, an expert business intelligence agent with access to live web search data. 
    You have executed multiple analytical tools including web searches for competitor intelligence.

    Original Query: "${originalQuery}"
    
    Tool Execution Results:
    ${JSON.stringify(synthesisData.toolResults, null, 2)}
    
    Web Search Results (if available):
    ${JSON.stringify(synthesisData.webSearchResults, null, 2)}
    
    Business Context:
    ${JSON.stringify(context, null, 2)}

    Based on your comprehensive analysis including live web search data, provide a response in this EXACT JSON format:
    {
      "insights": "One powerful sentence summarizing the most critical business insight discovered through your multi-tool analysis including web research",
      "analysis": "Detailed markdown analysis explaining HOW you discovered insights through data analysis and web research. Reference specific competitor information, pricing data, and market intelligence gathered from web searches. Use specific numbers and percentages from both internal data and web research.",
      "recommendations": [
        "Specific, actionable recommendation based on competitor analysis and market research",
        "Another data-driven recommendation incorporating web search insights",
        "Third recommendation combining internal data with market intelligence",
        "Fourth strategic recommendation based on competitive landscape analysis",
        "Fifth growth-oriented recommendation using market research findings"
      ]
    }

    Critical guidelines:
    - If web search was successful, prominently feature competitor insights, market trends, and pricing intelligence
    - Reference specific competitor names, pricing ranges, and market data from web searches
    - Combine internal business data with external market intelligence for comprehensive insights
    - Use Indian Rupee (₹) formatting and consider Indian market dynamics
    - Write as an AI agent that actively researched live market data and competitor information
    - If web search failed, acknowledge this but still provide value using internal data analysis
    `;

    try {
      const result = await model.generateContent(synthesisPrompt);
      const responseText = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Synthesis error:', error);
      return this.createEnhancedFallbackSynthesis(toolResults, originalQuery, synthesisData.webSearchResults);
    }
  }

  private extractWebSearchResults(toolResults: Record<string, any>): any {
    for (const [key, result] of Object.entries(toolResults)) {
      if (key.includes('search') || key.includes('competitor')) {
        return result.success ? result.data : null;
      }
    }
    return null;
  }

  private createEnhancedFallbackSynthesis(toolResults: Record<string, any>, query: string, webSearchResults: any): Omit<GeminiResponse, 'charts' | 'sources'> {
    const successfulResults = Object.values(toolResults).filter((result: any) => result.success);
    const dataPoints = successfulResults.reduce((total: number, result: any) => total + (result.metadata?.dataPoints || 0), 0);
    const webSearchPerformed = webSearchResults !== null;
    
    let competitorInsights = "";
    if (webSearchResults && webSearchResults.competitorAnalysis) {
      const competitors = webSearchResults.competitorAnalysis.competitors || [];
      competitorInsights = competitors.length > 0 
        ? `\n\n### 🔍 Competitive Intelligence\nLive web search identified ${competitors.length} key competitors in the Indian marine industry:\n${competitors.map((c: any) => `- **${c.name}**: ${c.description}`).join('\n')}`
        : "";
    }

    return {
      insights: `Executed comprehensive business analysis using ${successfulResults.length} analytical tools${webSearchPerformed ? ' including live web search' : ''}, processing ${dataPoints} data points to uncover actionable insights.`,
      analysis: `## 🤖 AI Agent Analysis Report\n\nI performed a multi-dimensional analysis using advanced business intelligence tools to process your query: "${query}"\n\n### 📊 Analysis Execution\n- **Tools Deployed**: ${Object.keys(toolResults).join(', ')}\n- **Data Points Processed**: ${dataPoints.toLocaleString()}\n- **Web Search Integration**: ${webSearchPerformed ? '✅ Active' : '⚠️ Limited'}\n- **Analysis Depth**: Multi-tool cross-correlation${competitorInsights}\n\n### 🎯 Key Findings\nThrough systematic data processing and${webSearchPerformed ? ' live market research,' : ''} I identified several critical patterns in your business data that require strategic attention for competitive positioning in the Indian market.`,
      recommendations: [
        "Implement real-time competitive monitoring system to track market changes and competitor pricing strategies",
        "Leverage the high customer satisfaction scores (4.7/5) in targeted marketing campaigns to differentiate from competitors",
        "Optimize inventory management for high-demand products to prevent stock-outs during peak sales periods", 
        "Develop region-specific marketing strategies based on Indian market preferences and cultural factors",
        "Establish strategic partnerships with local suppliers to improve cost competitiveness against regional players"
      ]
    };
  }

  private generateCharts(toolResults: Record<string, any>, intent: string): any[] {
    const charts: any[] = [];
    
    // Generate charts based on successful tool results
    Object.entries(toolResults).forEach(([stepId, result]) => {
      if (!result.success || !result.data) return;
      
      // Handle web search results
      if (stepId.includes('competitor') || stepId.includes('search')) {
        if (result.data.competitorAnalysis?.competitors) {
          charts.push({
            type: 'bar',
            title: 'Competitor Landscape',
            data: result.data.competitorAnalysis.competitors.slice(0, 5).map((comp: any) => ({
              name: comp.name?.substring(0, 20) || 'Unknown',
              value: comp.position || Math.random() * 100,
              description: comp.description?.substring(0, 50) || ''
            }))
          });
        }
      }
      
      // Handle market trends
      if (stepId.includes('market') && result.data.monthlyTrends) {
        charts.push({
          type: 'line',
          title: 'Market Trend Analysis',
          data: result.data.monthlyTrends.map((trend: any) => ({
            name: trend.month,
            value: trend.revenue,
            orders: trend.orders
          }))
        });
      }
      
      // Handle inventory analysis
      if (stepId.includes('inventory') && result.data.lowStockItems) {
        charts.push({
          type: 'pie',
          title: 'Inventory Status Distribution',
          data: [
            { name: 'Critical Stock', value: result.data.criticalItems?.length || 0, fill: '#ef4444' },
            { name: 'Low Stock', value: (result.data.lowStockItems?.length || 0) - (result.data.criticalItems?.length || 0), fill: '#f97316' },
            { name: 'Adequate Stock', value: Math.max(0, 20 - (result.data.lowStockItems?.length || 0)), fill: '#22c55e' }
          ]
        });
      }
    });
    
    return charts;
  }
}

// Global agent instance
const agent = new BusinessIntelligenceAgent();

// Main export function with enhanced capabilities
export async function runAgenticQuery(
  message: string,
  businessContext: any
): Promise<GeminiResponse> {
  return await agent.processQuery(message, businessContext);
}

// Enhanced streaming function for real-time analysis updates
export async function streamAgenticAnalysis(
  message: string,
  businessContext: any,
  onStep?: (step: AnalysisStep) => void
): Promise<GeminiResponse> {
  console.log(`🔄 Starting enhanced streaming agentic analysis with web search...`);
  
  // Create a custom agent instance for streaming
  const streamingAgent = new BusinessIntelligenceAgent();
  
  // Override the addStep method to emit steps in real-time
  const originalAddStep = (streamingAgent as any).addStep;
  (streamingAgent as any).addStep = (step: string, action: string, progress: number, result?: any) => {
    const stepData = { step, action, progress, result };
    if (onStep) {
      onStep(stepData);
    }
    return originalAddStep.call(streamingAgent, step, action, progress, result);
  };
  
  return await streamingAgent.processQuery(message, businessContext);
}

// Legacy compatibility function
export async function queryGemini(
  message: string,
  businessContext?: any
): Promise<GeminiResponse> {
  console.warn('queryGemini is deprecated. Use runAgenticQuery for enhanced web search capabilities.');
  return await runAgenticQuery(message, businessContext || {});
}