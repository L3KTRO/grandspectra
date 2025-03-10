<script>
import {ref} from "vue";

export default {
  name: "ContentActions",
  data() {
    return {
      sliderValue: ref("0"),
      disabledRate: ref(false)
    }
  },
  computed: {
    switchRate() {
      return this.disabledRate || this.sliderValue === '0';
    },
    switchRemoveRate() {
      return !this.disabledRate;
    }
  },
  methods: {
    addRate() {
      if (this.switchRate) return;
      this.disabledRate = true;
    },

    removeRate() {
      if (this.switchRemoveRate) return;
      this.sliderValue = "0";
      this.disabledRate = false;
    },
    moveRate() {
      if (this.sliderValue !== "0")
        this.disabledRate = false;
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
            @change="moveRate"
            type="range"
            :min="1"
            :max="10"
            :step="0.5"
            style="margin: 0 2rem"
        />
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div class="button action-button" :class="switchRate ? 'disabled-button' : ''">
            <h2 @click="addRate">RATE</h2>
          </div>
          <div class="button action-button"
               :class="switchRemoveRate ? 'disabled-button' : ''">
            <h2 @click="removeRate">REMOVE</h2>
          </div>
        </div>
      </li>
      <li>Share</li>
    </ul>
  </div>
</template>

<style scoped>

.disabled-button {
  background-color: var(--background-contrast-mid);
  color: var(--text-contrast);
  cursor: not-allowed;

  h2 {
    text-shadow: none;
  }
}

.action-button {
  margin: 0.5rem;
  padding: 0 1rem;
  font-family: 'CharisSIL', "GTVCS", serif;
  font-weight: 900;
  border-radius: 5px;
  transition: ease-in-out 0.3s;
}

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