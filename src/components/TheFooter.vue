<template>
  <footer>
    <p>Proudly cataloging crunchy goodness since... well, recently. &copy; {{ currentYear }}</p>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
}
</script>

<style scoped>
footer {
  text-align: center;
  padding: 1.5rem;
  margin-top: auto; /* Pushes footer to bottom if main content is short */
  background-color: #333; /* Darker background */
  color: #eee; /* Lighter text color */
  border-top: 1px solid #444; /* Subtle top border */
  font-size: 0.9rem; /* Slightly smaller font */
  width: 100%; /* Ensure it spans full width */
  margin-top: 10rem;
}

footer p {
  margin: 0; /* Remove default paragraph margin */
}
</style>
