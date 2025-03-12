<script>
export default {
  name: "ContentMetadata",
  props: {
    data: {
      type: Object,
      default: {
        id: null,
        poster: null,
        title: null,
        name: null,
        overview: null,
        runtime: null,
        release: null,
        first_date: null,
        last_date: null,
        credits: [],
        genres: [],
        director: {
          name: null,
          id: null
        },
        tmdb_vote: {
          average: null,
          count: null
        }
      }
    }
  },
  data() {
    console.log(this.data)
    return {
      tmdbTv: "https://www.themoviedb.org/tv/",
      tmdbMovie: "https://www.themoviedb.org/movie/",
      imdbEndpoint: "https://www.imdb.com/title/tt",
      windowWidth: window.innerWidth
    }
  },
  computed: {
    mobile() {
      return this.windowWidth < 960;
    },
    hiperMobile() {
      return this.windowWidth < 450;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
}
</script>

<template>
  <div id="initial">
    <div v-if="mobile" style="display: flex; justify-content: center; flex-direction: column; min-width: 250px">
      <img :src="data.poster ?? 'https://placehold.co/225x337'" alt="Media" id="poster"/>
      <p id="overview" v-if="mobile">{{ data.overview }}</p>
    </div>
    <div v-else-if="hiperMobile"
         style="display: flex; justify-content: center; flex-direction: column; min-width: 250px">
      <img :src="data.poster ?? 'https://placehold.co/225x337'" alt="Media" id="poster"/>
      <p id="overview" v-if="mobile">{{ data.overview }}</p>
    </div>
    <img v-else :src="data.poster ?? 'https://placehold.co/225x337'" alt="Media" id="poster"/>
    <div id="metadata" v-if="!hiperMobile">
      <h1 id="title">{{ data.title }}</h1>
      <div id="additional-metadata" :style="mobile ? 'flex-direction: column; gap: 1rem' : ''">
        <h2>Directed by
          <router-link :to="'/person/'+data.director.id">{{ data.director.name }}</router-link>
        </h2>
        <div class="metadata" :style="mobile ? 'flex-direction: column; gap: 1rem' : ''">
          <h3 v-if="data.release">Release: {{ data.release }}</h3>
          <h3 v-if="data.first_date">Air Date: {{ data.first_date }} to {{ data.last_date }}</h3>
          <h3 v-if="data.genres.length !== 0">Genres: {{ data.genres.map(x => x.name).join(", ") }}</h3>
          <h3 v-if="data.runtime">Runtime: {{ data.runtime }}m</h3>
          <h3 v-if="data.tmdb_vote.average !== null && data.tmdb_vote.average.count !== null">
            TMDB: {{ data.tmdb_vote.average }}/10 ({{ data.tmdb_vote.count }} votes)</h3>
        </div>
      </div>
      <p v-if="!mobile" id="overview">{{ data.overview }}</p>
      <div id="external-data" class="metadata">
        <h3>More info in: </h3>
        <a :href="data.first_date ? this.tmdbTv+data.id : this.tmdbMovie+data.id">TMDB</a>
        <a :href="this.imdbEndpoint+data.imdb_id" v-if="data.imdb_id">IMDB</a>
      </div>
    </div>
  </div>
</template>

<style scoped>

#external-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

#additional-metadata {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
}

a {
  font-weight: bold;
}

.metadata {
  display: flex;
  flex-direction: row;
  color: var(--text-contrast-mid);
  margin: 1rem 0;
  width: 500px;

  * {
    margin-right: 1rem;
  }
}

#title {
  font-family: 'CharisSIL', "GTVCS", serif;
  font-size: 3rem;
  font-weight: bold;
}

#metadata {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0 2rem;
}

#overview {
  font-size: 1.15rem;
  margin: 1rem;
  min-height: 5rem;
}

#body > div {
  display: flex;
  flex-direction: row;
  margin: 2rem 0;
}

#poster {
  height: 337.5px;
  width: 225px
}
</style>