<script>
import FormInput from "./FormInput.vue";
import {useAuthStore} from "@/stores/auth.js";
import {mapStores} from 'pinia';

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
  },
  data() {
    return {
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      validations: {
        username: {error: "", valid: false},
        email: {error: "", valid: false},
        password: {error: "", valid: false},
        confirmPassword: {error: "", valid: false},
      },
      formValid: false,
      error: "",
      loading: false,
      unsubscribe: null
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    isFormValid() {
      if (this.isSignIn) {
        return this.validations.email.valid && this.validations.password.valid;
      }

      return this.validations.username.valid &&
          this.validations.email.valid &&
          this.validations.password.valid &&
          this.validations.confirmPassword.valid;
    }
  },
  mounted() {
    // Suscribirse a cambios en el formulario para validación en tiempo real
    this.unsubscribe = this.$watch(
        'formData',
        this.validateForm,
        {deep: true, immediate: true}
    );
  },
  beforeUnmount() {
    // Limpiar la suscripción
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    validateForm() {
      // Validar username (solo si no es inicio de sesión)
      if (!this.isSignIn) {
        if (!this.formData.username) {
          this.validations.username.error = "Username is required";
          this.validations.username.valid = false;
        } else if (this.formData.username.length < 3) {
          this.validations.username.error = "Username must be at least 3 characters";
          this.validations.username.valid = false;
        } else {
          this.validations.username.error = "";
          this.validations.username.valid = true;
        }
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.validations.email.error = "Email is required";
        this.validations.email.valid = false;
      } else if (!emailRegex.test(this.formData.email)) {
        this.validations.email.error = "Invalid email address";
        this.validations.email.valid = false;
      } else {
        this.validations.email.error = "";
        this.validations.email.valid = true;
      }

      // Validar password
      if (!this.formData.password) {
        this.validations.password.error = "Password is required";
        this.validations.password.valid = false;
      } else if (this.formData.password.length < 8) {
        this.validations.password.error = "Password must be at least 8 characters";
        this.validations.password.valid = false;
      } else {
        this.validations.password.error = "";
        this.validations.password.valid = true;
      }

      // Validar confirmPassword (solo si no es inicio de sesión)
      if (!this.isSignIn) {
        if (!this.formData.confirmPassword) {
          this.validations.confirmPassword.error = "Must confirm password";
          this.validations.confirmPassword.valid = false;
        } else if (this.formData.confirmPassword !== this.formData.password) {
          this.validations.confirmPassword.error = "Passwords must match";
          this.validations.confirmPassword.valid = false;
        } else {
          this.validations.confirmPassword.error = "";
          this.validations.confirmPassword.valid = true;
        }
      }
    },
    async handleSubmit() {
      // Validar todo el formulario antes de enviar
      this.validateForm();

      if (!this.isFormValid) {
        this.error = "Por favor, corrige los errores en el formulario";
        return;
      }

      this.error = "";
      this.loading = true;

      try {
        if (this.isSignIn) {
          await this.login();
        } else {
          await this.register();
        }
      } catch (err) {
        this.error = err.message || "Error";
      } finally {
        this.loading = false;
      }
    },
    async login() {
      const urlencoded = new URLSearchParams();
      urlencoded.append("email", this.formData.email);
      urlencoded.append("password", this.formData.password);

      const res = await this.authStore.login(urlencoded);

      // Redirigir al usuario a la página principal
      this.$router.push('/'+res.user.username);
    },
    async register() {
      const urlencoded = new URLSearchParams();
      urlencoded.append("username", this.formData.username);
      urlencoded.append("email", this.formData.email);
      urlencoded.append("password", this.formData.password);
      urlencoded.append("password_confirmation", this.formData.confirmPassword);

      const res = await this.authStore.register(urlencoded);

      if (res["errors"]) {
        if (res["errors"]["email"]) {
          this.validations.email.valid = false;
          this.validations.email.error = res["errors"]["email"][0];
        }
        if (res["errors"]["password"]) {
          this.validations.password.valid = false;
          this.validations.password.error = res["errors"]["password"][0];
        }
        if (res["errors"]["username"]) {
          this.validations.username.error = res["errors"]["username"][0];
          this.validations.username.valid = false;
        }
        if (res["errors"]["password_confirmation"]) {
          this.validations.confirmPassword.error = res["errors"]["password_confirmation"][0];
          this.validations.confirmPassword.valid = false;
        }
      } else {
        this.$router.push('/profile');
      }
    }
  }
}
</script>

<template>
  <form id="box-form" @submit.prevent="handleSubmit">
    <div id="inputs">
      <FormInput
          v-if="!isSignIn"
          label="Username"
          type="text"
          placeholder="YourName1170"
          v-model="formData.username"
          :error="validations.username.error"
          :valid="validations.username.valid"/>
      <FormInput
          label="Email"
          type="email"
          placeholder="member@example.com"
          v-model="formData.email"
          :error="validations.email.error"
          :valid="validations.email.valid"/>
      <FormInput
          label="Password"
          type="password"
          placeholder="MyPet123"
          v-model="formData.password"
          :error="validations.password.error"
          :valid="validations.password.valid"/>
      <FormInput
          v-if="!isSignIn"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter Password"
          v-model="formData.confirmPassword"
          :error="validations.confirmPassword.error"
          :valid="validations.confirmPassword.valid"/>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div id="bottom">
      <button
          type="submit"
          id="submit"
          class="light-neon-effect-text"
          :disabled="loading || !isFormValid"
      >
        <h2 v-if="isSignIn">{{ loading ? 'Iniciando sesión...' : 'Sign In' }}</h2>
        <h2 v-else>{{ loading ? 'Registrando...' : 'Sign Up' }}</h2>
      </button>
      <h2>
        <span v-if="isSignIn">
          You don't have an account? <router-link :to="signupLink">Join us</router-link>
        </span>
        <span v-else>
          Already have an account? <router-link :to="signinLink">Sign in</router-link>
        </span>
      </h2>
    </div>
  </form>
</template>


<style scoped>

#box-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100%;
}

#inputs {
  display: flex;
  flex-direction: column;
  min-width: 100%;

  * {
    min-width: 100%;
  }
}

#bottom {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  cursor: pointer;
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
