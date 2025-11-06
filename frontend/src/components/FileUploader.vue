<template>
  <div class="file-uploader">
    <el-upload
      class="upload-area"
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleFileChange"
      accept=".txt,.csv,.json"
    >
      <div v-if="!file" class="upload-placeholder">
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="upload-text">
          <p class="primary-text">点击或拖拽文件到此处上传</p>
          <p class="secondary-text">支持 .txt, .csv, .json 格式</p>
          <p class="secondary-text">文件大小限制: 100MB</p>
        </div>
      </div>
      
      <div v-else class="file-info">
        <el-icon class="file-icon" color="#67C23A"><Document /></el-icon>
        <div class="file-details">
          <p class="file-name">{{ file.name }}</p>
          <p class="file-size">{{ formatFileSize(file.size) }}</p>
        </div>
        <el-button 
          type="danger" 
          :icon="Delete" 
          circle 
          size="small"
          @click.stop="removeFile"
        />
      </div>
    </el-upload>

    <div v-if="file" class="file-preview">
      <el-divider content-position="left">
        <el-icon><View /></el-icon>
        文件预览
      </el-divider>
      <div class="preview-content">
        <el-skeleton :loading="loading" animated>
          <template #default>
            <pre>{{ previewContent }}</pre>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UploadFile } from 'element-plus'

interface Props {
  file?: File | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'file-selected', file: File | null): void
}>()

const file = ref<File | null>(props.file || null)
const previewContent = ref('')
const loading = ref(false)

const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    file.value = uploadFile.raw
    emit('file-selected', uploadFile.raw)
    loadPreview(uploadFile.raw)
  }
}

const removeFile = () => {
  file.value = null
  previewContent.value = ''
  emit('file-selected', null)
}

const loadPreview = async (file: File) => {
  loading.value = true
  try {
    const text = await file.text()
    const lines = text.split('\n').slice(0, 20) // 只显示前20行
    previewContent.value = lines.join('\n')
    if (text.split('\n').length > 20) {
      previewContent.value += '\n\n... (更多内容)'
    }
  } catch (error) {
    console.error('Failed to load preview:', error)
    previewContent.value = '无法预览文件内容'
  } finally {
    loading.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch(() => props.file, (newFile) => {
  file.value = newFile
  if (newFile) {
    loadPreview(newFile)
  } else {
    previewContent.value = ''
  }
})
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 40px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  transition: all 0.3s;
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 80px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text .primary-text {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.upload-text .secondary-text {
  font-size: 14px;
  color: #909399;
  margin: 4px 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.file-icon {
  font-size: 48px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  word-break: break-all;
}

.file-size {
  font-size: 14px;
  color: #909399;
}

.file-preview {
  margin-top: 24px;
}

.preview-content {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.preview-content pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>

