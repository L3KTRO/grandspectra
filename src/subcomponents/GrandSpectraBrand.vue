<script>
export default {
  name: "GrandSpectraBrand",
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    title() {
      return this.windowWidth > 1000 ? "GRAND SPECTRA" : "GS";
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
  }
}
</script>

<template>
  <router-link id="title" to="/">{{ title }}</router-link>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  max-height: 90px;
}

#title {
  font-size: 3rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  font-weight: bold;
  transition: 0.5s ease-in-out;
  text-shadow: 0 0 15px rgba(251, 43, 43, 0.75);
}

@media (max-width: 400px) {
  #title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

#title:hover {
  text-shadow: 0 0 25px rgba(251, 43, 43, 1);
  transition: 0.5s ease-in-out;
}
</style>