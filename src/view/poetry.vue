<template>
  <navigation></navigation>
  <div class="poetry-container">
    <div class="content">
      <h1 class="title">古诗文学习</h1>
      <p class="description">在这里可以学习古诗文的小篆写法</p>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKey"
          placeholder="请输入古诗文标题或作者进行搜索"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 古诗文列表 -->
      <div class="poetry-list">
        <div
          v-for="(poem, index) in filteredPoems"
          :key="index"
          class="poetry-card"
          @click="selectPoem(poem)"
        >
          <div class="poetry-header">
            <h3 class="poetry-title">{{ poem.title }}</h3>
            <span class="poetry-author">{{ poem.author }}</span>
          </div>
          <div class="poetry-content">
            <div class="poetry-line" v-for="(line, lineIndex) in poem.lines" :key="lineIndex">
              <span class="line-xz">{{ line.xz }}</span>
              <span class="line-jt">{{ line.jt }}</span>
            </div>
          </div>
          <div class="poetry-footer">
            <el-tag size="small" type="info">{{ poem.dynasty }}</el-tag>
            <el-tag size="small" type="success">{{ poem.type }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Poetry">
import { Search } from '@element-plus/icons-vue';

const searchKey = ref('');

// 示例古诗文数据
const poems = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    type: '五言绝句',
    lines: [
      { xz: '床', jt: '床前明月光' },
      { xz: '前', jt: '疑是地上霜' },
      { xz: '明', jt: '举头望明月' },
      { xz: '月', jt: '低头思故乡' },
    ]
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    type: '五言绝句',
    lines: [
      { xz: '春', jt: '春眠不觉晓' },
      { xz: '眠', jt: '处处闻啼鸟' },
      { xz: '不', jt: '夜来风雨声' },
      { xz: '觉', jt: '花落知多少' },
    ]
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    type: '五言绝句',
    lines: [
      { xz: '白', jt: '白日依山尽' },
      { xz: '日', jt: '黄河入海流' },
      { xz: '依', jt: '欲穷千里目' },
      { xz: '山', jt: '更上一层楼' },
    ]
  },
  {
    title: '咏鹅',
    author: '骆宾王',
    dynasty: '唐',
    type: '五言古诗',
    lines: [
      { xz: '鹅', jt: '鹅，鹅，鹅' },
      { xz: '曲', jt: '曲项向天歌' },
      { xz: '项', jt: '白毛浮绿水' },
      { xz: '向', jt: '红掌拨清波' },
    ]
  },
];

const filteredPoems = computed(() => {
  if (!searchKey.value) return poems;
  return poems.filter(poem => 
    poem.title.includes(searchKey.value) || 
    poem.author.includes(searchKey.value)
  );
});

const selectPoem = (poem: any) => {
  console.log('选择古诗文:', poem);
  // 这里可以添加查看详情的逻辑
};
</script>

<style lang="scss" scoped>
.poetry-container {
  min-height: calc(100vh - 60px);
  padding: 20px;
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

    .poetry-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 20px;

      .poetry-card {
        background-color: #f5f6f7;
        border-radius: 10px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.3s;
        border: 2px solid transparent;

        &:hover {
          background-color: #e6e9f3;
          border-color: #409eff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .poetry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #dcdfe6;

          .poetry-title {
            font-size: 24px;
            font-weight: 700;
            color: #303133;
            margin: 0;
          }

          .poetry-author {
            font-size: 16px;
            color: #606266;
          }
        }

        .poetry-content {
          margin-bottom: 15px;

          .poetry-line {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            gap: 15px;

            .line-xz {
              font-family: 'FangZhengXiaoZhuan';
              font-size: 32px;
              color: #303133;
              min-width: 40px;
            }

            .line-jt {
              font-size: 18px;
              color: #606266;
            }
          }
        }

        .poetry-footer {
          display: flex;
          gap: 10px;
        }
      }
    }
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .poetry-container {
    padding: 15px;

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

      .poetry-list {
        gap: 15px;

        .poetry-card {
          padding: 20px;

          .poetry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            .poetry-title {
              font-size: 20px;
            }

            .poetry-author {
              font-size: 14px;
            }
          }

          .poetry-content {
            .poetry-line {
              gap: 12px;
              margin-bottom: 10px;

              .line-xz {
                font-size: 28px;
                min-width: 35px;
              }

              .line-jt {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .poetry-container {
    padding: 10px;

    .content {
      padding: 15px;

      .title {
        font-size: 20px;
      }

      .description {
        font-size: 13px;
      }

      .poetry-list {
        gap: 12px;

        .poetry-card {
          padding: 15px;

          .poetry-header {
            .poetry-title {
              font-size: 18px;
            }

            .poetry-author {
              font-size: 13px;
            }
          }

          .poetry-content {
            .poetry-line {
              gap: 10px;
              margin-bottom: 8px;

              .line-xz {
                font-size: 24px;
                min-width: 30px;
              }

              .line-jt {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

