<script>
import GrandSpectraBrand from "@/subcomponents/GrandSpectraBrand.vue";
import {useAuthStore} from '@/stores/auth';
import {useRouter} from 'vue-router';

export default {
  name: "Header",
  components: {GrandSpectraBrand},
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
      authStore.logout();
      router.push('/');
    };

    return {
      authStore,
      handleLogout
    };
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
          <h3 class="header-nav">SPECTRA HUB</h3>
        </div>
      </router-link>
    </div>

    <div id="buttons">
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile">
          <div class="header-item header-button button">
            <h3 class="light-neon-effect-text">PROFILE</h3>
          </div>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/signin">
          <div class="header-item header-button button">
            <h3 class="light-neon-effect-text">SIGN IN</h3>
          </div>
        </router-link>
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
</style>