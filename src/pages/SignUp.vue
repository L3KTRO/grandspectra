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
      <BrandHeader/>
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
  width: 50vw;
  height: 50vh;
  background-color: rgb(51, 14, 14);
}
</style>
