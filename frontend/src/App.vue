<template>
  <div id="app">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="header-content">
          <h1>
            <el-icon><MagicStick /></el-icon>
            AI语料清洗智能体
          </h1>
          <p class="subtitle">通过自然语言指令，智能清洗您的数据</p>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <CleaningWorkflow />
      </el-main>
      
      <el-footer class="app-footer">
        <p>Powered by LLM API | 支持 OpenAI, Claude 等多种模型</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import CleaningWorkflow from './components/CleaningWorkflow.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-container {
  min-height: 100vh;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  text-align: center;
}

.header-content h1 {
  margin: 0;
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header-content h1 .el-icon {
  font-size: 36px;
  color: #667eea;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 14px;
}

.app-main {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-footer p {
  margin: 0;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style>

