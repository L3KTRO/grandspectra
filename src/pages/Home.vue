<script>
import Header from "@/components/Header.vue";

export default {
  name: "Home",
  components: {Header}
}
</script>

<template>
  <Header/>
  <div id="slogan">
    <p id="quote" class="light-neon-effect-text">
      Sigue de cerca tus películas y series favoritas, <br>
      califícalas y comparte con tus amigos.
    </p>
  </div>
  <!-- New Features Section -->
  <div id="features">
    <div class="feature-container">
      <h2>Organiza tu contenido</h2>
      <p>Mantén tu lista de vistas ordenada y accesible en todo momento.</p>
    </div>
    <div class="feature-container">
      <h2>¿No sabes que ver? SpectrAI</h2>
      <p>Nuestra inteligencia artificial *SpectrAI* se encargará de recomendarte contenidos basados en tus gustos y en
        el momento.<br> Disponible próximamente</p>
    </div>
    <div class="feature-container">
      <h2>Comparte con tus amigos</h2>
      <p>Comparte tus favoritos, califica y comenta los shows y películas que más te gustan.</p>
    </div>
  </div>
</template>

<style scoped>
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

/* New styles for the features section */
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
