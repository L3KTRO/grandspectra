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
      <h1 id="auth-title">Welcome back</h1>
      <AuthForm :isSignIn="true"/>
    </div>
  </div>
</template>

<style>
#wrapper-box {
  display: flex;
  margin: 3rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#box {
  min-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 5rem;
  background-color: var(--contrast-1-3);
}

#auth-title {
  align-self: center;
  font-size: 3.5rem;
  font-family: 'CharisSIL', "GTVCS", serif;
}

@media (max-width: 768px) {
  #box {
    min-width: 300px;
    padding: 1.5rem 2rem;
  }

  #auth-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 450px) {
  #box {
    width: 250px;
    padding: 1.5rem 1rem;
  }
}
</style>
