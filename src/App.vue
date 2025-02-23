<script>
import Header from "@/components/Header.vue";
import Home from "@/pages/Home.vue";
import MainLayout from "@/layouts/MainLayout.vue";

export default {
  components: {MainLayout, Home, Header}
}
</script>

<template>
  <RouterView/>
</template>

<style>
@import "./assets/base.css";
</style>
