<script>

// Mostrar una lista de contenido

export default {
  name: "ContentList",
  props: {
    content: {
      type: Array,
      default: []
    }
  }
}
</script>

<template>
  <div v-if="this.content.length === 0" id="content-container">
    <h2 id="title">...</h2>
  </div>
  <div class="horizontal-poster-list">

    <div
        class="poster-item"
        v-if="this.content"
        v-for="media in this.content"
        :key="media.id"
    >
      <router-link :to="media.title ? '/movie/'+media.id : 'tv/'+media.id">
        <img :src="media.poster ?? 'https://placehold.co/150x225'" :alt="media.title" class="poster"/>
        <!--      <h1 class="tooltip">{{ media.title }}</h1>-->
      </router-link>

    </div>
  </div>
</template>

<style scoped>

#content-container {
  display: flex;
  justify-content: center;
  overflow-x: visible;
}

.tooltip {
  visibility: hidden;
  opacity: 1%;
  font-size: 1rem;
  transition: opacity 0.25s;
  color: #ffffff;
  text-align: center;
  border-radius: 2px;
  min-width: 150px;
  max-width: 300px;
  max-height: 25px;
  background: #5e5d5d;
  position: absolute;
  z-index: 10;
  top: -10%;
  transform: translateY(-50%);
}


template {
  margin: 5rem 0;
}

.horizontal-poster-list {
  display: flex;
  padding: 16px;
  box-sizing: border-box;
  scroll-behavior: smooth;
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent items from wrapping to next line */
  flex-wrap: nowrap; /* Ensure items stay in a single row */
  width: 100%; /* Take full width of container */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on touch devices */
}

.poster-item {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  margin: 1rem;
}

.poster-item:hover .tooltip {
  visibility: visible;
  opacity: 100%;
  transition: opacity 0.25s;
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