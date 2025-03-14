<script>
import Pagination from '../subcomponents/Pagination.vue';
import useApi from "@/helpers/api.js";

const {request} = useApi();

export default {
  components: {Pagination},
  data() {
    return {
      users: [],
      currentPage: 1,
      perPage: 5,
      totalUsers: 0,
      isLoading: true
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalUsers / this.perPage);
    }
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.users = []
      const response = await request(`/users?page=${this.currentPage}`);

      this.users = response.data.data;
      this.totalUsers = response.data.meta.total;
    },
    async handlePageChange(page) {
      this.currentPage = page;
      await this.fetchUsers();
    }
  }
};
</script>

<template>
  <div style="margin: 5rem">
    <h2 style="font-weight: bold">Latest registered members</h2>
    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">
        <router-link :to="`/${user.username}`">
          {{ user.username }}
        </router-link>
      </li>
    </ul>
    <p v-else>Cargando usuarios...</p>

    <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @pageChanged="handlePageChange"
    />
  </div>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
