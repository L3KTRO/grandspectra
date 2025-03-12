<script>
import ContentList from "@/subcomponents/ContentList.vue";
import Cast from "@/subcomponents/Cast.vue";
import {ref} from "vue";
import useApi from "@/composables/api.js";
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
    }
  },
  async beforeMount() {
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
  <div id="body" v-if="!isLoading">
    <ContentMetadata :data="data"/>
    <div id="final">
      <Cast :people="data.credits"/>
      <ContentActions :content-id="contentId"/>
    </div>
  </div>
  <div v-else style="display: flex; flex-direction: column; align-items: center">
    <h1 style="font-size: 3rem; margin: 5rem">Loading...</h1>
  </div>
</template>

<style scoped>
#body {
  margin: 1rem 10rem;
}

#final {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>