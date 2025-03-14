<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ContentList from "@/subcomponents/ContentList.vue";
import useApi from "@/helpers/api.js";

const {request} = useApi();

export default {
  name: "Home",
  components: {ContentList, Footer, Header},
  data() {
    return {
      popularMovies: [],
      popularShows: [],
      windowWidth: window.innerWidth
    }
  },
  computed: {
    mobile() { // Responsive
      return this.windowWidth < 750;
    }
  },
  mounted() { // Responsive
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() { // Responsive
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() { // Responsive
      this.windowWidth = window.innerWidth;
    }
  },
  async beforeMount() {
    // Obtenemos las películas y series más populares
    const res = await request("/movies?sort_by=popularity&sort_dir=desc")
    this.popularMovies = res.data.data
    const res2 = await request("/tv?sort_by=popularity&sort_dir=desc")
    this.popularShows = res2.data.data
  }
}
</script>

<template>
  <div id="slogan"><p id="quote" class="light-neon-effect-text" :style="mobile ? 'padding: 6rem 0 0' : '' "> Keep track
    of
    your favorite movies and TV shows, <br>
    rate them and share with your friends. </p></div>
  <div id="features" :style="mobile ? 'flex-direction: column; gap: 2rem' : ''">
    <div class="feature-container"><h2>Organize your content</h2>
      <p>Keep your watched list organized and accessible at all times.</p>
    </div>
    <div class="feature-container"><h2>Don't know what to watch? Check Spectra Hub</h2>
      <p>Our database has more than 1 million movies and more than 150,000 tv shows <br/>
        <span style="font-style: italic">More filters soon.</span>
      </p>
    </div>
    <div class="feature-container"><h2>Share with your friends</h2>
      <p>Share your ratings, watchlist and watched content.</p>
    </div>
  </div>

  <div id="trending">
    <div>
      <h1 class="trend-title light-neon-effect-text">Popular movies</h1>
      <ContentList :content="this.popularMovies"/>
    </div>
    <div>
      <h1 class="trend-title light-neon-effect-text">Popular series</h1>
      <ContentList :content="this.popularShows"/>
    </div>
  </div>

</template>

<style scoped>

.trend-title {
  margin: 0 2rem;
  font-weight: bold;
  font-size: 1.25rem;
}

#trending {
  display: flex;
  flex-direction: column;
}

#quote {
  font-family: 'CharisSIL', "GTVCS", serif;
  margin: 0 1rem;
}

#slogan {
  height: 350px;
  background-image: url('@/assets/slogan-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
  mask-mode: alpha;
  min-width: 100%;
}

#quote {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  padding: 11rem 0 0;
}

#features {
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;
  margin: 0 auto;
  max-width: 1600px;
}

.feature-container {
  flex: 1;
  margin: 0 2rem;
  padding: 1.5rem;
  background: linear-gradient(to bottom, var(--background-contrast), var(--background));
  color: var(--text);
  border-radius: 8px;
  text-align: center;
  font-family: "GTVCS", serif;
}

.feature-container h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  font-weight: bold;
}

.feature-container p {
  font-size: 1.05rem;
}
</style>
