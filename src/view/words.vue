<template>
  <navigation></navigation>
  <div class="words-container">
    <div class="content">
      <h1 class="title">词语学习</h1>
      <p class="description">在这里可以学习各种词语的小篆写法</p>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKey"
          placeholder="请输入词语进行搜索"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 词语分类 -->
      <div class="category-tabs">
        <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
          <el-tab-pane label="常用词语" name="common">
            <div class="words-grid">
              <div
                v-for="(word, index) in filteredWords"
                :key="index"
                class="word-card"
                @click="selectWord(word)"
              >
                <div class="word-xz">{{ word.xz }}</div>
                <div class="word-jt">{{ word.jt }}</div>
                <div class="word-ft">{{ word.ft }}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="成语" name="idiom">
            <div class="words-grid">
              <div
                v-for="(word, index) in filteredIdioms"
                :key="index"
                class="word-card"
                @click="selectWord(word)"
              >
                <div class="word-xz">{{ word.xz }}</div>
                <div class="word-jt">{{ word.jt }}</div>
                <div class="word-ft">{{ word.ft }}</div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="词组" name="phrase">
            <div class="words-grid">
              <div
                v-for="(word, index) in filteredPhrases"
                :key="index"
                class="word-card"
                @click="selectWord(word)"
              >
                <div class="word-xz">{{ word.xz }}</div>
                <div class="word-jt">{{ word.jt }}</div>
                <div class="word-ft">{{ word.ft }}</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Words">
import { Search } from '@element-plus/icons-vue';

const searchKey = ref('');
const activeCategory = ref('common');

// 示例词语数据
const commonWords = [
  { xz: '天', jt: '天', ft: '天' },
  { xz: '地', jt: '地', ft: '地' },
  { xz: '人', jt: '人', ft: '人' },
  { xz: '水', jt: '水', ft: '水' },
  { xz: '火', jt: '火', ft: '火' },
  { xz: '山', jt: '山', ft: '山' },
  { xz: '海', jt: '海', ft: '海' },
  { xz: '日', jt: '日', ft: '日' },
  { xz: '月', jt: '月', ft: '月' },
  { xz: '星', jt: '星', ft: '星' },
  { xz: '风', jt: '风', ft: '風' },
  { xz: '雨', jt: '雨', ft: '雨' },
];

const idioms = [
  { xz: '天', jt: '天', ft: '天' },
  { xz: '地', jt: '地', ft: '地' },
  { xz: '人', jt: '人', ft: '人' },
  { xz: '和', jt: '和', ft: '和' },
  { xz: '平', jt: '平', ft: '平' },
  { xz: '美', jt: '美', ft: '美' },
  { xz: '好', jt: '好', ft: '好' },
  { xz: '幸', jt: '幸', ft: '幸' },
  { xz: '福', jt: '福', ft: '福' },
];

const phrases = [
  { xz: '学', jt: '学', ft: '學' },
  { xz: '习', jt: '习', ft: '習' },
  { xz: '知', jt: '知', ft: '知' },
  { xz: '识', jt: '识', ft: '識' },
  { xz: '文', jt: '文', ft: '文' },
  { xz: '化', jt: '化', ft: '化' },
  { xz: '传', jt: '传', ft: '傳' },
  { xz: '统', jt: '统', ft: '統' },
];

const filteredWords = computed(() => {
  if (!searchKey.value) return commonWords;
  return commonWords.filter(word => 
    word.jt.includes(searchKey.value) || 
    word.ft.includes(searchKey.value)
  );
});

const filteredIdioms = computed(() => {
  if (!searchKey.value) return idioms;
  return idioms.filter(word => 
    word.jt.includes(searchKey.value) || 
    word.ft.includes(searchKey.value)
  );
});

const filteredPhrases = computed(() => {
  if (!searchKey.value) return phrases;
  return phrases.filter(word => 
    word.jt.includes(searchKey.value) || 
    word.ft.includes(searchKey.value)
  );
});

const handleCategoryChange = (name: string) => {
  activeCategory.value = name;
};

const selectWord = (word: any) => {
  console.log('选择词语:', word);
  // 这里可以添加查看详情的逻辑
};
</script>

<style lang="scss" scoped>
.words-container {
  min-height: calc(100vh - 60px);
  padding: 20px;
  padding-top: 80px; // 为固定的 navigation 留出空间（60px navigation + 20px 间距）
  background-color: #f5f6f7;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #303133;
    }

    .description {
      font-size: 16px;
      color: #606266;
      margin-bottom: 30px;
    }

    .search-box {
      margin-bottom: 30px;

      .search-input {
        max-width: 500px;
      }
    }

    .category-tabs {
      margin-top: 20px;
    }

    .words-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 20px;

      .word-card {
        background-color: #f5f6f7;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
        border: 2px solid transparent;

        &:hover {
          background-color: #e6e9f3;
          border-color: #409eff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .word-xz {
          font-family: 'FangZhengXiaoZhuan';
          font-size: 48px;
          margin-bottom: 10px;
          color: #303133;
        }

        .word-jt {
          font-size: 20px;
          color: #606266;
          margin-bottom: 5px;
        }

        .word-ft {
          font-family: 'HanYiKaiTiFan';
          font-size: 18px;
          color: #909399;
        }
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .words-container {
    padding: 15px;
    padding-top: 65px; // 移动端 navigation 高度（50px）+ 间距（15px）

    .content {
      padding: 20px;

      .title {
        font-size: 24px;
        margin-bottom: 12px;
      }

      .description {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .search-box {
        margin-bottom: 20px;

        .search-input {
          max-width: 100%;
        }
      }

      .words-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;

        .word-card {
          padding: 15px;

          .word-xz {
            font-size: 40px;
            margin-bottom: 8px;
          }

          .word-jt {
            font-size: 18px;
          }

          .word-ft {
            font-size: 16px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .words-container {
    padding: 10px;
    padding-top: 58px; // 超小屏幕 navigation 高度（48px）+ 间距（10px）

    .content {
      padding: 15px;

      .title {
        font-size: 20px;
      }

      .description {
        font-size: 13px;
      }

      .words-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;

        .word-card {
          padding: 12px;

          .word-xz {
            font-size: 35px;
            margin-bottom: 6px;
          }

          .word-jt {
            font-size: 16px;
          }

          .word-ft {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>

