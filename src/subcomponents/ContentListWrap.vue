<script>
export default {
  name: "ContentListWrap",
  props: {
    content: {
      type: Array,
      default: []
    }
  }
}
</script>

<template>
  <div v-if="this.content.length === 0" style="display: flex; justify-content: center;">
    <h2 id="title">No existe</h2>
  </div>
  <div class="horizontal-poster-list">
    <div
        class="poster-item"
        v-if="this.content"
        v-for="media in this.content"
        :key="media.id"
    >
      <img :src="media.loaded.poster ?? 'https://placehold.co/150x225'" :alt="media.title" class="poster"/>
    </div>
  </div>
</template>

<style scoped>

template {
  margin: 5rem 0;
}

.horizontal-poster-list {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.poster-item {
  flex: 0 0 auto;
  margin: 1rem;
}

.poster-item img {
  width: 150px;
  height: auto;
  border-radius: 8px;
}

.poster-item h4 {
  text-align: center;
  font-size: 1rem;
  margin-top: 8px;
}
</style>