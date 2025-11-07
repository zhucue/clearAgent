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

      <!-- 波浪线动画 -->
      <div class="wave-container">
        <svg
          class="wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            class="wave-path wave-1"
            d="M0,60 C200,60 200,40 400,40 C600,40 600,80 800,80 C1000,80 1000,60 1200,60"
            fill="none"
            stroke="url(#gradient1)"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            class="wave-path wave-2"
            d="M0,60 C200,60 200,80 400,80 C600,80 600,40 800,40 C1000,40 1000,60 1200,60"
            fill="none"
            stroke="url(#gradient2)"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            class="wave-path wave-3"
            d="M0,60 C200,60 200,50 400,50 C600,50 600,70 800,70 C1000,70 1000,60 1200,60"
            fill="none"
            stroke="url(#gradient3)"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #1890ff; stop-opacity: 0.9">
                <animate
                  attributeName="stop-color"
                  values="#1890ff;#52c41a;#faad14;#f5222d;#722ed1;#1890ff"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style="stop-color: #40a9ff; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#40a9ff;#73d13d;#ffc53d;#ff4d4f;#9254de;#40a9ff"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="100%"
                style="stop-color: #1890ff; stop-opacity: 0.9"
              >
                <animate
                  attributeName="stop-color"
                  values="#1890ff;#52c41a;#faad14;#f5222d;#722ed1;#1890ff"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #52c41a; stop-opacity: 0.7">
                <animate
                  attributeName="stop-color"
                  values="#52c41a;#faad14;#f5222d;#722ed1;#1890ff;#52c41a"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style="stop-color: #73d13d; stop-opacity: 0.9">
                <animate
                  attributeName="stop-color"
                  values="#73d13d;#ffc53d;#ff4d4f;#9254de;#40a9ff;#73d13d"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop
                offset="100%"
                style="stop-color: #52c41a; stop-opacity: 0.7"
              >
                <animate
                  attributeName="stop-color"
                  values="#52c41a;#faad14;#f5222d;#722ed1;#1890ff;#52c41a"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #722ed1; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#722ed1;#1890ff;#52c41a;#faad14;#f5222d;#722ed1"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style="stop-color: #9254de; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#9254de;#40a9ff;#73d13d;#ffc53d;#ff4d4f;#9254de"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" style="stop-color: #722ed1; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#722ed1;#1890ff;#52c41a;#faad14;#f5222d;#722ed1"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #faad14; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#faad14;#f5222d;#722ed1;#1890ff;#52c41a;#faad14"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style="stop-color: #ffc53d; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#ffc53d;#ff4d4f;#9254de;#40a9ff;#73d13d;#ffc53d"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" style="stop-color: #faad14; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#faad14;#f5222d;#722ed1;#1890ff;#52c41a;#faad14"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #f5222d; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#f5222d;#722ed1;#1890ff;#52c41a;#faad14;#f5222d"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style="stop-color: #ff4d4f; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#ff4d4f;#9254de;#40a9ff;#73d13d;#ffc53d;#ff4d4f"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" style="stop-color: #f5222d; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#f5222d;#722ed1;#1890ff;#52c41a;#faad14;#f5222d"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
        </svg>
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

/* 波浪线动画 */
.wave-container {
  width: 100%;
  height: 100px;
  margin-top: 16px;
  overflow: hidden;
  position: relative;
}

.wave-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.wave-path {
  animation: wave-flow 8s ease-in-out infinite;
  transform-origin: center;
  filter: drop-shadow(0 0 8px rgba(24, 144, 255, 0.3));
}

.wave-1 {
  animation-duration: 5s;
}

.wave-2 {
  animation-duration: 7s;
  animation-delay: -2s;
}

.wave-3 {
  animation-duration: 9s;
  animation-delay: -4s;
}

@keyframes wave-flow {
  0%,
  100% {
    d: path(
      "M0,60 C200,60 200,40 400,40 C600,40 600,80 800,80 C1000,80 1000,60 1200,60"
    );
  }
  12.5% {
    d: path(
      "M0,60 C200,60 200,75 400,75 C600,75 600,45 800,45 C1000,45 1000,60 1200,60"
    );
  }
  25% {
    d: path(
      "M0,60 C200,60 200,80 400,80 C600,80 600,40 800,40 C1000,40 1000,60 1200,60"
    );
  }
  37.5% {
    d: path(
      "M0,60 C200,60 200,50 400,50 C600,50 600,70 800,70 C1000,70 1000,60 1200,60"
    );
  }
  50% {
    d: path(
      "M0,60 C200,60 200,35 400,35 C600,35 600,85 800,85 C1000,85 1000,60 1200,60"
    );
  }
  62.5% {
    d: path(
      "M0,60 C200,60 200,65 400,65 C600,65 600,55 800,55 C1000,55 1000,60 1200,60"
    );
  }
  75% {
    d: path(
      "M0,60 C200,60 200,85 400,85 C600,85 600,35 800,35 C1000,35 1000,60 1200,60"
    );
  }
  87.5% {
    d: path(
      "M0,60 C200,60 200,45 400,45 C600,45 600,75 800,75 C1000,75 1000,60 1200,60"
    );
  }
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
