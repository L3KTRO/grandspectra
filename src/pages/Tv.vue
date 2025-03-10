<script>
import ContentList from "@/subcomponents/ContentList.vue";

export default {
  name: "Content",
  components: {ContentList},
}
</script>

<template>
  <div id="body">
    <div id="initial">
      <img src="https://placehold.co/200x300" alt="Media" id="poster"/>
      <div id="metadata">
        <h1 class="title">Media</h1>
        <h2>Directed by <a>Clint Eastwood</a></h2>
        <p id="overview">Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview
          Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview
          Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview
          Overview </p>
        <div id="aditional-metadata">
          <h3>Release: 2025</h3>
          <h3>Runtime: 120m</h3>
          <h3>Genres: Drama, Action, Adventure</h3>
        </div>
      </div>
    </div>
    <div id="second">
      <div id="cast">
        <div id="title">
          <h1 class="light-neon-effect-text">Casting & Crew</h1>
        </div>
        <div class="person">
          <h2 class="person-name"><a>Person</a> <span
              style="font-style: italic">as</span> director</h2>
        </div>
      </div>
      <div id="actions">
        <h1 style="font-size: 1.5rem; font-weight: bold">Actions</h1>
        <div class="action">Mark as watched</div>
        <div class="action">Add to watchlist</div>
        <div class="action">Add to favourites</div>
        <div class="action">Rate</div>
        <div class="action">Share</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

a {
  font-weight: bold;
}

#aditional-metadata {
  display: flex;
  flex-direction: row;
  color: var(--text-contrast-mid);

  * {
    margin: 0 1rem;
  }
}

#actions {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 3rem 0;
  background-color: var(--background-contrast);
  flex-basis: 20%;
  height: fit-content;
}

#cast {
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
  flex-basis: 75%;

  #title {
    font-family: 'CharisSIL', "GTVCS", serif;
    font-size: 1.75rem;
    border-bottom: 1px solid var(--shadow-darker);
    margin: 0 1rem;
    padding: 1rem;
  }
}

#second {
  display: flex;
  flex-direction: row;
  margin: 3rem 0;
}

.person-name {
  font-size: 1.5rem;
}

.person {
  display: flex;
  flex-direction: row;
  margin: 1rem;
  padding: 2rem;
  background-color: var(--background-contrast-mid);
}

.title {
  font-family: 'CharisSIL', "GTVCS", serif;
  font-size: 3rem;
  font-weight: normal;
}

#initial {
  display: flex;
  flex-direction: row;
  margin: 3rem 0;
}

#metadata {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0 2rem;
}

#overview {
  font-size: 1.25rem;
  margin: 2rem;
  background-color: var(--background-contrast-mid);
  height: 10rem;
}

#body {
  margin: 0 10rem;
}

#poster {
  width: 300px;
}
</style>