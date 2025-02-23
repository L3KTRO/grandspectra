<script>
export default {
  name: "ContentList",
  props: {
    title: {
      type: String,
      default: 'Más populares'
    },
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
  <h2 id="title" class="light-neon-effect-text">{{ this.title }}</h2>
  <div class="horizontal-poster-list">
    <div
        class="poster-item"
        v-for="media in this.content"
        :key="media.id"
    >
      <img :src="media.image" :alt="media.title" class="poster"/>
      <h4 class="subtitle">{{ media.title }}</h4>
    </div>
  </div>
</template>

<style scoped>

template {
  margin: 5rem 0;
}

.subtitle {
  font-family: "GTVCS", serif;
  font-size: 1rem;
}

#title {
  margin: 0 2rem;
  font-size: 1.25rem;
}

.horizontal-poster-list {
  display: flex;
  overflow-x: auto;
  padding: 16px;
  box-sizing: border-box;
  scroll-behavior: smooth;
  margin: 0 0 3rem 0;
}

.poster-item {
  flex: 0 0 auto;
  margin: 0 auto;
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