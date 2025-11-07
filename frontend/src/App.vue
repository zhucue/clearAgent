<template>
  <div id="app">
    <div class="app-header">
      <div class="header-content">
        <h1>
          <el-icon><MagicStick /></el-icon>
          谜底语料清洗智能体
        </h1>
        <p class="subtitle">通过自然语言指令，智能清洗您的数据</p>
      </div>
    </div>

    <div class="app-main">
      <CleaningWorkflow />
    </div>

    <div class="app-footer">
      <p>Powered by LLM API | 支持 DeepSeek, OpenAI, Claude 等多种模型</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CleaningWorkflow from "./components/CleaningWorkflow.vue";
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 24px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.header-content h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  line-height: 1.4;
}

.header-content h1 .el-icon {
  font-size: 32px;
  color: #1890ff;
}

.subtitle {
  margin: 8px 0 0 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
}

.app-main {
  flex: 1;
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  padding: 24px;
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
