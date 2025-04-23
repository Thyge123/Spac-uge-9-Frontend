<template>
  <main>
    <h1>Cereals Collection</h1>

    <!-- Search bar -->
    <div class="search-controls">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search cereals..."
        class="search-input"
        aria-label="Search cereals by name"
      />
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="loading-indicator">
      <VueSpinnerTail size="50" color="red" />
      <p>Loading Cereals...</p>
    </div>
    <div v-if="error" class="error-message">
      <p>Error loading cereals: {{ error.message }}</p>
      <p>Please try refreshing the page.</p>
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error" class="carousels-container">
      <!-- All Cereals Section -->
      <section class="carousel-section featured">
        <div class="carousel-header">
          <h2>All Cereals</h2>
          <button class="show-all-btn"><RouterLink to="all-cereals">Show all</RouterLink></button>
        </div>
        <cereal-carousel
          :items="filteredCereals"
          :baseURL="baseURL"
          :getManufacturerFullName="getManufacturerFullName"
        />
      </section>

      <!-- Manufacturer Sections -->
      <template v-if="filteredCereals.length > 0">
        <section v-for="mfr in uniqueManufacturers" :key="mfr" class="carousel-section">
          <h2>{{ getManufacturerFullName(mfr) }}</h2>
          <cereal-carousel
            :items="getCerealsByManufacturer(mfr)"
            :baseURL="baseURL"
            :getManufacturerFullName="getManufacturerFullName"
          />
        </section>
      </template>

      <!-- No Results Message -->
      <div v-else class="no-results">
        <h2>No Matches Found</h2>
        <p>No cereals found matching your search. Try adjusting your criteria.</p>
      </div>
    </div>
  </main>
</template>

<script>
import { FetchAllCerealsWithImages } from '@/apis/apiservice.js'
import CerealCarousel from '@/components/CerealCarousel.vue'

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
  name: 'HomeView',
  components: {
    CerealCarousel,
  },
  data() {
    return {
      cereals: [],
      baseURL: 'https://localhost:7226',
      error: null,
      loading: true,
      searchQuery: '',
    }
  },
  computed: {
    uniqueManufacturers() {
      const manufacturers = new Set(this.cereals.map((cereal) => cereal.mfr))
      return Array.from(manufacturers).sort()
    },
    filteredCereals() {
      if (!this.searchQuery) return this.cereals
      const lowerCaseQuery = this.searchQuery.toLowerCase()
      return this.cereals.filter((cereal) => cereal.name.toLowerCase().includes(lowerCaseQuery))
    },
  },
  methods: {
    async fetchCereals() {
      this.loading = true
      this.error = null
      try {
        const response = await FetchAllCerealsWithImages()
        this.cereals = response.data
      } catch (error) {
        console.error('Failed to fetch cereals:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },
    getManufacturerFullName(code) {
      return manufacturerMap[code] || code
    },
    getCerealsByManufacturer(mfr) {
      return this.filteredCereals.filter((cereal) => cereal.mfr === mfr)
    },
  },
  mounted() {
    this.fetchCereals()
  },
}
</script>

<style scoped>
/* Keep existing CSS variables */
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5a623;
  --text-color: #333;
  --light-text-color: #555;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.08);
  --hover-shadow-color: rgba(0, 0, 0, 0.12);
  --error-color: #d9534f;
  --error-bg-color: #f2dede;
  --error-border-color: #ebccd1;
}

h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 2rem;
}

.search-controls {
  max-width: 600px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1em;
  border: 2px solid var(--border-color);
  border-radius: 30px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.carousels-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.carousel-section {
  padding: 2rem;
  background: var(--bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.carousel-section.featured {
  background: linear-gradient(to right, #f6f8fa, #fff);
  border: 2px solid var(--primary-color);
}

.carousel-section h2 {
  color: var(--primary-color);
  font-size: 1.8em;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.show-all-btn {
  padding: 0.6rem 1.2rem;

  color: var(--primary-color);
  background-color: transparent;
  border: 1px solid #333;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.show-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.show-all-btn:active {
  transform: translateY(0);
}

/* Update existing carousel-section h2 styles */
.carousel-section h2 {
  color: var(--primary-color);
  font-size: 1.8em;
  font-weight: 600;
  margin: 0; /* Remove margin-bottom as it's handled by carousel-header */
}

/* Loading and Error States */
.loading-indicator,
.error-message,
.no-results {
  text-align: center;
  padding: 4rem 1rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 8px var(--shadow-color);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  main {
    padding: 1.5rem 0.5rem;
  }

  .carousel-section {
    padding: 1.5rem 1rem;
  }

  .carousel-section h2 {
    font-size: 1.5em;
  }
}

@media (max-width: 576px) {
  main {
    padding: 1rem 0;
  }

  .carousel-section {
    padding: 1rem 0.5rem;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid var(--border-color);
  }

  .search-input {
    font-size: 1em;
    padding: 0.8rem 1.2rem;
  }

  .carousels-container {
    gap: 2rem;
  }
}
</style>
