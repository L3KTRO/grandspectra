<script>
export default {
  name: "ContentList",
  data() {
    return {
      posters: [
        {id: 1, title: 'Película 1', image: 'https://placehold.co/200x300'},
        {id: 2, title: 'Película 2', image: 'https://placehold.co/200x300'},
        {id: 3, title: 'Película 3', image: 'https://placehold.co/200x300'},
        {id: 4, title: 'Película 4', image: 'https://placehold.co/200x300'},
        {id: 5, title: 'Película 5', image: 'https://placehold.co/200x300'},
        {id: 6, title: 'Película 6', image: 'https://placehold.co/200x300'}
      ]
    }
  }
}
</script>

<template>
  <h2 id="title" class="light-neon-effect-text">Más populares</h2>
  <div class="horizontal-poster-list">
    <div
        class="poster-item"
        v-for="poster in posters"
        :key="poster.id"
    >
      <img :src="poster.image" :alt="poster.title" class=""/>
    </div>
  </div>
</template>

<style scoped>

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
}

.poster-item {
  flex: 0 0 auto;
  margin: 0 auto;
  width: 200px; /* Relación de aspecto estándar de carteles de cine (2:3) */
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