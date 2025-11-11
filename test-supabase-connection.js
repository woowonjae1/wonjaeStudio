// Supabase 连接测试脚本
// 在浏览器控制台运行此脚本来验证配置

console.log('🔍 开始测试 Supabase 连接...\n');

const SUPABASE_URL = 'https://ryxncnsyspcqnqmggbmp.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eG5jbnN5c3BjcW5xbWdnYm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzYwMjAsImV4cCI6MjA3NjIxMjAyMH0.S7OslNkgmq_xzfKYboa_qManJA3ovAa5-cTIylk_HVQ';

// 测试 1: Health Check
console.log('📡 测试 1: Health Check...');
fetch(`${SUPABASE_URL}/rest/v1/`, {
  method: 'GET',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`
  }
})
.then(res => {
  if (res.ok) {
    console.log('✅ Health Check 成功！状态码:', res.status);
    return res.text();
  } else {
    console.error('❌ Health Check 失败！状态码:', res.status);
    throw new Error(`HTTP ${res.status}`);
  }
})
.then(data => {
  console.log('📦 响应数据:', data);
})
.catch(err => {
  console.error('❌ 连接失败:', err.message);
});

// 测试 2: Auth Health
console.log('\n📡 测试 2: Auth Health...');
fetch(`${SUPABASE_URL}/auth/v1/health`, {
  method: 'GET',
  headers: {
    'apikey': ANON_KEY
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Auth Health 检查成功！');
  console.log('📦 响应:', data);
})
.catch(err => {
  console.error('❌ Auth Health 检查失败:', err.message);
});

console.log('\n💡 提示: 如果看到绿色的 ✅，说明配置正确！');
console.log('💡 如果看到红色的 ❌，请检查防火墙或网络设置。\n');
