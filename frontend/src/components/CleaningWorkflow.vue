<template>
  <div class="workflow-container">
    <!-- 步骤指示器 -->
    <el-steps :active="currentStep" align-center finish-status="success">
      <el-step title="上传文件" icon="Upload" />
      <el-step title="输入指令" icon="Edit" />
      <el-step title="确认策略" icon="View" />
      <el-step title="执行清洗" icon="Check" />
    </el-steps>

    <!-- 步骤1: 文件上传 -->
    <el-card v-show="currentStep === 0" class="step-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Upload /></el-icon>
          <span>步骤 1: 上传语料文件</span>
        </div>
      </template>

      <FileUploader @file-selected="handleFileSelected" :file="uploadedFile" />

      <div class="step-actions">
        <el-button type="primary" :disabled="!uploadedFile" @click="nextStep">
          下一步
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </el-card>

    <!-- 步骤2: 输入清洗指令 -->
    <el-card v-show="currentStep === 1" class="step-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Edit /></el-icon>
          <span>步骤 2: 输入清洗指令</span>
        </div>
      </template>

      <CommandInput v-model="command" />

      <div class="step-actions">
        <el-button @click="prevStep">
          <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button
          type="primary"
          :loading="analyzing"
          :disabled="!command"
          @click="analyzeFile"
        >
          分析并生成策略
          <el-icon class="el-icon--right"><MagicStick /></el-icon>
        </el-button>
      </div>
    </el-card>

    <!-- 步骤3: 策略预览 -->
    <el-card v-show="currentStep === 2" class="step-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><View /></el-icon>
          <span>步骤 3: 确认清洗策略</span>
        </div>
      </template>

      <StrategyPreview :strategy="strategy" :stats="fileStats" />

      <div class="step-actions">
        <el-button @click="prevStep">
          <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button type="primary" :loading="executing" @click="executeClean">
          确认并执行清洗
          <el-icon class="el-icon--right"><Check /></el-icon>
        </el-button>
      </div>
    </el-card>

    <!-- 步骤4: 执行结果 -->
    <el-card v-show="currentStep === 3" class="step-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Check /></el-icon>
          <span>步骤 4: 清洗完成</span>
        </div>
      </template>

      <ResultDisplay :result="cleanResult" />

      <div class="step-actions">
        <el-button @click="reset">
          <el-icon class="el-icon--left"><RefreshLeft /></el-icon>
          重新开始
        </el-button>
        <el-button type="success" @click="downloadResult">
          <el-icon class="el-icon--left"><Download /></el-icon>
          下载清洗结果
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import FileUploader from "./FileUploader.vue";
import CommandInput from "./CommandInput.vue";
import StrategyPreview from "./StrategyPreview.vue";
import ResultDisplay from "./ResultDisplay.vue";
import * as api from "@/services/api";
import type { CleaningStrategy, FileStats, CleaningResult } from "@/types";

const currentStep = ref(0);
const uploadedFile = ref<File | null>(null);
const command = ref("");
const analyzing = ref(false);
const executing = ref(false);
const strategy = ref<CleaningStrategy | null>(null);
const fileStats = ref<FileStats | null>(null);
const cleanResult = ref<CleaningResult | null>(null);
const filePath = ref("");

const handleFileSelected = (file: File | null) => {
  uploadedFile.value = file;
};

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const analyzeFile = async () => {
  if (!uploadedFile.value || !command.value) return;

  analyzing.value = true;
  try {
    const result = await api.analyzeCorpus(uploadedFile.value, command.value);
    strategy.value = result.strategy;
    fileStats.value = result.stats;
    filePath.value = result.filePath;

    ElMessage.success("策略生成成功！");
    nextStep();
  } catch (error: any) {
    ElMessage.error(error.message || "分析失败，请重试");
  } finally {
    analyzing.value = false;
  }
};

const executeClean = async () => {
  if (!filePath.value || !strategy.value) return;

  executing.value = true;
  try {
    const result = await api.executeCleaning(filePath.value, strategy.value);
    cleanResult.value = result;

    ElMessage.success("清洗完成！");
    nextStep();
  } catch (error: any) {
    ElMessage.error(error.message || "执行失败，请重试");
  } finally {
    executing.value = false;
  }
};

const downloadResult = async () => {
  if (cleanResult.value?.outputFile) {
    try {
      await api.downloadResult(cleanResult.value.outputFile);
      ElMessage.success("下载成功");
    } catch (error: any) {
      ElMessage.error(error.message || "下载失败");
    }
  }
};

const reset = () => {
  currentStep.value = 0;
  uploadedFile.value = null;
  command.value = "";
  strategy.value = null;
  fileStats.value = null;
  cleanResult.value = null;
  filePath.value = "";
};
</script>

<style scoped>
.workflow-container {
  max-width: 1000px;
  margin: 0 auto;
}

.el-steps {
  margin-bottom: 32px;
  background: #ffffff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s;
}

html.dark .el-steps {
  background: #1f1f1f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.step-card {
  margin-top: 24px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.3s;
}

html.dark .step-card {
  border: 1px solid #303030;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.step-card:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

html.dark .step-card:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.5), 0 3px 6px 0 rgba(0, 0, 0, 0.4),
    0 5px 12px 4px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  transition: color 0.3s;
}

html.dark .card-header {
  color: rgba(255, 255, 255, 0.88);
}

.step-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
