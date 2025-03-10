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
  name: "Tv",
  components: {ContentMetadata, ContentActions, Cast, ContentList},
  data() {
    return {
      data: ref({
        id: null,
        poster: null,
        title: null,
        overview: null,
        runtime: null,
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
      })
    }
  },
  async mounted() {
    const response = await request("/tv/" + this.$route.params.id)
    console.log(response)
    if (response.status !== 200) return router.push("/notfound")
    const {
      id,
      name,
      poster,
      overview,
      first_air_date,
      last_air_date,
      runtime,
      vote_count,
      vote_average,
      credits,
      genres
    } = response.data
    this.data.id = id
    this.data.title = name
    this.data.poster = poster
    this.data.overview = overview
    this.data.first_date = !isNaN(new Date(first_air_date).getFullYear()) ? new Date(first_air_date).getFullYear() : null
    this.data.last_date = !isNaN(new Date(last_air_date).getFullYear()) ? new Date(last_air_date).getFullYear() : "Present"
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
    <ContentMetadata :data="data"/>
    <div id="final">
      <Cast :people="data.credits"/>
      <ContentActions/>
    </div>
  </div>
</template>

<style scoped>
#body {
  margin: 4rem 10rem;
}
</style>