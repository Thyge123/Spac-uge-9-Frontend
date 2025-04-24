ac-uge-9-Frontend\src\components\TheHeader.vue
<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/all-cereals">All Cereals</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      title: 'My Website' // This title is currently not used in the template
    }
  },

}
</script>

<style scoped>
header {
  background-color: #ffffff; /* White background */
  padding: 1rem 2rem; /* Adjust padding as needed */
  border-bottom: 1px solid #e0e0e0; /* Subtle border instead of shadow */
}

nav {
  display: flex;
  justify-content: center; /* Center navigation */
  max-width: 1200px; /* Optional: constrain width on large screens */
  margin: 0 auto; /* Center nav within the header */
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 2rem; /* Slightly increased gap */
}

nav a {
  text-decoration: none;
  color: #333; /* Darker text color for contrast */
  padding: 0.5rem 0;
  transition: color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out; /* Smooth transitions */
  position: relative; /* Needed for pseudo-element */
  border-bottom: 2px solid transparent; /* Placeholder for active/hover underline */
}

nav a:hover {
  color: #007bff; /* A modern blue for hover */
  border-bottom-color: #007bff; /* Underline on hover */
}

nav a.router-link-exact-active {
  color: #0056b3; /* Darker blue for active link */
  font-weight: 600; /* Slightly bolder */
  border-bottom-color: #0056b3; /* Persistent underline for active */
}
</style>
