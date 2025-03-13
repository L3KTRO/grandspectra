<script>
import ContentList from "@/subcomponents/ContentList.vue";
import ContentListWrap from "@/subcomponents/ContentListWrap.vue";
import {useAuthStore} from "@/stores/auth.js";
import {useChangesStore} from '@/stores/global.js'
import useApi from "@/helpers/api.js";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import router from "@/router.js";
import UserList from "@/subcomponents/UserList.vue";

const {request} = useApi();


export default {
  name: "Profile",
  components: {UserList, ContentListWrap, ContentList},
  data() {
    const changesStore = useChangesStore()
    const {meSync} = storeToRefs(changesStore)

    return {
      store: useAuthStore(),
      username: this.$route.params.username,
      email: "",
      unsubscribeChangesStore: null,
      activeView: 'watched',
      sync: meSync,
      data: {
        watched: [],
        rated: [],
        watchlist: []
      },
      following: [],
      followers: [],
      follow: this.isCurrentlyFollowing,
      isLoading: true,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    currentContent() {
      return this.data[this.activeView]
    },
    mobile() {
      return this.windowWidth < 970;
    },
    hiperMobile() {
      return this.windowWidth < 450;
    },
    self() {
      return this.store.user && this.$route.params.username === this.store.user.username
    },
    isCurrentlyFollowing() {
      if (this.self) return null;
      return this.followers.map((user) => user.id).includes(this.store.user.id)
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    setActiveView(view) {
      this.activeView = view
    },
    logout() {
      this.store.logout();
      this.$router.push("/signin");
    },
    refresh() {
      if (this.isLoading) return;
      this.fetch().then();
    },
    mapper(content) {
      return content.tv || content.movie
    },
    async fetch() {
      this.isLoading = true
      const path = this.self ? "/me" : "/users/" + this.$route.params.username
      const res = await request(path)
      if (res.status !== 200) return this.isLoading = false
      this.username = res.data.username
      this.email = res.data.email
      this.data.rated = res.data.ratings.map(this.mapper)
      this.data.watchlist = res.data.watchlist.map(this.mapper)
      this.data.watched = res.data.watched.map(this.mapper)
      this.following = res.data.following
      this.followers = res.data.followers
      this.isLoading = false
      this.follow = this.isCurrentlyFollowing
    },
    async updateToDb() {
      const path = `/me/follow/${this.$route.params.username}`
      if ((this.isCurrentlyFollowing !== null) && (this.isCurrentlyFollowing !== this.follow)) {
        if (this.follow) {
          await request(path, {method: 'PUT'})
        } else {
          await request(path, {method: 'DELETE'})
        }
      }
    },
  },
  watch: {
    sync() {
      if (!this.self) return;
      console.log("fetching")
      this.fetch().then(() => {
      })
    },
    $route() {
      this.fetch().then(() => {
      })
    }
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize);
    await this.fetch();
  },
  async beforeUnmount() {
    console.log("beforeUnmount");
    window.removeEventListener('resize', this.handleResize);
    await this.updateToDb()
  },
  async beforeRouteUpdate() {
    await this.updateToDb()
  }
}
</script>

<template>
  <div id="content" :style="mobile ? 'margin: 5rem 5%' : ''">
    <div id="profile" :style="hiperMobile ? 'flex-direction: column; gap: 2rem' : ''">
      <div id="profile-left">
        <div id="profile-data">
          <h1>@{{ username }}</h1>
          <p>{{ email }}</p>
        </div>
        <div v-if="self" class="button button-right" @click="logout">
          <h2 class="label-button-right">Logout</h2>
        </div>
        <div v-else-if="!self && !follow" class="button button-right"
             @click="follow = true">
          <h2 class="label-button-right">Follow</h2>
        </div>
        <div v-else-if="!self && follow" class="button button-right"
             @click="follow = false">
          <h2 class="label-button-right">Unfollow</h2>
        </div>
      </div>
      <div id="follows" @click="setActiveView('follows')"
           :style="this.activeView === 'follows' ? 'background-color: var(--background-contrast-mid)' : ''"
      >
        <div class="follow-data">
          <h2>{{ followers.length }}</h2>
          <h3>Followers</h3>
        </div>
        <div class="follow-data">
          <h2>{{ following.length }}</h2>
          <h3>Following</h3>
        </div>
      </div>
    </div>
    <nav id="views-bar" :style="hiperMobile ? 'flex-direction: column; gap: 2rem' : ''">
      <div :style="hiperMobile ? '' : 'margin-left: 1rem;'" :class="isLoading ? 'refresh' : 'refresh-disabled'"
           @click="refresh">Refresh
      </div>
      <div style="display: flex; flex-direction: row; gap: 1rem"
           :style="hiperMobile ? 'flex-direction: column; gap: 1rem; align-items:center;' : ''">
        <div @click="setActiveView('watched')" :class="{ underline: activeView === 'watched' }">Watched</div>
        <div @click="setActiveView('rated')" :class="{ underline: activeView === 'rated' }">Rated</div>
        <div @click="setActiveView('watchlist')" :class="{ underline: activeView === 'watchlist' }">Watchlist</div>
      </div>
      <div style="color: var(--background-contrast-mid)" v-if="!hiperMobile">Refresh</div>
    </nav>
    <div v-if="isLoading" style="display: flex; justify-content: center;">
      <h2 id="title">Cargando...</h2>
    </div>
    <div v-else-if="['watched', 'watchlist', 'rated'].includes(this.activeView)" id="contents">
      <ContentListWrap :content="currentContent"/>
    </div>
    <div v-else id="follow-users">
      <div class="follow-col">
        <div class="follow-title-content">
          <h1 class="follow-title">Following</h1>
        </div>
        <UserList :users="following"/>
      </div>
      <div class="follow-col">
        <div class="follow-title-content">
          <h1 class="follow-title">Followers</h1>
        </div>
        <UserList :users="followers"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.follow-col {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.follow-title-content {
  font-family: 'CharisSIL', "GTVCS", serif;
  font-size: 1.75rem;
  border-bottom: 1px solid var(--shadow-darker);
  background: linear-gradient(to top, rgba(251, 43, 43, 0.15), var(--background) 80%);
  margin: 0 1rem;
  padding: 1rem;
  text-align: center;
  width: 100%;

  * {
    text-align: center;
    text-transform: uppercase;
  }
}

#follow-users {
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
  gap: 10rem;
}

.follow-col {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.underline {
  text-decoration: underline;
  font-weight: bold;
}

.refresh {
  color: var(--text-contrast);
  transition: 0.5s;
}

.refresh-disabled {
  color: var(--text-contrast-mid);
  cursor: not-allowed;
  transition: 0.5s;
}

#profile-left {
  min-width: 30vw;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.button-right {
  margin-left: 1rem
}

.label-button-right {
  padding: 0.5rem 1rem;
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
  justify-content: space-between;
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