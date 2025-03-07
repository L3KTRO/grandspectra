<script>
export default {
  name: "NotFound"
}
</script>

<template>
  <div id="imaging">
    <h1 id="title" class=light-neon-effect-text>Are you lost?</h1>
  </div>
</template>

<style scoped>
#title {
  font-size: 5rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  font-weight: bold;
}

#imaging {
  color: var(--text);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 62.5vw;
  height: 57vh;
  margin: 4rem auto;
  overflow: hidden;
  background-image: url("@/assets/notfound.jpg");
  background-color: rgba(17, 17, 17, 0.9);
  background-blend-mode: lighten;
  background-repeat: no-repeat;
  background-size: cover;
  mask-image: radial-gradient(ellipse, var(--background), transparent 80%);
  mask-mode: alpha;
  border: solid 1.5em rgba(17, 17, 17, 0.9);

  /* El blur suaviza la transición y minimiza los cortes */
}

#imaging img {
  display: block;
  width: auto;
  max-width: 100%;
}

/* Pseudo-elemento para crear el efecto de sombreado interno con bordes difuminados */
#imaging::after {
  content: "";
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Degradado radial que va de transparente en el centro a semitransparente en los bordes */

}
</style>
