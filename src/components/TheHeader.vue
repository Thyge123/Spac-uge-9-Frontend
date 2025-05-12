<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/all-cereals">All Cereals</router-link></li>
        <li v-if="!isAuthenticated" class="login-link">
          <router-link to="/login">Login</router-link>
        </li>
        <li v-else class="login-link">
          <a href="#" @click.prevent="handleLogout">Logout</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCerealStore } from '@/stores/cerealStore'

export default {
  name: 'TheHeader',
  computed: {
    // Use mapState to get 'isAuthenticated' from the cerealStore
    // The first argument is the store, the second is an array of state/getters names
    ...mapState(useCerealStore, ['isAuthenticated']),
  },
  methods: {
    // Use mapActions to get the 'logout' action from the cerealStore
    ...mapActions(useCerealStore, ['logout']),
    handleLogout() {
      this.logout() // Call the mapped action
      // Optionally redirect to home or login page after logout
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
header {
  background-color: #ffffff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
}

nav {
  display: flex;
  justify-content: center; /* Center navigation */
  max-width: 100%;
  margin: 0 auto; /* Center nav within the header */
  align-items: center; /* Added for vertical alignment */
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 2rem;
  width: 100%; /* Make ul take full width of nav */
  align-items: center; /* Added for vertical alignment of li items */
}

.login-link {
  margin-left: auto;
}
nav a {
  text-decoration: none;
  color: #333; /* Darker text color for contrast */
  padding: 0.5rem 0;
  transition:
    color 0.2s ease-in-out,
    border-bottom-color 0.2s ease-in-out; /* Smooth transitions */
  position: relative;
  border-bottom: 2px solid transparent; /* Placeholder for active/hover underline */
  cursor: pointer; /* Add cursor pointer for the logout link */
}

nav a:hover {
  border-bottom-color: #007bff; /* Underline on hover */
}

nav a.router-link-exact-active {
  color: #0056b3; /* Darker blue for active link */
  font-weight: 600; /* Slightly bolder */
  border-bottom-color: #0056b3; /* Persistent underline for active */
}
</style>
