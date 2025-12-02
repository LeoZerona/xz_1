/**
 * 古诗词API接口
 * 使用公开的API服务获取古诗词数据
 */

export interface PoetryApiResponse {
  status: string;
  data?: {
    content: string;
    origin: {
      title: string;
      dynasty: string;
      author: string;
      content: string[];
    };
    matchTags?: string[];
  };
  message?: string;
}

export interface PoetryApiListResponse {
  status: string;
  data?: Array<{
    content: string;
    origin: {
      title: string;
      dynasty: string;
      author: string;
      content: string[];
    };
  }>;
  message?: string;
}

/**
 * 获取随机古诗词
 * API: https://api.gushiwen.cn/api/shiwen/random
 */
export async function getRandomPoetry(): Promise<PoetryApiResponse> {
  try {
    // 使用备用API：天行数据的古诗词接口
    // 如果这个不可用，可以切换到其他API
    const response = await fetch('https://api.gushiwen.cn/api/shiwen/random', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取古诗词失败:', error);
    // 如果API失败，返回空数据
    return {
      status: 'error',
      message: '获取古诗词失败',
    };
  }
}

/**
 * 搜索古诗词
 * 使用公开的API服务，如果不可用则返回空数据（使用本地数据作为降级方案）
 */
export async function searchPoetry(params: {
  page?: number;
  pageSize?: number;
  author?: string;
  dynasty?: string;
  keyword?: string;
}): Promise<{
  list: Array<{
    id: string;
    title: string;
    author: string;
    dynasty: string;
    content: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const { page = 1, pageSize = 20, author, dynasty, keyword } = params;

    // 尝试使用多个API源
    const apiUrls = [
      // API源1: 古诗词网API（可能需要处理CORS）
      'https://api.gushiwen.cn/api/shiwen/random',
      // 可以添加更多API源
    ];

    for (const apiUrl of apiUrls) {
      try {
        // 创建超时控制器
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          // 转换API数据格式
          if (data.status === 'success' && data.data) {
            const items = Array.isArray(data.data) ? data.data : [data.data];
            const list = items.map((item: any, index: number) => ({
              id: `api_${Date.now()}_${index}`,
              title: item.origin?.title || item.title || '未知',
              author: item.origin?.author || item.author || '未知',
              dynasty: item.origin?.dynasty || item.dynasty || '未知',
              content: item.origin?.content?.join('\n') || item.content || '',
            }));

            // 应用筛选条件
            let filteredList = list;
            if (author) {
              filteredList = filteredList.filter(item => 
                item.author.includes(author)
              );
            }
            if (dynasty) {
              filteredList = filteredList.filter(item => 
                item.dynasty.includes(dynasty)
              );
            }
            if (keyword) {
              filteredList = filteredList.filter(item => 
                item.title.includes(keyword) || 
                item.content.includes(keyword) ||
                item.author.includes(keyword)
              );
            }

            // 应用分页
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const paginatedList = filteredList.slice(start, end);

            return {
              list: paginatedList,
              total: filteredList.length,
              page,
              pageSize,
            };
          }
        }
      } catch (apiError) {
        // 继续尝试下一个API
        console.warn(`API ${apiUrl} 不可用:`, apiError);
        continue;
      }
    }

    // 所有API都不可用时，返回空数据
    return {
      list: [],
      total: 0,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('搜索古诗词失败:', error);
    // 返回空数据，使用本地数据作为降级方案
    return {
      list: [],
      total: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };
  }
}

/**
 * 使用备用API：天行数据的古诗词接口
 * 需要API Key，这里提供一个示例
 */
export async function getPoetryFromTianAPI(params: {
  page?: number;
  pageSize?: number;
  author?: string;
  dynasty?: string;
}): Promise<{
  list: Array<{
    id: string;
    title: string;
    author: string;
    dynasty: string;
    content: string;
  }>;
  total: number;
}> {
  try {
    // 注意：这个API可能需要API Key，如果没有可以注释掉使用上面的API
    // 或者使用其他公开的API服务
    const response = await fetch('https://api.tianapi.com/txapi/shici/index', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code === 200 && data.newslist) {
      return {
        list: data.newslist.map((item: any, index: number) => ({
          id: `tian_${Date.now()}_${index}`,
          title: item.title || '未知',
          author: item.author || '未知',
          dynasty: item.dynasty || '未知',
          content: item.content || '',
        })),
        total: data.newslist.length,
      };
    }

    return {
      list: [],
      total: 0,
    };
  } catch (error) {
    console.error('从天行API获取古诗词失败:', error);
    return {
      list: [],
      total: 0,
    };
  }
}

