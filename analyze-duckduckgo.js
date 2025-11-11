#!/usr/bin/env node

/**
 * DuckDuckGo HTML 结构分析工具
 */

const https = require("https");

function fetchDuckDuckGoHtml() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "duckduckgo.com",
      path: "/html?q=AI",
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        // 获取前 5000 字符来分析结构
        console.log("=== DuckDuckGo HTML 前 5000 字符 ===\n");
        console.log(data.substring(0, 5000));
        console.log("\n\n=== 查找 <a> 标签 ===\n");

        // 查找所有 <a> 标签
        const aTagRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        let count = 0;

        while ((match = aTagRegex.exec(data)) && count < 10) {
          console.log(`${count + 1}. href="${match[1]}" text="${match[2]}"`);
          count++;
        }

        console.log("\n\n=== 查找 result 相关的 div ===\n");
        const divRegex = /<div[^>]*class="[^"]*result[^"]*"[^>]*>/g;
        match = divRegex.exec(data);
        if (match) {
          console.log("找到了 result 相关的 div:");
          console.log(match[0]);

          // 获取该 div 附近的 1000 字符
          const idx = match.index;
          console.log("\n附近的 HTML 结构:");
          console.log(
            data.substring(
              Math.max(0, idx - 200),
              Math.min(data.length, idx + 1000)
            )
          );
        } else {
          console.log("未找到 result 相关的 div");
        }

        resolve();
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("超时"));
    });

    req.end();
  });
}

fetchDuckDuckGoHtml().catch(console.error);
