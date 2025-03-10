<script>
import ContentList from "@/subcomponents/ContentList.vue";
import Cast from "@/subcomponents/Cast.vue";
import {ref} from "vue";
import useApi from "@/composables/api.js";
import router from "@/router.js";

const {request} = useApi();

export default {
  name: "Content",
  components: {Cast, ContentList},
  data() {
    return {
      data: ref({
        id: null,
        poster: null,
        title: null,
        overview: null,
        runtime: null,
        release: null,
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
      })
    }
  },
  async mounted() {
    const response = await request("/movies/" + this.$route.params.id)
    if (response.status !== 200) return router.push("/notfound")
    const {
      id,
      title,
      poster,
      overview,
      release_date,
      runtime,
      vote_count,
      vote_average,
      credits,
      genres
    } = response.data
    this.data.id = id
    this.data.title = title
    this.data.poster = poster
    this.data.overview = overview
    this.data.release = !isNaN(new Date(release_date).getFullYear()) ? new Date(release_date).getFullYear() : null
    this.data.runtime = runtime > 0 || runtime !== null ? runtime : null
    this.data.tmdb_vote.average = vote_average
    this.data.tmdb_vote.count = vote_count
    this.data.credits = credits.sort((a, b) => parseInt(a.order) - parseInt(b.order))

    const directors = this.data.credits.filter(a => a.occupation_id === 2)
    this.data.director = directors.length > 0 ? directors[0].person : "Unknown"
    this.data.genres = genres.slice(0, 8)
  }
}
</script>

<template>
  <div id="body">
    <div id="initial">
      <img :src="data.poster ?? 'https://placehold.co/225x337'" alt="Media" id="poster"/>
      <div id="metadata">
        <h1 class="title">{{ data.title }}</h1>
        <div id="additional-metadata">
          <h2>Directed by <a :href="'/person/'+data.director.id">{{ data.director.name }}</a></h2>
          <div class="metadata">
            <h3 v-if="data.release">Release: {{ data.release }}</h3>
            <h3 v-if="data.genres.length !== 0">Genres: {{ data.genres.map(x => x.name).join(", ") }}</h3>
            <h3 v-if="data.runtime">Runtime: {{ data.runtime }}m</h3>
            <h3 v-if="data.tmdb_vote.average !== null && data.tmdb_vote.average.count !== null">
              TMDB: {{ data.tmdb_vote.average }}/10 ({{ data.tmdb_vote.count }} votes)</h3>
          </div>
        </div>
        <p id="overview">{{ data.overview }}</p>
        <div id="external-data" class="metadata">
          <h3>More info in: </h3>
          <a>TMDB</a>
          <a>IMDB</a>
        </div>
      </div>
    </div>
    <div id="final">
      <Cast :people="data.credits" />
      <div id="actions">
        <h1 style="font-size: 1.5rem; font-weight: bold">Actions</h1>
        <div class="action">Mark as watched</div>
        <div class="action">Add to watchlist</div>
        <div class="action">Add to favourites</div>
        <div class="action">Rate</div>
        <div class="action">Share</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#external-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

  * {
    margin-right: 1rem;
  }
}

#actions {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 3rem 0;
  background-color: var(--background-contrast);
  flex-basis: 20%;
  height: fit-content;
}

.title {
  font-family: 'CharisSIL', "GTVCS", serif;
  font-size: 3rem;
  font-weight: normal;
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
  max-height: 10rem;
}

#body {
  margin: 4rem 10rem;
}

#body > div {
  display: flex;
  flex-direction: row;
  margin: 2rem 0;
}

#poster {
  width: 225px;
  height: 337.5px;
}
</style>