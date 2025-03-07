<script>
import ContentList from "@/subcomponents/ContentList.vue";
import ContentListWrap from "@/subcomponents/ContentListWrap.vue";

export default {
  name: "Profile",
  components: {ContentListWrap, ContentList},
  data() {
    return {
      activeView: 'watched',
      contentData: {
        watched: [
          {id: 9, title: 'Media 9', image: 'https://placehold.co/150x225'},
          {id: 10, title: 'Media 10', image: 'https://placehold.co/150x225'},
        ],
        rated: [
          {id: 2, title: 'Media 2', image: 'https://placehold.co/150x225'},
          {id: 3, title: 'Media 3', image: 'https://placehold.co/150x225'},
          {id: 4, title: 'Media 4', image: 'https://placehold.co/150x225'},
        ],
        watchlist: [
          {id: 1, title: 'Media 1', image: 'https://placehold.co/150x225'},
          {id: 5, title: 'Media 5', image: 'https://placehold.co/150x225'},
          {id: 6, title: 'Media 6', image: 'https://placehold.co/150x225'},
          {id: 7, title: 'Media 7', image: 'https://placehold.co/150x225'},
          {id: 8, title: 'Media 8', image: 'https://placehold.co/150x225'},
        ]
      }
    }
  },
  computed: {
    currentContent() {
      return this.contentData[this.activeView]
    }
  },
  methods: {
    setActiveView(view) {
      this.activeView = view
    }
  }
}
</script>

<template>
  <div id="content">
    <div id="profile">
      <div>
        <h1>'email'</h1>
        <p>Here is your profile information</p>
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
    <div id="contents">
      <ContentListWrap :content="currentContent"/>
    </div>
  </div>
</template>

<style scoped>

.underline {
  text-decoration: underline;
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