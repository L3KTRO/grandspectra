<script>
export default {
  name: 'FormInput',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    valid: {
      type: Boolean,
      default: null
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
}
</script>

<template>
  <div class="form-field">
    <label>{{ label }}</label>
    <input
        :type="type"
        :value="modelValue"
        @input="updateValue"
        :placeholder="placeholder"
        :class="{ 'input-error': error, 'input-valid': valid }"
    />
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-error {
  border-color: #f56c6c;
}

.input-valid {
  border-color: #67c23a;
}

.error-text {
  color: #f56c6c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}


</style>
