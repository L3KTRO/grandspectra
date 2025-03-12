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
      <router-link :to="media.title ? '/movie/'+media.id : 'tv/'+media.id">
        <img :src="media.poster ?? 'https://placehold.co/150x225'" :alt="media.title" class="poster"/>
        <!--      <h1 class="tooltip">{{ media.title }}</h1>-->
      </router-link>

    </div>
  </div>
</template>

<style scoped>

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
  flex-wrap: wrap;
  padding: 16px;
  box-sizing: border-box;
  scroll-behavior: smooth;
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