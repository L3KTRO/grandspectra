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
        <h1 id="title">Media</h1>
        <p id="overview">Overview Overview Overview Overview Overview Overview Overview Overview Overview Overview
          Overview </p>
      </div>
    </div>
    <div id="second">
      <div id="cast">
        <div class="person">
          <h2 class="person-name">Person <span style="font-style: italic">as</span> director</h2>
        </div>
      </div>
      <div id="providers">
        <div class="provider">Netflix</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#providers {
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
  background-color: var(--background-contrast);
  flex-basis: 20%;
}

#cast {
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
  flex-basis: 75%;
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

#title {
  font-size: 3rem;
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
}

#body {
  margin: 0 10rem;
}

#poster {
  width: 300px;
}
</style>