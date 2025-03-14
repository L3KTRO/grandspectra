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
      }),
      windowWidth: window.innerWidth
    }
  },
  computed: {
    mobile() {
      return this.windowWidth < 1100;
    },
    hiperMobile() {
      return this.windowWidth < 650;
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
  async beforeMount() {
    const response = await request("/people/" + this.$route.params.id)
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
  <div id="body" :style="hiperMobile ? 'flex-direction: column;' : ''">
    <div id="person">
      <img id="still" :src="data.still" alt="person"/>
      <div v-if="mobile">
        <h1 id="name">{{ data.name }}</h1>
      </div>
      <p id="biography">{{ data.biography }}</p>
    </div>
    <div id="contents">
      <div v-if="!mobile">
        <h2 id="starring">FILMS STARRING</h2>
        <h1 id="name">{{ data.name }}</h1>
      </div>
      <h2 id="starring" v-if="mobile">FILMS STARRING</h2>
      <ContentListWrap :content="data.credits"/>
    </div>
  </div>
</template>

<style scoped>

#body {
  display: flex;
  flex-direction: row;
  margin: 4rem 5%;
}

#person {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

#biography {
  margin: 0.75rem 2rem;
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
  flex-grow: 2;
  margin: 1rem;
}

</style>