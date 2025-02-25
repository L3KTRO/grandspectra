<template>
  <div class="form-input">
    <label :for="id">{{ label }}</label>
    <input :id="id" :type="type" :placeholder="placeholder"/>
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    label: String,
    type: {
      type: String,
      default: "text"
    },
    placeholder: String,
  },
  computed: {
    id() {
      return this.label.toLowerCase().replace(/\s+/g, "-");
    }
  }
}
</script>

<style scoped>

.form-input {
  display: flex;
  flex-direction: column;

}

input {
  border-bottom: 1px solid var(--text);
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 0 2rem;

}
</style>
