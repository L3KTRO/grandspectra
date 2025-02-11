<script>
export default {
  name: "Header"
}
</script>

<template>
  <header id="header">
    <h1 class="header-item light-neon-effect-text" id="header-title">GRAND SPECTRA</h1>
    <div class="header-item" id="header-login">
      <h3 class="light-neon-effect-text">INICIA SESIÓN</h3>
    </div>
  </header>
</template>

<style scoped>
#header {
  background-color: var(--background-contrast);
  color: var(--text);
  text-align: center;
  width: 100vw;
  height: 5.5rem;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  filter: drop-shadow(0 0 20px rgba(251, 43, 43, 0.5)) ;
  box-shadow: inset 0 -10px 10px -10px rgba(251, 43, 43, 0.5);
}

.header-item {
  padding: 10px;
  margin: 2rem;
  font-size: 1.5em;
  font-weight: bold;
}

#header-title {
  font-size: 3rem;
}

#header-login {
  padding: 0.35rem 1.5rem;
  border-radius: 10px;
  color: var(--contrast-1-2);
  background-color: var(--text);
}
</style>