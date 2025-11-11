#!/usr/bin/env node

/**
 * 搜索 API 测试脚本
 * 用于测试搜索功能是否正常工作
 *
 * 使用方法:
 * node test-search-api.js
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";

// 颜色输出
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
  gray: "\x1b[90m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n📝 测试: ${testName}`, "bright");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

function logWarn(message) {
  log(`⚠️  ${message}`, "yellow");
}

// HTTP 请求辅助函数
function makeRequest(path, method = "GET", body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SearchAPITest/1.0",
      },
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers["Content-Length"] = Buffer.byteLength(bodyStr);
    }

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("请求超时"));
    });

    req.setTimeout(30000); // 30秒超时

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// 测试套件
const tests = [
  {
    name: "测试服务器连接",
    run: async () => {
      try {
        const result = await makeRequest("/api/chat/search", "GET");
        if (result.status === 200) {
          logSuccess("服务器连接正常");
          logInfo(`API 版本: ${result.body.status || "unknown"}`);
          return true;
        } else {
          logError(`服务器返回状态码: ${result.status}`);
          return false;
        }
      } catch (error) {
        logError(`无法连接到服务器: ${error.message}`);
        return false;
      }
    },
  },
  {
    name: "测试搜索 API 信息",
    run: async () => {
      try {
        const result = await makeRequest("/api/chat/search", "GET");
        if (result.body.providers) {
          logSuccess("获取 API 信息成功");

          logInfo("可用的搜索提供商:");
          Object.entries(result.body.providers).forEach(([key, provider]) => {
            const status = provider.status || "未知";
            console.log(`  - ${provider.name}: ${status}`);
          });

          return true;
        } else {
          logError("API 信息格式不正确");
          return false;
        }
      } catch (error) {
        logError(`获取 API 信息失败: ${error.message}`);
        return false;
      }
    },
  },
  {
    name: "测试 DuckDuckGo 搜索",
    run: async () => {
      try {
        const result = await makeRequest("/api/chat/search", "POST", {
          query: "Node.js",
        });

        if (result.status === 200) {
          const resultCount = result.body.results?.length || 0;
          if (resultCount > 0) {
            logSuccess(`搜索成功，找到 ${resultCount} 个结果`);
            log(`  查询: ${result.body.query}`, "blue");
            log(`  来源: ${result.body.results[0].source}`, "blue");
            log(`  第一个结果: ${result.body.results[0].title}`, "gray");
            return true;
          } else {
            logWarn("搜索返回空结果");
            return false;
          }
        } else {
          logError(`搜索失败，状态码: ${result.status}`);
          if (result.body.error) {
            logInfo(`错误: ${result.body.error}`);
          }
          return false;
        }
      } catch (error) {
        logError(`搜索失败: ${error.message}`);
        return false;
      }
    },
  },
  {
    name: "测试搜索中文查询",
    run: async () => {
      try {
        const result = await makeRequest("/api/chat/search", "POST", {
          query: "人工智能",
        });

        if (result.status === 200 && result.body.results.length > 0) {
          logSuccess("中文搜索成功");
          log(`  找到 ${result.body.results.length} 个结果`, "blue");
          return true;
        } else {
          logWarn("中文搜索返回空结果");
          return false;
        }
      } catch (error) {
        logError(`中文搜索失败: ${error.message}`);
        return false;
      }
    },
  },
  {
    name: "测试参数验证",
    run: async () => {
      try {
        const result = await makeRequest("/api/chat/search", "POST", {
          query: "",
        });

        if (result.status === 400) {
          logSuccess("参数验证工作正常");
          logInfo(`验证消息: ${result.body.error}`);
          return true;
        } else {
          logError(`参数验证失败，状态码: ${result.status}`);
          return false;
        }
      } catch (error) {
        logError(`参数验证测试失败: ${error.message}`);
        return false;
      }
    },
  },
  {
    name: "测试超长搜索词",
    run: async () => {
      try {
        const longQuery = "a".repeat(201);
        const result = await makeRequest("/api/chat/search", "POST", {
          query: longQuery,
        });

        if (result.status === 400) {
          logSuccess("超长搜索词验证工作正常");
          logInfo(`验证消息: ${result.body.error}`);
          return true;
        } else {
          logError(`超长搜索词验证失败`);
          return false;
        }
      } catch (error) {
        logError(`超长搜索词测试失败: ${error.message}`);
        return false;
      }
    },
  },
];

// 运行所有测试
async function runTests() {
  log("\n🚀 开始搜索 API 测试\n", "bright");
  logInfo(`测试 URL: ${BASE_URL}`);
  logInfo(`测试时间: ${new Date().toISOString()}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    logTest(test.name);
    try {
      const result = await test.run();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      logError(`测试异常: ${error.message}`);
      failed++;
    }
  }

  // 打印总结
  log("\n" + "=".repeat(50), "bright");
  log(`📊 测试总结`, "bright");
  log("=".repeat(50), "bright");
  log(`总共: ${tests.length} 个测试`, "blue");
  log(`通过: ${passed} 个`, "green");
  log(`失败: ${failed} 个`, "red");

  const passRate = ((passed / tests.length) * 100).toFixed(1);
  log(`成功率: ${passRate}%\n`, passed === tests.length ? "green" : "yellow");

  process.exit(failed === 0 ? 0 : 1);
}

// 启动测试
runTests().catch((error) => {
  logError(`测试脚本错误: ${error.message}`);
  process.exit(1);
});
