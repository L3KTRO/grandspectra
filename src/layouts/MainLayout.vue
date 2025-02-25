<script>
import Header from '@/components/Header.vue'
import Footer from "@/components/Footer.vue";

export default {
  name: 'MainLayout',
  components: {
    Header,
    Footer
  }
}
</script>

<template>
  <div id="wrapper">
    <Header/>
    <main>
      <router-view></router-view>
    </main>
    <Footer/>
  </div>
</template>

<style scoped>

#wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Abarca toda la altura de la pantalla */
}

main {
  flex: 1; /* El contenido principal ocupa el espacio restante */
}

</style>
