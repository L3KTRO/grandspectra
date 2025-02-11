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
}

#quote {
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  padding: 11rem 0 0;
}
</style>