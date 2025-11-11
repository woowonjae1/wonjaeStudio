import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  count: number;
  timestamp: string;
}

/**
 * 使用 Tavily Search API 进行搜索
 * 专为 AI 应用设计的搜索引擎
 * 
 * 文档: https://tavily.com/
 * API 密钥: 通过 TAVILY_API_KEY 环境变量配置
 */
async function tavilySearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.error('[Tavily] API 密钥未配置 (TAVILY_API_KEY)');
    throw new Error('Tavily API 密钥未配置');
  }

  try {
    console.log(`[Tavily] 开始搜索: "${query}"`);
    
    // 获取当前日期用于日志
    const today = new Date();
    const dateStr = today.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
    console.log(`[Tavily] 当前日期: ${dateStr} (${today.toISOString()})`);

    // 增强查询以获取最新结果 - 如果查询中不包含日期相关词，添加实时标记
    let enhancedQuery = query;
    const hasDateKeywords = /今天|昨天|明天|日期|日期|最新|实时|今日|月日|号|刚刚|刚才/i.test(query);
    if (hasDateKeywords && !query.toLowerCase().includes(dateStr.split('-').join('年').split('-').join('月'))) {
      enhancedQuery = `${query} ${dateStr}`;
      console.log(`[Tavily] 增强查询词: "${enhancedQuery}"`);
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: enhancedQuery,
        max_results: 5,
        include_answer: true,
        search_depth: 'advanced', // 使用高级搜索获取更实时的结果
        include_domains: [], // 可选：限制搜索域名
        exclude_domains: [], // 可选：排除的域名
        topic: 'general', // 一般新闻主题
      }),
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Tavily] API 错误 ${response.status}: ${errorText}`);
      throw new Error(`Tavily API 错误: ${response.status}`);
    }

    const data: any = await response.json();
    console.log(`[Tavily] 获得原始响应:`, data);

    const results: SearchResult[] = [];

    // 处理 Tavily API 响应
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((item: any) => {
        results.push({
          title: item.title || '搜索结果',
          url: item.url || '',
          description: item.content || item.description || '搜索结果',
          source: 'Tavily',
        });
      });
      console.log(`[Tavily] 成功解析 ${results.length} 个结果`);
    } else {
      console.warn('[Tavily] 响应中没有 results 字段');
    }

    return results;
  } catch (error) {
    console.error('[Tavily] 搜索失败:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * POST /api/chat/search
 * 执行网络搜索
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { query, timestamp, dateContext } = await request.json();

    if (!query) {
      return NextResponse.json(
        { 
          error: '搜索词为必填项',
          query: '',
          results: [],
          count: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (query.length > 200) {
      return NextResponse.json(
        { 
          error: '搜索词过长',
          query,
          results: [],
          count: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.log(`[搜索] 开始查询: "${query}"`);
    if (dateContext) {
      console.log(`[搜索] 日期上下文: ${dateContext}`);
    }
    if (timestamp) {
      console.log(`[搜索] 请求时间: ${timestamp}`);
    }

    // 执行搜索
    const results = await tavilySearch(query);

    const response: SearchResponse = {
      query,
      results,
      count: results.length,
      timestamp: new Date().toISOString(),
    };

    console.log(`[搜索] 完成，返回 ${results.length} 个结果\n`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[搜索] 错误:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '搜索失败',
        results: [],
        count: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/search
 * 获取搜索 API 状态
 */
export async function GET(): Promise<NextResponse> {
  const hasKey = !!process.env.TAVILY_API_KEY;
  
  return NextResponse.json({
    status: 'ready',
    provider: 'Tavily',
    configured: hasKey,
    message: hasKey 
      ? '✅ Tavily API 已配置' 
      : '❌ Tavily API 未配置',
  });
}