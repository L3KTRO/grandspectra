<script>
import router from "@/router.js";
import useApi from "@/helpers/api.js";
import {ref} from "vue";
import ContentListWrap from "@/subcomponents/ContentListWrap.vue";

const {request} = useApi();

export default {
  name: "Person",
  components: {ContentListWrap},
  data() {
    return {
      data: ref({
        still: null,
        name: null,
        credits: []
      })
    }
  },
  async beforeMount() {
    const response = await request("/people/" + this.$route.params.id)
    console.log(response)
    if (response.status !== 200) return router.push("/notfound")
    const {still, name, biography, credits} = response.data

    this.data.still = still
    this.data.name = name
    this.data.biography = biography
    this.data.credits = credits
        .filter((item) => item.movie)
        .filter((obj, indx, self) =>
            self.findIndex(item => {
              return item.movie.id ? item.movie.id === obj.movie.id : item.tv.id === obj.tv.id
            }) === indx
        )
        .sort((a, b) => b.movie.popularity - a.movie.popularity)
        .map((item) => item.movie || item.tv)

  }
}
</script>

<template>
  <div id="body">
    <div id="person">
      <img id="still" :src="data.still" alt="person"/>
      <p id="biography">{{ data.biography }}</p>
    </div>
    <div id="contents">
      <h2 id="starring">FILMS STARRING</h2>
      <h1 id="name">{{ data.name }}</h1>
      <ContentListWrap :content="data.credits"/>
    </div>
  </div>
</template>

<style scoped>

#body {
  display: flex;
  flex-direction: row;
  margin: 4rem 15rem;
}

#person {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 0 2rem;
}

#biography {
  margin: 0.75rem;
}

#name {
  font-size: 3rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  font-weight: bold;
}

#still {
  width: 300px;
}

#starring {
  font-size: 1rem;
  color: var(--text-contrast-mid);
}

#contents {
  margin: 1rem;
  width: 75%;
}

</style>