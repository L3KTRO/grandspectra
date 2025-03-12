<script>
export default {
  name: "GrandSpectraBrand"
}
</script>

<template>
  <router-link id="title" to="/">GRAND SPECTRA</router-link>
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

#title:hover {
  text-shadow: 0 0 25px rgba(251, 43, 43, 1);
  transition: 0.5s ease-in-out;
}
</style>