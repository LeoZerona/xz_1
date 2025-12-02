<template>
  <div class="article-selector">
    <el-select
      v-model="selectedArticleId"
      placeholder="选择文章"
      class="article-select"
      @change="handleArticleChange"
    >
      <el-option
        v-for="article in articles"
        :key="article.id"
        :label="article.title"
        :value="article.id"
      >
        <div class="article-option">
          <span class="title">{{ article.title }}</span>
          <span v-if="article.author" class="author">{{ article.author }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
interface Article {
  id: string;
  title: string;
  author?: string;
  source: string;
  category?: string;
}

interface Props {
  articles: Article[];
  currentArticleId?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  change: [articleId: string];
}>();

const selectedArticleId = ref(props.currentArticleId || '');

const handleArticleChange = (articleId: string) => {
  emit('change', articleId);
};
</script>

<style lang="scss" scoped>
.article-selector {
  margin-bottom: 20px;

  .article-select {
    width: 100%;
    max-width: 400px;
  }

  .article-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: 600;
    }

    .author {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
    }
  }
}

@media (max-width: 768px) {
  .article-selector {
    margin-bottom: 15px;

    .article-select {
      max-width: 100%;
    }
  }
}
</style>

