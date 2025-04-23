<template>
  <div class="all-cereals-container">
    <h1>All Cereals</h1>
    <div class="controls">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search cereals by name..."
        class="search-input"
        aria-label="Search cereals by name"
      />
      <!-- Optional: Add manufacturer filter dropdown here if needed -->
    </div>

    <div v-if="loading" class="loading-indicator">
      <p>Loading Cereals...</p>
      <!-- Optional: Add a spinner component -->
    </div>
    <div v-if="error" class="error-message">
      <p>Error loading cereals: {{ error.message }}</p>
      <p>Please try refreshing the page.</p>
    </div>

    <div v-if="!loading && !error" class="table-container">
      <table class="cereals-table">
        <thead>
          <tr>
            <th>Cereal Name</th>
            <th>Manufacturer</th>
            <th>Type</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Fat</th>
            <th>Sodium</th>
            <th>Fiber</th>
            <th>Carbohydrates</th>
            <th>Sugars</th>
            <th>Vitamins</th>
            <th>Shelf</th>
            <th>Potassium</th>
            <th>Cups</th>
            <th>Weight</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredCereals.length === 0">
            <td colspan="2" class="no-results">No cereals found matching your search.</td>
          </tr>
          <tr v-for="cereal in filteredCereals" :key="cereal.id || cereal.name">
            <td>{{ cereal.name }}</td>
            <td>{{ getManufacturerFullName(cereal.mfr) }}</td>
            <td>{{ cereal.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { FetchAllCereals } from '@/apis/apiservice.js'

// Consider moving this map to a shared utility file if used elsewhere
const manufacturerMap = {
  A: 'American Home Food Products',
  G: 'General Mills',
  K: 'Kelloggs',
  N: 'Nabisco',
  P: 'Post',
  Q: 'Quaker Oats',
  R: 'Ralston Purina',
}

export default {
  name: 'AllCereals',
  data() {
    return {
      cereals: [],
      error: null,
      loading: true,
      searchQuery: '',
    }
  },
  methods: {
    async fetchCereals() {
      this.loading = true
      this.error = null
      try {
        const response = await FetchAllCereals()
        // Assuming response.data is the array of cereals
        this.cereals = response.data || []
      } catch (error) {
        console.error('Failed to fetch cereals:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    getManufacturerFullName(code) {
      return manufacturerMap[code] || code // Return code if not found
    },
  },
  mounted() {
    this.fetchCereals()
  },
  computed: {
    filteredCereals() {
      if (!this.searchQuery) {
        return this.cereals
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase()
      return this.cereals.filter((cereal) => cereal.name.toLowerCase().includes(lowerCaseQuery))
    },
  },
}
</script>

<style scoped>
/* Using variables defined globally or in a parent component is recommended */
:root {
  --primary-color: #4a90e2;
  --text-color: #333;
  --light-text-color: #555;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.08);
  --hover-bg-color: #f1f3f5;
  --error-color: #d9534f;
  --error-bg-color: #f2dede;
  --error-border-color: #ebccd1;
}

.all-cereals-container {
  background-color: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 6px 12px var(--shadow-color, rgba(0, 0, 0, 0.1));
  font-family: 'Inter', sans-serif;
}

h1 {
  text-align: center;
  color: var(--primary-color, #4a90e2);
  margin-bottom: 1.5rem;
  font-size: 2.2em;
  font-weight: 700;
}

.controls {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 25px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color, #4a90e2);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.loading-indicator,
.error-message {
  text-align: center;
  padding: 2rem;
  margin-top: 1rem;
  border-radius: 8px;
}

.loading-indicator {
  color: var(--light-text-color, #555);
  font-size: 1.1em;
}

.error-message {
  color: var(--error-color, #d9534f);
  background-color: var(--error-bg-color, #f2dede);
  border: 1px solid var(--error-border-color, #ebccd1);
  font-size: 1.1em;
}
.error-message p:first-of-type {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.table-container {
  overflow-x: auto; /* Allows table to scroll horizontally on small screens */
}

.cereals-table {
  width: 100%;
  border-collapse: collapse; /* Removes gaps between cells */
  margin-top: 1rem;
  font-size: 1rem;
}

.cereals-table th,
.cereals-table td {
  padding: 1rem 0.75rem; /* Vertical and horizontal padding */
  text-align: left;
  border-bottom: 1px solid var(--border-color, #e0e0e0); /* Separator lines */
}

.cereals-table th {
  background-color: var(--bg-color, #f8f9fa); /* Light header background */
  color: var(--text-color, #333);
  font-weight: 600; /* Bolder headers */
  position: sticky; /* Keep header visible on scroll */
  top: 0; /* Stick to the top */
  z-index: 1; /* Ensure header is above body */
}

/* Zebra striping for better readability */
.cereals-table tbody tr:nth-child(even) {
  background-color: var(--bg-color, #f8f9fa);
}

.cereals-table tbody tr:hover {
  background-color: var(--hover-bg-color, #f1f3f5); /* Highlight on hover */
  cursor: default; /* Indicate non-interactive rows, change if rows become clickable */
}

.no-results {
  text-align: center;
  color: var(--light-text-color, #555);
  padding: 2rem;
  font-style: italic;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .all-cereals-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8em;
  }

  .search-input {
    max-width: 100%;
  }

  .cereals-table th,
  .cereals-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.95rem; /* Slightly smaller font on smaller screens */
  }
}

@media (max-width: 576px) {
  .all-cereals-container {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 8px;
  }

  h1 {
    font-size: 1.6em;
  }

  .cereals-table th,
  .cereals-table td {
    font-size: 0.9rem;
  }
}
</style>
