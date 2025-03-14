<script>
import ContentList from "@/subcomponents/ContentList.vue";
import Cast from "@/subcomponents/Cast.vue";
import {ref} from "vue";
import useApi from "@/helpers/api.js";
import router from "@/router.js";
import ContentActions from "@/subcomponents/ContentActions.vue";
import ContentMetadata from "@/subcomponents/ContentMetadata.vue";

const {request} = useApi();

export default {
  name: "Movie",
  components: {ContentMetadata, ContentActions, Cast, ContentList},
  data() {
    return {
      isLoading: false,
      contentId: this.$route.params.id,
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
      }),
      windowWidth: window.innerWidth
    }
  },
  computed: {
    mobile() {
      return this.windowWidth < 875;
    },
    hiperMobile() {
      return this.windowWidth < 600;
    }
  },
  beforeMount() {
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
  async mounted() {
    this.isLoading = true
    const response = await request("/movies/" + this.$route.params.id)
    this.isLoading = false
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
    this.data.credits = credits

    const directors = this.data.credits.filter(a => a.occupation_id === 2)
    this.data.director = directors.length > 0 ? directors[0].person : "Unknown"
    this.data.genres = genres.slice(0, 8)

  }
}
</script>

<template>
  <div class="body-content" v-if="!isLoading" :style="hiperMobile ? 'margin: 4rem 2rem;' : ''">
    <ContentMetadata :data="data"/>
    <div v-if="!mobile" class="content-part-final">
      <Cast :people="data.credits"/>
      <ContentActions :contentId="contentId"/>
    </div>
    <div v-else class="content-part-final-mobile">
      <ContentActions :contentId="contentId"/>
      <Cast :people="data.credits"/>
    </div>
  </div>
  <div id="body-content" v-else>
    <h1>Loading...</h1>
  </div>
</template>

<style>
.body-content {
  margin: 4rem 5rem;
}

.content-part-final {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.content-part-final-mobile {
  display: flex;
  flex-direction: column;
}

@media (max-width: 750px) {
  .body-content {
    margin: 4rem 2rem;
  }
}
</style>