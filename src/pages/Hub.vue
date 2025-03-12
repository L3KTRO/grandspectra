<script>
import {ref} from "vue";
import useApi from "@/composables/api.js";

const {request} = useApi();

export default {
  name: 'Hub',
  data() {
    return {
      searchQuery: ref(''),
      showFilters: false,
      selectedGenres: [],
      genres: ref([]),
      content: ref([]),
      isTv: false,
      isSearching: false
    }
  },
  watch: {
    searchQuery: {
      handler: 'fetchContent',
      immediate: false
    },
    selectedGenres: {
      handler: 'fetchContent',
      immediate: false
    },
    isTv: {
      handler: 'fetchContent',
      immediate: false
    }
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    async fetchContent() {
      this.isSearching = true
      const entity = this.isTv ? 'tv' : 'movies'
      const titleParam = this.isTv ? 'name' : 'title'
      const response = await request(`/${entity}`, {
        params: {
          [titleParam]: this.searchQuery,
        }
      })

      this.content = response.data.data
      this.isSearching = false
    },
    redirectToContent(id) {
      this.$router.push(`/${this.isTv ? 'tv' : 'movie'}/${id}`)
    }
  },

  async beforeMount() {
    await this.fetchContent()
    /*
       const response = await request("/genres?per_page=99")
       if (response.status !== 200) return
       this.genres = response.data.data
     */
  }
}
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <div id="switch-content">
        <h2 class="switch-content-title" :class="isTv ? 'switch-content-title-selected' : ''">Movie</h2>
        <label class="switch">
          <input type="checkbox" v-model="isTv">
          <span class="slider round"></span>
        </label>
        <h2 class="switch-content-title" :class="!isTv ? 'switch-content-title-selected' : ''">TV</h2>
      </div>
      <input type="text" class="search-input" v-model="searchQuery" placeholder="Buscar por título...">
      <button @click="toggleFilters" class="filter-toggle" v-if="genres.length > 0">
        <h2 class="light-neon-effect-text">{{ showFilters ? 'Hide advanced filters' : 'Show advanced filters' }}</h2>
      </button>
    </div>

    <div class="filter-options" :class="{ show: showFilters }">
      <div class="filter-section" v-if="genres.length > 0">
        <h3>Genres</h3>
        <div class="genre-options">
          <div v-for="genre in genres" :key="genre.id" class="genre-option">
            <input type="checkbox" :id="genre.id" v-model="selectedGenres" :value="genre.id">
            <label :for="genre.id">{{ genre.name }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="content-container">
    <div class="content" v-if="!isSearching && this.content.length > 0" v-for="item in content" @click="redirectToContent(item.id)" :key="item.id">
      <div>
        <img class="content-poster" :src="item.poster ?? 'https://placehold.co/75x112'" alt="Oppenheimer">
        <h1 class="content-title">{{ item.title ?? item.name }}</h1>
      </div>
      <div>
        <h2>{{ item.vote_average }}/10</h2>
        <h2 v-if="item.runtime">{{ item.runtime }} minutes</h2>
        <h2 v-if="item.release_date || item.first_air_date">{{
            !isNaN(new Date(item.release_date).getFullYear()) ? new Date(item.release_date).getFullYear() : null
            ??
            !isNaN(new Date(item.first_air_date).getFullYear()) ? new Date(item.first_air_date).getFullYear() : null
          }}</h2>
      </div>
    </div>
    <div v-else-if="isSearching" class="container-info">
      <h1>Searching...</h1>
    </div>
    <div v-else class="container-info">
      <h1>No content found</h1>
    </div>
  </div>
</template>

<style scoped>

.container-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  * {
    font-size: 2rem;
  }
}

.content-poster {
  width: 75px;
  height: 112px;
}

#content-container {
  display: flex;
  flex-direction: column;
  margin: 0 15rem;
}

.content {
  background-color: var(--background-contrast-mid);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  margin: 1rem;

  * {
    margin: 0 1rem;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 5rem 0 0;
  }
}

.content-title {
  font-size: 2.25rem;
  font-weight: bold;
  font-family: 'CharisSIL', "GTVCS", serif;
}

.switch-content-title {
  transition: .5s;
}

.switch-content-title-selected {
  color: var(--text-contrast);
  transition: .5s;
}

#switch-content {
  display: flex;
  flex-direction: row;
  align-items: center;

  h2 {
    margin: 1rem;
  }
}

.search-container {
  width: 100%;
  max-width: 1000px;
  margin: 4rem auto;
  background-color: var(--background-contrast);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  * {
    font-family: "GTVCS", serif;
    font-weight: bold;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 12px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--text-contrast);
  border-radius: 4px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: var(--text);
}

.filter-toggle {
  margin-left: 10px;
  padding: 10px 15px;
  color: var(--contrast-1-2);
  background-color: var(--text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: background-color 0.2s;
}

.filter-options {
  background-color: inherit;
  overflow: hidden;
  transition: max-height, padding 0.3s ease;
  max-height: 0;
  padding: 0 1rem;
}

.filter-options.show {
  padding: 1rem;
  max-height: 1000px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: var(--text);
}

.genre-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.type-options {
  display: flex;
  gap: 15px;
}

.genre-option, .type-option {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 6px;
  cursor: pointer;
}

label {
  cursor: pointer;
  font-size: 14px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--text-contrast);
  transition: .5s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider:before {
  transform: translateX(25px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
