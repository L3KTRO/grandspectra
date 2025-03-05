<script>
import ContentList from "@/subcomponents/ContentList.vue";
import ContentListWrap from "@/subcomponents/ContentListWrap.vue";

export default {
  name: "Profile",
  components: {ContentListWrap, ContentList}
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
    <div id="views-bar">
      <div>Watched</div>
      <div style="text-decoration: underline">Rated</div>
      <div>Watchlist</div>
    </div>

    <div id="contents">
      <ContentListWrap/>
    </div>
  </div>
</template>

<style scoped>

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