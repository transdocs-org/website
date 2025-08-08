<script setup lang="ts">
import Tag from '@/components/Tag.vue';
import {data} from '@/readmes.data';

</script>

<template>
  <div class="tags-page">
    <Content />

    <div class="tags">
      <Tag v-for="tag in data.tags" :href="`/tag/${tag}`" :tag class="tag">{{ tag }}</Tag>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags-page {
  padding: 32px;

  .tags {
    display: flex;
    flex-wrap: wrap;

    .tag {
      margin: 5px;
    }
  }
}
</style>
