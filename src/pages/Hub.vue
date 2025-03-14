<script>
import useApi from "@/helpers/api.js";

const {request} = useApi();

/*
* DISCLAIM: He deshabilitado los filtros por la lentitud que tiene la base de datos al usar los filtros, hace
* parecer que la aplicación ha roto cuando lo que hace es esperar más de 20-25 segundos a la request
* Puedes comprobar que está maquetado abajo pero comentado
*/

export default {
  name: 'Hub',
  data() {
    return {
      searchQuery: '',
      debounceTimeout: null,
      showFilters: false,
      selectedGenres: [],
      genres: [],
      content: [],
      page: 1,
      totalPages: 0,
      lastPage: 0,
      isTv: false,
      isSearching: false,
      windowWidth: window.innerWidth
    }
  },
  watch: {
    searchQuery(newVal) { // Controlador de busqueda para cuando dejamos de escribir por 0.5 segundos
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      // Establecer nuevo timeout
      this.debounceTimeout = setTimeout(() => {
        if (newVal.trim()) {
          this.fetchContent();
        }
      }, 500);
    },
    selectedGenres: {
      handler: 'fetchContent',
      immediate: false
    },
    isTv: {
      handler: 'fetchContent',
      immediate: false
    }
  }
  ,
  computed: {
    pageRange() {
      // Mostrar máximo 6 páginas adicionales a la actual
      const range = [];

      // Si hay pocas páginas, mostrarlas todas
      if (this.lastPage <= 7) {
        for (let i = 1; i <= this.lastPage; i++) {
          range.push(i);
        }
        return range;
      }

      // Siempre incluir la primera página
      range.push(1);

      // Calcular el rango alrededor de la página actual
      let startPage = Math.max(2, this.page - 2);
      let endPage = Math.min(this.lastPage - 1, this.page + 2);

      // Ajustar el rango para mantener un máximo de 5 páginas entre los extremos
      if (endPage - startPage > 4) {
        if (this.page - startPage > this.lastPage - this.page) {
          // Más páginas a la izquierda
          startPage = endPage - 4;
        } else {
          // Más páginas a la derecha
          endPage = startPage + 4;
        }
      }

      // Añadir elipsis a la izquierda si es necesario
      if (startPage > 2) {
        range.push('...');
      }

      // Añadir páginas intermedias
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }

      // Añadir elipsis a la derecha si es necesario
      if (endPage < this.lastPage - 1) {
        range.push('...');
      }

      return range;
    }
    ,
    mobile() {  // Responsive
      return this.windowWidth < 875;
    }
    ,
    hiperMobile() { // Responsive
      return this.windowWidth < 520;
    }
    ,
    overExtended() { // Responsive
      return this.windowWidth < 1200;
    }
  }
  ,

  methods: {
    handleResize() { // Responsive
      this.windowWidth = window.innerWidth;
    }
    ,
    toggleFilters() { // Muestra u oculta los filtros
      this.showFilters = !this.showFilters;
    }
    ,
    async fetchContent() { // Busca contenido
      this.isSearching = true
      const entity = this.isTv ? 'tv' : 'movies'
      const titleParam = this.isTv ? 'name' : 'title'
      const response = await request(`/${entity}`, {
        params: {
          "page": this.page,
          [titleParam]: this.searchQuery,
        }
      })

      this.content = response.data.data
      this.isSearching = false

      const {total, last_page, current_page} = response.data
      this.totalPages = total
      this.lastPage = last_page
      this.page = current_page
    }
    ,
    redirectToContent(id) { // Redirige a la página de contenido
      this.$router.push(`/${this.isTv ? 'tv' : 'movie'}/${id}`)
    }
    ,
    prevPage() {
      if (this.page === 1 || this.isSearching) return
      this.page--
      this.fetchContent()
    }
    ,
    nextPage() {
      if (this.page === this.lastPage || this.isSearching) return
      this.page++
      this.fetchContent()
    }
    ,
    goToPage(page) {
      if (this.isSearching) return
      this.page = page
      this.fetchContent()
    }
  }
  ,
  mounted() {
    window.addEventListener('resize', this.handleResize);
  }
  ,
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  ,
  async beforeMount() {
    await this.fetchContent()
  }
}
</script>

<template>
  <div class="search-container" :style="mobile ? 'width: 80%; margin: 4rem 10%;' : ''">
    <div class="search-bar" :style="hiperMobile ? 'flex-direction: column;' : ''">
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

    <div class="paginator">
      <div class="paginator-button"
           @click="prevPage"
           :class="{ disabled: page === 1 }">
        {{ hiperMobile ? '<' : 'Previous <' }}
      </div>

      <!-- Números de página -->
      <template v-for="(item, index) in this.pageRange" :key="index">
        <div v-if="item === '...'" class="page-ellipsis">...</div>
        <div v-else
             class="page-number"
             :class="{ active: page === item }"
             @click="goToPage(item)">
          {{ item }}
        </div>
      </template>

      <div class="paginator-button"
           @click="nextPage"
           :class="{ disabled: page === lastPage }">
        {{ hiperMobile ? '>' : 'Next >' }}
      </div>
    </div>

  </div>


  <div id="content-container" :style="mobile ? 'margin: 0 5%;' : ''">
    <div class="content" v-if="!isSearching && this.content.length > 0" v-for="item in content"
         @click="redirectToContent(item.id)" :key="item.id">
      <div>
        <img class="content-poster" :src="item.poster ?? 'https://placehold.co/75x112'" alt="Oppenheimer">
        <h1 class="content-title">{{ item.title ?? item.name }}</h1>
      </div>
      <div>
        <h2 v-if="!hiperMobile">{{ item.vote_average }}/10</h2>
        <h2 v-if="item.runtime && !mobile">{{ item.runtime }} minutes</h2>
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


.paginator {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  gap: 10px;

  * {
    cursor: pointer;
  }
}

.paginator-button {
  padding: 6px 12px;
  background-color: var(--background-contrast-mid);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.paginator-button:hover:not(.disabled) {
  background-color: var(--text-contrast);
  color: var(--background-contrast);
}

.paginator-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.page-number:hover {
  background-color: var(--background-contrast-mid);
}

.page-number.active {
  background-color: var(--text);
  color: var(--contrast-1-2);
}

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
  margin: 0 15%;
}

.content {
  background-color: var(--background-contrast-mid);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  margin: 1rem;
  min-width: 325px;
  cursor: pointer;

  * {
    margin: 0 1rem;
    cursor: pointer;
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
  width: 65%;
  margin: 4rem auto;
  background-color: var(--background-contrast);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 325px;

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

@media (max-width: 1200px) {
  .content-title {
    font-size: 2rem;
  }
}

@media (max-width: 520px) {
  .content-title {
    font-size: 1.2rem;
  }
}
</style>
