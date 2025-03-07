<script>
import FormInput from "./FormInput.vue";

export default {
  name: "AuthForm",
  components: {FormInput},
  props: {
    isSignIn: {
      type: Boolean,
      default: true
    },
    signupLink: {
      type: String,
      default: "/signup"
    },
    signinLink: {
      type: String,
      default: "/signin"
    }
  }
}
</script>

<template>
  <div id="box-form">
    <div id="inputs">
      <FormInput label="Email" type="email" placeholder="member@example.com"/>
      <FormInput label="Password" type="password" placeholder="MyPet123"/>
      <!-- Campo opcional para registro -->
      <FormInput
          v-if="!isSignIn"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter Password"/>
    </div>
    <div id="bottom">
      <div id="submit" class="light-neon-effect-text">
        <h2 v-if="isSignIn">Sign In</h2>
        <h2 v-else>Sign Up</h2>
      </div>
      <h2>
        <span v-if="isSignIn">
          You don't have an account? <a :href="signupLink">Create one</a>
        </span>
        <span v-else>
          Already have an account? <a :href="signinLink">Sign in</a>
        </span>
      </h2>
    </div>
  </div>
</template>

<style scoped>

#box-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#inputs {
  display: flex;
  flex-direction: column;
  width: 25vw;
}

#bottom {
  margin-top: 1rem;
}

#bottom h2 {
  margin: 0.5rem;
}

#submit {
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}

#submit h2 {
  border-radius: 0.5rem;
  font-weight: 700;
  padding: 0.25rem 2rem;
  background-color: var(--text);
  color: var(--contrast-1-2);
  font-family: 'CharisSIL', "GTVCS", serif;
  text-transform: uppercase;
}
</style>
