@echo off
echo 🚀 启动 AI语料清洗智能体 - 前端
echo ================================

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
)

echo ✨ 启动开发服务器...
call npm run dev

