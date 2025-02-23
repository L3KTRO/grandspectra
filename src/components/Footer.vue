<script>
import GrandSpectraBrand from "@/subcomponents/GrandSpectraBrand.vue";

export default {
  name: 'Footer',
  components: {GrandSpectraBrand}
}
</script>

<template>
  <footer class="grand-spectra-footer">
    <div class="footer-brand">
      <div>
        <h4>Datos básicos de IMDB datasets</h4>
      </div>
      <div>
        <h4>Datos de plataformas de JustWatch</h4>
      </div>
      <div>
        <h4>Datos adicionales de TMDB API</h4>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Grand Spectra. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.grand-spectra-footer {
  background: var(--background-contrast-mid);
  color: var(--text-contrast);
  padding: 2rem 0;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

/* Marca */
.footer-brand {
  flex: 1 1 250px;
  margin-bottom: 1.5rem;
  min-width: 10rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

/* Navegación */
.footer-nav {
  display: flex;
  flex: 2 1 500px;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.footer-column h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column li {
  margin-bottom: 0.5rem;
}

.footer-column a {
  color: #f1f1f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #ff9800;
}

/* Contacto */
.footer-contact {
  flex: 1 1 250px;
  margin-bottom: 1.5rem;
}

.footer-contact h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.footer-social a {
  color: #f1f1f1;
  margin-right: 1rem;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.footer-social a:hover {
  color: #ff9800;
}

/* Pie de página */
.footer-bottom {
  text-align: center;
  font-size: 0.8rem;
  border-top: 1px solid #444;
  padding-top: 1rem;
}
</style>
