<script>
import ContentList from "@/subcomponents/ContentList.vue";
import ContentListWrap from "@/subcomponents/ContentListWrap.vue";
import {useAuthStore} from "@/stores/auth.js";
import useApi from "@/composables/api.js";
import {ref} from "vue";

const {request} = useApi();

export default {
  name: "Profile",
  components: {ContentListWrap, ContentList},
  data() {
    return {
      store: useAuthStore(),
      activeView: 'watched',
      data: ref({
        watched: [],
        rated: [],
        watchlist: []
      }),
      isLoading: ref(true)
    }
  },
  watch: {},
  computed: {
    currentContent() {
      console.log(this.data)
      return this.data[this.activeView]
    }
  },
  methods: {
    setActiveView(view) {
      this.activeView = view
    },
    logout() {
      this.store.logout();
      this.$router.push("/signin");
    }
  },
  async mounted() {
    const res = await request('/me')
    if (res.status !== 200) return this.isLoading = false
    this.data.rated = res.data.contents.ratings.map((item) => item.loaded)
    this.data.watchlist = res.data.contents.watchlist.map((item) => item.loaded)
    this.data.watched = res.data.contents.watched.map((item) => item.loaded)
    this.isLoading = false
  },
}
</script>

<template>
  <div id="content">
    <div id="profile">
      <div id="profile-left">
        <div id="profile-data">
          <h1>{{ store.user.username }}</h1>
          <p>{{ store.user.email }}</p>
        </div>
        <div class="button" style="margin-left: 1rem" @click="logout">
          <h2 id="logout">Logout</h2>
        </div>
      </div>
      <div id="follows">
        <div class="follow-data">
          <h2>0</h2>
          <h3>Followers</h3>
        </div>
        <div class="follow-data">
          <h2>0</h2>
          <h3>Following</h3>
        </div>
      </div>
    </div>
    <nav id="views-bar">
      <div @click="setActiveView('watched')" :class="{ underline: activeView === 'watched' }">Watched</div>
      <div @click="setActiveView('rated')" :class="{ underline: activeView === 'rated' }">Rated</div>
      <div @click="setActiveView('watchlist')" :class="{ underline: activeView === 'watchlist' }">Watchlist</div>
    </nav>
    <div v-if="isLoading" style="display: flex; justify-content: center;">
      <h2 id="title">Cargando...</h2>
    </div>
    <div v-else id="contents">
      <ContentListWrap :content="currentContent"/>
    </div>
  </div>
</template>

<style scoped>

#profile-left {
  min-width: 30vw;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#logout {
  padding: 0.5rem 1rem;
}

.underline {
  text-decoration: underline;
  font-weight: bold;
}

.follow-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-contrast);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
}

#follows {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

#views-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  margin: 3rem 1rem;
  padding: 1rem 0;
  background-color: var(--background-contrast-mid);

  div {
    cursor: pointer;
  }
}

#profile {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

#content {
  margin: 5rem 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>