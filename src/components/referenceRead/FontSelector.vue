<template>
  <el-select
    v-model="selectedFont"
    placeholder="请选择字体"
    filterable
    clearable
    :filter-method="filterFonts"
    style="width: 100%"
    @change="handleChange"
  >
    <el-option-group label="服务器字体">
      <el-option
        v-for="font in filteredServerFonts"
        :key="font.value"
        :label="font.label"
        :value="font.value"
      >
        <div class="font-option" :style="{ fontFamily: font.value }">
          <span class="font-name">{{ font.label }}</span>
          <span class="font-preview">预览文字</span>
        </div>
      </el-option>
    </el-option-group>
    
    <el-option-group label="本地字体" v-if="localFonts.length > 0">
      <el-option
        v-for="font in filteredLocalFonts"
        :key="font.value"
        :label="font.label"
        :value="font.value"
      >
        <div class="font-option" :style="{ fontFamily: font.value }">
          <span class="font-name">{{ font.label }}</span>
          <span class="font-preview">预览文字</span>
        </div>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Font {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const selectedFont = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 服务器字体列表
const serverFonts: Font[] = [
  { label: '汉仪楷体繁', value: 'HanYiKaiTiFan' },
  { label: '方正小篆体', value: 'FangZhengXiaoZhuan' },
  { label: '楷体', value: 'KaiTi, serif' },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '黑体', value: 'SimHei, sans-serif' },
  { label: '仿宋', value: 'FangSong, serif' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: '华文楷体', value: 'STKaiti, serif' },
  { label: '华文宋体', value: 'STSong, serif' },
  { label: '华文仿宋', value: 'STFangsong, serif' }
]

// 本地字体列表
const localFonts = ref<Font[]>([])

// 搜索关键词
const searchKeyword = ref('')

// 过滤后的服务器字体
const filteredServerFonts = computed(() => {
  if (!searchKeyword.value) {
    return serverFonts
  }
  const keyword = searchKeyword.value.toLowerCase()
  return serverFonts.filter(font => 
    font.label.toLowerCase().includes(keyword) ||
    font.value.toLowerCase().includes(keyword)
  )
})

// 过滤后的本地字体
const filteredLocalFonts = computed(() => {
  if (!searchKeyword.value) {
    return localFonts.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return localFonts.value.filter(font => 
    font.label.toLowerCase().includes(keyword) ||
    font.value.toLowerCase().includes(keyword)
  )
})

// 过滤字体
const filterFonts = (val: string) => {
  searchKeyword.value = val
}

// 加载本地字体
const loadLocalFonts = () => {
  try {
    // 使用 Font Access API 或 document.fonts API 获取本地字体
    if ('queryLocalFonts' in window) {
      // Chrome 的 Font Access API
      ;(window as any).queryLocalFonts().then((fonts: any[]) => {
        localFonts.value = fonts.map(font => ({
          label: font.fullName || font.family,
          value: font.family
        }))
      }).catch(() => {
        // API 不可用或用户拒绝
        console.log('Font Access API 不可用')
      })
    } else if (document.fonts && document.fonts.check) {
      // 使用 document.fonts API 检测已加载的字体
      // 这里可以检测一些常见的本地字体
      const commonLocalFonts = [
        'Arial', 'Times New Roman', 'Courier New', 'Verdana',
        'Georgia', 'Palatino', 'Garamond', 'Bookman',
        'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
      ]
      
      const availableFonts: Font[] = []
      commonLocalFonts.forEach(fontName => {
        if (document.fonts.check(`12px "${fontName}"`)) {
          availableFonts.push({
            label: fontName,
            value: fontName
          })
        }
      })
      localFonts.value = availableFonts
    }
  } catch (error) {
    console.error('加载本地字体失败:', error)
  }
}

const handleChange = (value: string) => {
  emit('change', value)
}

onMounted(() => {
  loadLocalFonts()
})
</script>

<style lang="scss" scoped>
.font-option {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .font-name {
    font-size: 14px;
    color: #303133;
  }

  .font-preview {
    font-size: 14px;
    color: #909399;
    margin-left: 10px;
  }
}
</style>

