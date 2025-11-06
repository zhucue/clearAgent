<template>
  <div class="strategy-preview">
    <div v-if="strategy" class="preview-content">
      <!-- AI分析 -->
      <el-alert
        title="AI 分析结果"
        type="success"
        :closable="false"
        show-icon
      >
        <template #default>
          <p class="analysis-text">{{ strategy.analysis }}</p>
        </template>
      </el-alert>

      <!-- 文件统计 -->
      <div v-if="stats" class="stats-section">
        <el-divider content-position="left">
          <el-icon><DataAnalysis /></el-icon>
          文件统计
        </el-divider>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-statistic title="总行数" :value="stats.totalLines">
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="文件大小" :value="stats.fileSize" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="平均行长" :value="stats.avgLineLength">
              <template #suffix>字符</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic 
              v-if="stats.emptyLines !== undefined" 
              title="空行数" 
              :value="stats.emptyLines"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 清洗步骤 -->
      <div class="tasks-section">
        <el-divider content-position="left">
          <el-icon><List /></el-icon>
          清洗步骤（共 {{ strategy.tasks.length }} 步）
        </el-divider>
        
        <el-timeline>
          <el-timeline-item
            v-for="(task, index) in strategy.tasks"
            :key="index"
            :timestamp="`优先级 ${task.priority}`"
            placement="top"
          >
            <el-card>
              <div class="task-item">
                <div class="task-header">
                  <el-tag :type="getTaskTypeColor(task.type)">
                    {{ getTaskTypeName(task.type) }}
                  </el-tag>
                  <span class="task-description">{{ task.description }}</span>
                </div>
                <div v-if="task.params && Object.keys(task.params).length > 0" class="task-params">
                  <el-descriptions :column="2" size="small" border>
                    <el-descriptions-item
                      v-for="(value, key) in task.params"
                      :key="key"
                      :label="key"
                    >
                      {{ formatParamValue(value) }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 预估结果 -->
      <div class="estimation-section">
        <el-divider content-position="left">
          <el-icon><TrendCharts /></el-icon>
          预估结果
        </el-divider>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-card shadow="hover">
              <el-statistic 
                title="预计保留行数" 
                :value="strategy.estimatedResult.expectedLines"
              >
                <template #prefix>
                  <el-icon color="#67C23A"><Check /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <el-statistic 
                title="预计删除率" 
                :value="strategy.estimatedResult.removalRate"
                :precision="1"
              >
                <template #suffix>%</template>
                <template #prefix>
                  <el-icon color="#F56C6C"><Delete /></el-icon>
                </template>
              </el-statistic>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-empty v-else description="暂无策略数据" />
  </div>
</template>

<script setup lang="ts">
import type { CleaningStrategy, FileStats } from '@/types'

interface Props {
  strategy: CleaningStrategy | null
  stats: FileStats | null
}

defineProps<Props>()

const getTaskTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'remove_empty_lines': '删除空行',
    'deduplicate': '去重',
    'filter_by_length': '长度过滤',
    'remove_urls': '删除URL',
    'remove_html': '删除HTML',
    'remove_special_chars': '删除特殊字符',
    'normalize_whitespace': '标准化空白',
    'filter_by_language': '语言过滤',
    'filter_by_keywords': '关键词过滤',
  }
  return typeMap[type] || type
}

const getTaskTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'remove_empty_lines': 'info',
    'deduplicate': 'warning',
    'filter_by_length': 'success',
    'remove_urls': 'danger',
    'remove_html': 'danger',
    'remove_special_chars': 'warning',
    'normalize_whitespace': 'info',
    'filter_by_language': 'success',
    'filter_by_keywords': 'danger',
  }
  return colorMap[type] || 'info'
}

const formatParamValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}
</script>

<style scoped>
.strategy-preview {
  width: 100%;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analysis-text {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.stats-section,
.tasks-section,
.estimation-section {
  margin-top: 8px;
}

.task-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-description {
  font-size: 15px;
  color: #303133;
}

.task-params {
  margin-top: 8px;
}
</style>

