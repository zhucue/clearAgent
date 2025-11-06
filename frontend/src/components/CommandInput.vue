<template>
  <div class="command-input">
    <div class="input-section">
      <el-input
        v-model="localCommand"
        type="textarea"
        :rows="6"
        placeholder="请用自然语言描述您的清洗需求，例如：&#10;&#10;• 删除所有空行和重复内容，保留长度大于10的文本&#10;• 去除HTML标签和URL链接，只保留中文内容&#10;• 标准化空白字符，删除特殊符号"
        @input="handleInput"
      />
      
      <div class="char-count">
        {{ localCommand.length }} / 500 字符
      </div>
    </div>

    <el-divider content-position="left">
      <el-icon><Lightbulb /></el-icon>
      快速示例
    </el-divider>

    <div class="examples">
      <el-tag
        v-for="(example, index) in examples"
        :key="index"
        class="example-tag"
        type="info"
        effect="plain"
        @click="selectExample(example)"
      >
        {{ example }}
      </el-tag>
    </div>

    <el-alert
      title="提示"
      type="info"
      :closable="false"
      show-icon
      class="tips"
    >
      <template #default>
        <ul>
          <li>支持中文自然语言描述，AI会自动理解您的需求</li>
          <li>可以组合多个清洗操作，系统会按优先级自动执行</li>
          <li>建议先从简单的清洗开始，逐步调整策略</li>
        </ul>
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const localCommand = ref(props.modelValue)

const examples = [
  '删除所有空行和重复内容',
  '去除HTML标签和URL链接',
  '保留长度在10-200字之间的文本',
  '只保留中文内容，删除特殊字符',
  '标准化空白字符，去除首尾空格',
  '删除包含敏感词的行',
]

const handleInput = () => {
  if (localCommand.value.length <= 500) {
    emit('update:modelValue', localCommand.value)
  } else {
    localCommand.value = localCommand.value.slice(0, 500)
  }
}

const selectExample = (example: string) => {
  localCommand.value = example
  emit('update:modelValue', example)
}

watch(() => props.modelValue, (newValue) => {
  localCommand.value = newValue
})
</script>

<style scoped>
.command-input {
  width: 100%;
}

.input-section {
  position: relative;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.example-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.example-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tips {
  margin-top: 20px;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}
</style>

