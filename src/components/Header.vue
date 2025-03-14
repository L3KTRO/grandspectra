<script>
import GrandSpectraBrand from "@/subcomponents/GrandSpectraBrand.vue";
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';

export default {
  name: "Header",
  components: {GrandSpectraBrand},
  data() {
    const authStore = useAuthStore();
    return {
      windowWidth: window.innerWidth,
      authStore,
    };
  },
  computed: {
    hub() {
      return this.windowWidth > 700 ? "SPECTRA HUB" : "HUB";
    },
    members(){
      return this.windowWidth > 700 ? "SPECTATORS" : this.windowWidth > 650 ? "SPECTATORS" : "SPCTR";
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
  <header id="header">
    <div class="header-item">
      <GrandSpectraBrand/>
    </div>

    <div id="items">
      <router-link to="/hub">
        <div class="header-item">
          <h3 class="header-nav">{{ hub }}</h3>
        </div>
      </router-link>

      <router-link to="/members">
        <div class="header-item">
          <h3 class="header-nav">{{ members }}</h3>
        </div>
      </router-link>
    </div>

    <div id="buttons">
      <template v-if="authStore.isAuthenticated">
        <router-link :to="'/'+authStore.user.username">
          <div class="header-item header-button button">
            <h3 class="light-neon-effect-text" id="profile">PROFILE</h3>
          </div>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/signup">
          <div class="header-item header-button button">
            <h3 class="light-neon-effect-text">JOIN US</h3>
          </div>
        </router-link>
      </template>
    </div>
  </header>
</template>

<style scoped>

#items {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.header-nav {
  font-size: 1.35rem;
  font-weight: 900;
  font-family: "GTVCS", serif;
  color: #f1e1cb;
  transition: 0.3s ease-in-out;
}

.header-nav:hover {
  color: var(--text);
  transition: 0.3s ease-in-out;
  text-shadow: 0 0 15px var(--contrast-1);
}

* {
  text-decoration: none;
}

#buttons {
  display: flex;
  flex-direction: row;
}

#header {
  font-family: 'CharisSIL', "GTVCS", serif;
  background-color: var(--background-contrast);
  color: var(--text);
  text-align: center;
  height: 5.5rem;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  filter: drop-shadow(0 0 20px rgba(251, 43, 43, 0.5));
  box-shadow: inset 0 -15px 20px -10px rgba(251, 43, 43, 0.2);
}

.header-item {
  padding: 10px;
  margin: 0 1rem;
  font-size: 1.5em;
  font-weight: bold;
}

.header-button {
  padding: 0.35rem 1.5rem;
  border-radius: 10px;
}

@media (max-width: 500px) {

  .header-item {
    margin: 0 0.25rem;
  }

  .header-button {
    max-height: 50px;
    padding: 0.15rem 1rem 0.30rem;
    margin: 0 0.5rem;

    h3 {
      white-space: nowrap;
      display: inline;
      font-size: 1.25rem;
    }
  }
}
</style>