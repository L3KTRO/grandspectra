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
      <h1 id="title">Join</h1>
      <AuthForm :isSignIn="false"/>
    </div>
  </div>
</template>

<style scoped>
#wrapper-box {
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5rem;
  background-color: rgb(51, 14, 14);
}

#title {
  font-size: 3.5rem;
  font-family: 'CharisSIL', "GTVCS", serif;
}
</style>
