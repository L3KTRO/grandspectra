<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisible: {
      type: Number,
      default: 5
    }
  },
  computed: {
    visiblePages() {
      const range = [];
      const half = Math.floor(this.maxVisible);
      let start = Math.max(this.currentPage - half, 1);
      const end = Math.min(start + this.maxVisible - 1, this.totalPages);

      if (end - start < this.maxVisible - 1) {
        start = Math.max(end - this.maxVisible + 1, 1);
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    }
  },
  methods: {
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('pageChanged', page);
      }
    }
  }
};
</script>

<template>
  <div class="pagination">
    <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
    >
      Anterior
    </button>

    <span v-for="page in visiblePages" :key="page">
      <button
          @click="changePage(page)"
          :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </span>

    <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages || !totalPages"
    >
      Siguiente
    </button>
  </div>
</template>

<style>
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button.active {
  background: #007bff;
  color: white;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
