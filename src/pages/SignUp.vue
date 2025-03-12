<script>
import BrandHeader from "@/subcomponents/BrandHeader.vue";
import AuthForm from "@/subcomponents/AuthForm.vue";

export default {
  name: "AuthPage",
  components: {BrandHeader, AuthForm}
};
</script>

<template>
  <div id="wrapper-box">
    <div id="box">
      <h1 id="auth-title">Join</h1>
      <AuthForm :isSignIn="false"/>
    </div>
  </div>
</template>

<style>

</style>
