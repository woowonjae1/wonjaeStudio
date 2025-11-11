#!/usr/bin/env node

/**
 * 实时搜索功能测试脚本
 * 测试 /api/chat/search 端点是否正常工作
 */

const http = require("http");

function testSearch(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/chat/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`\n✓ 搜索成功！`);
        console.log(`状态码: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`查询词: ${response.query}`);
          console.log(`结果数: ${response.count}`);
          console.log(`时间戳: ${response.timestamp}`);
          console.log(`\n前5个结果:`);
          response.results.slice(0, 5).forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.title}`);
            console.log(`   URL: ${result.url}`);
            console.log(`   描述: ${result.description}`);
            console.log(`   来源: ${result.source}`);
          });
        } catch (e) {
          console.log("响应:", data);
        }
        resolve();
      });
    });

    req.on("error", (e) => {
      console.error(`✗ 搜索失败: ${e.message}`);
      reject(e);
    });

    req.on("timeout", () => {
      console.error("✗ 搜索超时");
      req.destroy();
      reject(new Error("超时"));
    });

    req.setTimeout(20000);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("开始测试实时搜索功能...\n");

  const queries = [
    "latest AI developments 2025",
    "OpenAI GPT news",
    "machine learning trends",
  ];

  for (const query of queries) {
    console.log(`\n测试查询: "${query}"`);
    console.log("=".repeat(50));
    try {
      await testSearch(query);
      // 等待2秒再进行下一个搜索
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`测试失败: ${error.message}`);
    }
  }

  console.log("\n\n所有测试完成！");
}

runTests().catch(console.error);
