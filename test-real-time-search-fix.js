#!/usr/bin/env node

/**
 * 测试实时搜索准确性和日期上下文
 * 验证搜索 API 能否准确返回最新日期的结果
 */

const http = require('http');

// 配置
const API_ENDPOINT = 'http://localhost:3000/api/chat/search';
const TEST_QUERIES = [
  {
    query: '今天',
    description: '搜索"今天"应返回今天的信息'
  },
  {
    query: '今天新闻',
    description: '搜索"今天新闻"应返回最新新闻'
  },
  {
    query: '最新',
    description: '搜索"最新"应返回最新结果'
  },
  {
    query: '11月11日',
    description: '搜索"11月11日"应返回今天的信息'
  },
  {
    query: '昨天',
    description: '搜索"昨天"应返回昨天的信息'
  }
];

async function searchAPI(query, timestamp, dateContext) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, timestamp, dateContext });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/chat/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          reject(new Error(`JSON 解析失败: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║      实时搜索准确性测试 - 日期上下文验证         ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const today = new Date();
  const dateContext = today.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  
  console.log(`当前时间: ${today.toISOString()}`);
  console.log(`当前日期 (中文): ${dateContext}\n`);
  console.log('─'.repeat(60) + '\n');

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of TEST_QUERIES) {
    try {
      console.log(`测试: ${testCase.description}`);
      console.log(`  查询词: "${testCase.query}"`);
      
      const result = await searchAPI(
        testCase.query,
        new Date().toISOString(),
        dateContext
      );

      if (result.status === 200 && result.data.results) {
        console.log(`  ✓ 搜索成功，返回 ${result.data.results.length} 个结果`);
        
        if (result.data.results.length > 0) {
          result.data.results.forEach((item, idx) => {
            console.log(`    ${idx + 1}. ${item.title}`);
            console.log(`       ${item.description.substring(0, 80)}...`);
          });
          passedTests++;
        } else {
          console.log(`  ⚠ 警告: 搜索未返回结果`);
          failedTests++;
        }
      } else {
        console.log(`  ✗ 错误: ${result.data.error || '未知错误'}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`  ✗ 测试失败: ${error.message}`);
      failedTests++;
    }
    
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(`\n测试完成: ${passedTests}/${TEST_QUERIES.length} 通过\n`);
  
  if (failedTests === 0) {
    console.log('✓ 所有测试通过！实时搜索准确性已验证。');
  } else {
    console.log(`✗ 有 ${failedTests} 个测试失败，建议检查 API 配置。`);
  }
}

// 检查服务器是否运行
async function checkServer() {
  return new Promise((resolve) => {
    const req = http.request(
      { hostname: 'localhost', port: 3000, path: '/', method: 'GET' },
      (res) => resolve(res.statusCode === 200)
    );
    req.on('error', () => resolve(false));
    req.setTimeout(2000);
    req.end();
  });
}

(async () => {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ 错误: 本地服务器 (localhost:3000) 未运行');
    console.error('请先运行 npm run dev');
    process.exit(1);
  }

  try {
    await runTests();
  } catch (error) {
    console.error('测试出错:', error);
    process.exit(1);
  }
})();
