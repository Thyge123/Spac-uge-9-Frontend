<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required autocomplete="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          autocomplete="current-password"
        />
      </div>
      <button type="submit">Login</button>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-if="success" class="success">{{ successMessage }}</div>
    </form>
    <div class="links">
      <router-link to="/register">Register</router-link>
      <router-link to="/reset-password">Forgot Password?</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
// Import the specific store we need.
import { useCerealStore } from '@/stores/cerealStore.js'
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false,
      success: false,
      successMessage: '',
    }
  },
  computed: {
    ...mapState(useCerealStore, ['user']),
  },
  methods: {
    ...mapActions(useCerealStore, ['login']),
    async handleLogin() {
      this.loading = true
      this.error = null
      this.success = false
      try {
        await this.login({ username: this.username, password: this.password })
        this.success = true
        this.successMessage = 'Login successful!'
        // Redirect to the home page or dashboard after successful login
        this.$router.push('/')
      } catch (err) {
        this.error = err.response?.data?.message || 'Invalid username or password'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2rem;
  background-color: #f4f7f6; /* Light, neutral background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font stack */
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-weight: 300; /* Lighter font weight for a modern feel */
  font-size: 2.5rem;
}

form {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; /* Max width for the form */
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Space between form elements */
}

form div {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
  font-weight: 600;
}

input[type='text'],
input[type='password'] {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type='text']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #007bff; /* Highlight color on focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

button[type='submit'] {
  padding: 0.75rem;
  background-color: #007bff; /* Primary button color */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem; /* Add some space above the button */
}

button[type='submit']:hover {
  background-color: #0056b3; /* Darker shade on hover */
}

.error {
  color: #d9534f; /* Bootstrap danger color */
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.loading {
  color: #555;
  margin-top: 1rem;
  text-align: center;
  font-style: italic;
}

.success {
  color: #5cb85c; /* Bootstrap success color */
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.links {
  display: flex;
  gap: 1.5rem; /* Space between links */
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.links a {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.links a:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
