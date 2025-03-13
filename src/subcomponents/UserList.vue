<script>
export default {
  name: "UserList",
  props: {
    users: Array
  }
}
</script>

<template>
  <div id="container">
    <div v-if="this.users"
         v-for="user in this.users"
         :key="user.id" style="width: 100%;">
      <router-link :to="user.username" class="no-underline">
        <div class="user-card">
          <h1 class="username">@{{ user.username }}</h1>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>

#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.user-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--background-contrast-mid);
}

.username {
  font-size: 1.5rem;
  font-family: "GTVCS", serif;
}

.no-underline {
  width: 100%;
  text-decoration: none;
}

</style>