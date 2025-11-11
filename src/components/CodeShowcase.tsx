import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaCode } from "react-icons/fa";
import Image from "next/image";

interface CodeSnippet {
  title: string;
  description: string;
  code: string;
  category: "AI" | "Development" | "Innovation";
  logo?: string;
}

const codeSnippets: CodeSnippet[] = [
  {
    title: "Claude 3.5 Sonnet",
    description: "2025最强AI模型，编程和推理能力顶尖",
    code: 'import Anthropic from "@anthropic-ai/sdk";\n\nconst client = new Anthropic();\nconst message = await client.messages.create({\n  model: "claude-3-5-sonnet-20241022",\n  max_tokens: 1024,\n  messages: [{ role: "user", content: "Hello" }]\n});',
    category: "AI",
    logo: "https://www.anthropic.com/images/icons/safari-pinned-tab.svg",
  },
  {
    title: "Llama 3.3 70B",
    description: "Meta最新开源模型，性能匹敌GPT-4",
    code: 'import ollama from "ollama";\n\nconst response = await ollama.chat({\n  model: "llama3.3:70b",\n  messages: [{ role: "user", content: "Hello" }]\n});',
    category: "AI",
  },
  {
    title: "DeepSeek-V3",
    description: "671B参数MoE架构，开源可商用",
    code: 'const response = await fetch("https://api.deepseek.com/v1/chat/completions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer KEY" },\n  body: JSON.stringify({ model: "deepseek-chat", messages: [] })\n});',
    category: "AI",
  },
  {
    title: "Gemini 2.0 Flash",
    description: "Google多模态AI，支持实时视频理解",
    code: 'import { GoogleGenerativeAI } from "@google/generative-ai";\n\nconst genAI = new GoogleGenerativeAI();\nconst model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });\nconst result = await model.generateContent("Hello");',
    category: "AI",
  },
  {
    title: "o3 - OpenAI",
    description: "推理模型，数学和编程能力极强",
    code: 'import OpenAI from "openai";\n\nconst openai = new OpenAI();\nconst completion = await openai.chat.completions.create({\n  model: "o3-mini",\n  messages: [{ role: "user", content: "Solve this" }]\n});',
    category: "AI",
  },
  {
    title: "React 19",
    description: "Actions、use()、编译器优化",
    code: 'import { use } from "react";\n\nfunction UserProfile({ userPromise }) {\n  const user = use(userPromise);\n  return <h1>{user.name}</h1>;\n}',
    category: "Development",
  },
  {
    title: "Next.js 15",
    description: "Turbopack稳定版，React 19支持",
    code: 'export default {\n  experimental: {\n    ppr: "incremental",\n    reactCompiler: true\n  }\n};',
    category: "Development",
  },
  {
    title: "Bun 1.2",
    description: "比Node.js快5倍，内置SQLite",
    code: 'Bun.serve({\n  port: 3000,\n  fetch(req) {\n    return new Response("Hello from Bun!");\n  }\n});',
    category: "Development",
  },
  {
    title: "Deno 2.1",
    description: "完全兼容Node.js，更安全",
    code: 'import express from "npm:express@4";\n\nconst app = express();\napp.get("/", (req, res) => {\n  res.json({ message: "Deno 2.1" });\n});',
    category: "Development",
  },
  {
    title: "Vite 6",
    description: "环境API，HMR性能提升50%",
    code: 'import { defineConfig } from "vite";\n\nexport default defineConfig({\n  plugins: [react()],\n  environments: { client: {}, ssr: {} }\n});',
    category: "Development",
  },
  {
    title: "Supabase Edge Functions",
    description: "Deno运行时边缘函数",
    code: 'import { serve } from "https://deno.land/std/http/server.ts";\n\nserve(async (req) => {\n  const data = await supabaseClient.from("users").select();\n  return new Response(JSON.stringify(data));\n});',
    category: "Development",
  },
];

const CodeShowcase: React.FC = () => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codeSnippets.map((snippet, index) => (
          <motion.div
            key={snippet.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="p-6">
              {snippet.logo && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={snippet.logo}
                    alt={snippet.title}
                    width={48}
                    height={48}
                  />
                </div>
              )}
              <div className="flex items-center mb-4">
                {snippet.category === "AI" ? (
                  <FaRobot className="text-2xl text-purple-600" />
                ) : snippet.category === "Development" ? (
                  <FaCode className="text-2xl text-blue-600" />
                ) : (
                  <FaBrain className="text-2xl text-green-600" />
                )}
                <h3 className="text-xl font-semibold ml-2">{snippet.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{snippet.description}</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-200">{snippet.code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CodeShowcase;
