<template>
  <div class="result-display">
    <div v-if="result" class="result-content">
      <!-- 成功提示 -->
      <el-result
        icon="success"
        title="清洗完成！"
        sub-title="您的语料已成功清洗，可以下载结果文件"
      >
        <template #extra>
          <el-tag type="success" size="large" effect="dark">
            <el-icon><CircleCheck /></el-icon>
            执行成功
          </el-tag>
        </template>
      </el-result>

      <!-- 统计数据 -->
      <div class="stats-cards">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic
                title="原始字符数"
                :value="result.stats.originalChars"
              >
                <template #prefix>
                  <el-icon color="#909399"><Document /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic
                title="清洗后字符数"
                :value="result.stats.finalChars"
              >
                <template #prefix>
                  <el-icon color="#67C23A"><DocumentChecked /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic
                title="删除字符数"
                :value="result.stats.removedChars"
              >
                <template #prefix>
                  <el-icon color="#F56C6C"><DocumentDelete /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>

          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <el-statistic
                title="字符删除率"
                :value="result.stats.charRemovalRate"
                :precision="2"
              >
                <template #suffix>%</template>
                <template #prefix>
                  <el-icon color="#E6A23C"><TrendCharts /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 执行信息 -->
      <el-card shadow="hover" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>执行信息</span>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="输出文件">
            <el-tag>{{ result.outputFile }}</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="执行时间">
            {{ formatExecutionTime(result.executionTime) }}
          </el-descriptions-item>

          <el-descriptions-item label="数据保留率">
            <el-progress
              :percentage="calculateRetentionRate(result.stats)"
              :color="getProgressColor(calculateRetentionRate(result.stats))"
            />
          </el-descriptions-item>

          <el-descriptions-item label="处理状态">
            <el-tag type="success" effect="dark">
              <el-icon><CircleCheck /></el-icon>
              已完成
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 数据对比图表 -->
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <el-icon><DataLine /></el-icon>
            <span>数据对比</span>
          </div>
        </template>

        <div class="comparison-chart">
          <div class="chart-bar">
            <div class="bar-label">原始数据</div>
            <div class="bar-container">
              <div class="bar original" :style="{ width: '100%' }">
                {{ result.stats.originalChars.toLocaleString() }} 字符
              </div>
            </div>
          </div>

          <div class="chart-bar">
            <div class="bar-label">清洗后</div>
            <div class="bar-container">
              <div
                class="bar cleaned"
                :style="{ width: calculateRetentionRate(result.stats) + '%' }"
              >
                {{ result.stats.finalChars.toLocaleString() }} 字符
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="暂无结果数据" />
  </div>
</template>

<script setup lang="ts">
import type { CleaningResult } from "@/types";

interface Props {
  result: CleaningResult | null;
}

defineProps<Props>();

const formatExecutionTime = (ms: number): string => {
  if (ms < 1000) return `${ms} 毫秒`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)} 秒`;
  return `${(ms / 60000).toFixed(2)} 分钟`;
};

const calculateRetentionRate = (stats: CleaningResult["stats"]): number => {
  return (stats.finalChars / stats.originalChars) * 100;
};

const getProgressColor = (percentage: number): string => {
  if (percentage > 80) return "#67C23A";
  if (percentage > 50) return "#E6A23C";
  return "#F56C6C";
};
</script>

<style scoped>
.result-display {
  width: 100%;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-cards {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.info-card,
.chart-card {
  margin-top: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s;
}

html.dark .card-header {
  color: rgba(255, 255, 255, 0.88);
}

.comparison-chart {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-label {
  width: 80px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  transition: color 0.3s;
}

html.dark .bar-label {
  color: rgba(255, 255, 255, 0.65);
}

.bar-container {
  flex: 1;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  transition: background 0.3s;
}

html.dark .bar-container {
  background: #303030;
}

.bar {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  transition: width 0.6s ease;
}

.bar.original {
  background: linear-gradient(90deg, #909399 0%, #606266 100%);
}

.bar.cleaned {
  background: linear-gradient(90deg, #67c23a 0%, #529b2e 100%);
}
</style>
