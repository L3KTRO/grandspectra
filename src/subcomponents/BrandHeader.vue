<script>
// Unicamente usado para mostrar el nombre del sitio
export default {
  name: "BrandHeader",
  props: {
    title: {
      type: String,
      default: "GRAND SPECTRA"
    }
  }
}

</script>

<template>
  <div id="brand-header">
    <h1 class="light-neon-effect-text" id="title">{{ title }}</h1>
  </div>
</template>


<style scoped>
#title {
  font-size: 3rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  align-self: center;
  width: 50vw;
  background-color: var(--text);
  margin: 0 auto;
  padding: 0 1rem;
  border-top: 1px solid var(--contrast-1-2);
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  color: var(--contrast-1-2);
}
</style>
