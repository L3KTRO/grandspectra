<script>
export default {
  name: "ContentListWrap",
  props: {
    content: {
      type: Array,
      default: [
        {id: 1, title: 'Media 1', image: 'https://placehold.co/150x225'},
        {id: 2, title: 'Media 2', image: 'https://placehold.co/150x225'},
        {id: 3, title: 'Media 3', image: 'https://placehold.co/150x225'},
        {id: 4, title: 'Media 4', image: 'https://placehold.co/150x225'},
        {id: 5, title: 'Media 5', image: 'https://placehold.co/150x225'},
        {id: 6, title: 'Media 6', image: 'https://placehold.co/150x225'},
        {id: 7, title: 'Media 7', image: 'https://placehold.co/150x225'},
        {id: 8, title: 'Media 8', image: 'https://placehold.co/150x225'},
        {id: 9, title: 'Media 9', image: 'https://placehold.co/150x225'},
        {id: 10, title: 'Media 10', image: 'https://placehold.co/150x225'},
      ]
    }
  }
}
</script>

<template>
  <div class="horizontal-poster-list">
    <div
        class="poster-item"
        v-for="media in this.content"
        :key="media.id"
    >
      <img :src="media.image" :alt="media.title" class="poster"/>
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
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.poster-item h4 {
  text-align: center;
  font-size: 1rem;
  margin-top: 8px;
}
</style>