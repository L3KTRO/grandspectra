<script>
import {ref} from "vue";

export default {
  name: "ContentActions",
  data() {
    return {
      sliderValue: ref(0)
    }
  }
}
</script>

<template>
  <div id="actions">
    <ul id="list">
      <li>Mark as <span>watched</span></li>
      <li>Add to <span>watchlist</span></li>
      <li style="display: flex; flex-direction: column;">
        <h3><span>{{ sliderValue }}</span></h3>
        <input
            v-model="sliderValue"
            type="range"
            :min="1"
            :max="10"
            :step="0.5"
            style="margin: 0 2rem"
        />
        <button>Done</button>
      </li>
      <li>Share</li>
    </ul>
  </div>
</template>

<style scoped>

span {
  font-weight: bold;
}

#list {
  li {
    background-color: var(--background-contrast);
    border-bottom: 1px solid var(--background-contrast-mid);
    padding: 0.5rem 0;
    font-size: 1.25rem;
  }
}

#actions {
  text-align: center;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
  background-color: var(--background-contrast);
  flex-basis: 20%;
  height: fit-content;
}
</style>