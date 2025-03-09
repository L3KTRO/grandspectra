<script>
export default {
  name: "FormInput",
  props: {
    label: String,
    type: String,
    placeholder: String,
    modelValue: String
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const updateValue = (event) => {
      emit('update:modelValue', event.target.value);
    };

    return {
      updateValue
    };
  }
}
</script>

<template>
  <div class="form-input">
    <label>{{ label }}</label>
    <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="updateValue"
    />
  </div>
</template>


<style scoped>

.form-input {
  display: flex;
  flex-direction: column;
}

input {
  border-bottom: 1px solid var(--text);
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 0 2rem;
  padding: 0.5rem;
}
</style>
