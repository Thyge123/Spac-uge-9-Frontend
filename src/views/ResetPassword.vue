<template>
  <div class="reset-password-page">
    <h1>Reset Password</h1>
    <p style="font-style: italic">Yes, this is not a good idea. Demonstration purposes only.</p>
    <form @submit.prevent="handleResetPassword">
      <div v-if="!userExists">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
        <button type="button" @click="checkUserExists">Verify Username</button>
      </div>

      <div v-if="userExists">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
        <button type="submit">Reset Password</button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-if="success" class="success">Password reset successfully!</div>
    </form>
    <div class="links">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'

import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'ResetPasswordPage',
  data() {
    return {
      id: null,
      username: '',
      newPassword: '',
      error: null,
      loading: false,
      success: false,
      userExists: false, // Track if the user exists
    }
  },
  methods: {
    ...mapActions(useCerealStore, ['updateUser', 'fetchUserByUsername']), //
    async checkUserExists() {
      if (!this.username) {
        this.error = 'Please enter a username.'
        return
      }
      this.loading = true
      this.error = null
      this.success = false
      this.userExists = false
      try {
        const user = await this.fetchUserByUsername(this.username)
        if (user) {
          this.userExists = true
          this.id = user.id // Store the user's ID
        } else {
          this.error = 'User not found.'
        }
      } catch (err) {
        this.error = err.message || 'Error verifying user.'
      } finally {
        this.loading = false
      }
    },
    async handleResetPassword() {
      if (!this.newPassword) {
        this.error = 'Please enter a new password.'
        return
      }
      this.loading = true
      this.error = null
      this.success = false
      try {
        await this.updateUser({
          id: this.id,
          username: this.username,
          password: this.newPassword,
          role: 'Admin',
        })
        this.success = true
        this.username = '' // Clear username
        this.newPassword = '' // Clear password
        this.userExists = false // Reset user verification state
        setTimeout(() => this.$router.push('/login'), 2000) // Redirect after 500 milliseconds
      } catch (err) {
        this.error = err.message || 'An error occurred while resetting the password'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.reset-password-page {
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

button[type='submit'],
button[type='button'] {
  padding: 0.75rem;
  background-color: #007bff; /* Primary button color */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem; /* Add some space above the button */
}

button[type='submit']:hover,
button[type='button']:hover {
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
