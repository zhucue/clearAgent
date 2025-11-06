#!/bin/bash

echo "🚀 启动 AI语料清洗智能体 - 前端"
echo "================================"

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

echo "✨ 启动开发服务器..."
npm run dev

