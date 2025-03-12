<script>
import FormInput from "./FormInput.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.js";


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
  data(props) {
    const store = useAuthStore()
    const router = useRouter();
    const formData = ref({
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    const error = ref("");
    const loading = ref(false);

    const handleSubmit = async () => {
      error.value = "";
      loading.value = true;

      try {
        if (props.isSignIn) {
          await login();
        } else {
          await register();
        }
      } catch (err) {
        error.value = err.message || "Ocurrió un error";
      } finally {
        loading.value = false;
      }
    };

    const login = async () => {
      const urlencoded = new URLSearchParams();
      urlencoded.append("email", formData.value.email);
      urlencoded.append("password", formData.value.password);

      await store.login(urlencoded);

      // Redirigir al usuario a la página principal
      await router.push('/profile');
    };

    const register = async () => {
      // Validar que las contraseñas coincidan
      if (formData.value.password !== formData.value.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Implementación de registro
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.value.username,
          email: formData.value.email,
          password: formData.value.password,
          confirmPassword: formData.value.confirmPassword
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      // Opcional: iniciar sesión automáticamente tras registro
      await login();
    };

    return {
      formData,
      error,
      loading,
      handleSubmit
    };
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
          v-model="formData.username"/>
      <FormInput
          label="Email"
          type="email"
          placeholder="member@example.com"
          v-model="formData.email"/>
      <FormInput
          label="Password"
          type="password"
          placeholder="MyPet123"
          v-model="formData.password"/>
      <FormInput
          v-if="!isSignIn"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter Password"
          v-model="formData.confirmPassword"/>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div id="bottom">
      <button type="submit" id="submit" class="light-neon-effect-text" :disabled="loading">
        <h2 v-if="isSignIn">{{ loading ? 'Iniciando sesión...' : 'Sign In' }}</h2>
        <h2 v-else>{{ loading ? 'Registrando...' : 'Sign Up' }}</h2>
      </button>
      <h2>
        <span v-if="isSignIn">
          You don't have an account? <router-link :to="signupLink">Create one</router-link>
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
}

#inputs {
  display: flex;
  flex-direction: column;
  width: 25vw;
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
