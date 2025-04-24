<template>
  <main>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center pa-5">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading Cereals...</p>
    </div>
    <div v-if="error" class="error-message">
      <p>Error loading cereals: {{ error.message }}</p>
      <p>Please try refreshing the page.</p>
    </div>

    <!-- Main Content -->
     <div v-if="!loading && !error">
      <h1>Cereals Collection</h1>
      <!-- Search bar -->
    <div class="search-controls">
      <v-text-field
    v-model="searchQuery"
    label="Search cereals by name"
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    class="filter-input"
  ></v-text-field>
    </div>

    <div class="carousels-container">
        <!-- All Cereals Section -->
        <section class="carousel-section featured">
          <div class="carousel-header">
            <h2>All Cereals</h2>
            <v-btn variant="outlined" size="small" rounded to="/all-cereals" class="show-all-btn">Show all</v-btn>
          </div>
          <!-- Using v-slide-group -->
          <v-slide-group show-arrows class="py-4">
            <v-slide-group-item
              v-for="cereal in filteredCereals"
              :key="cereal.id"
            >
            <v-card
                :elevation="isSelected ? 10 : 3"
                class="ma-3 cereal-card"
                width="300"
                rounded="lg"
                hover

                @click="handleCerealClick(cereal)"
              >
              <v-img
                    :src="baseURL + cereal.picture"
                    :alt="cereal.name"
                    height="200px"
                    contain
                    class="bg-grey-lighten-2"
                  ></v-img>
                <div class="card-content pa-4">
                  <v-card-title class="text-subtitle-1 font-weight-medium pa-0 mb-1">
                    {{ cereal.name }}
                  </v-card-title>
                  <v-card-subtitle class="text-body-2 pa-0">
                    By: {{ getManufacturerFullName(cereal.mfr) }}
                  </v-card-subtitle>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </section>

        <!-- Manufacturer Sections -->
        <template v-if="filteredCereals.length > 0">
          <section v-for="mfr in uniqueManufacturers" :key="mfr" class="carousel-section">
            <h2>{{ getManufacturerFullName(mfr) }}</h2>
             <!-- Using v-slide-group -->
            <v-slide-group show-arrows="always" class="py-4">
              <v-slide-group-item
                v-for="cereal in getCerealsByManufacturer(mfr)"
                :key="cereal.id"
              >
              <v-card
                class="ma-3 cereal-card"
                width="300"
                rounded="lg"
                hover

                @click="handleCerealClick(cereal)"
              >
              <v-img
                    :src="baseURL + cereal.picture"
                    :alt="cereal.name"
                    height="200px"
                    contain
                    class="bg-grey-lighten-2"
                  ></v-img>
                <div class="card-content pa-4">
                  <v-card-title class="text-subtitle-1 font-weight-medium pa-0 mb-1">
                    {{ cereal.name }}
                  </v-card-title>
                  <v-card-subtitle class="text-body-2 pa-0">
                    By: {{ getManufacturerFullName(cereal.mfr) }}
                  </v-card-subtitle>
                </div>
              </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </section>
        </template>

        <!-- No Results Message -->
        <div v-else class="no-results">
          <h2>No Matches Found</h2>
          <p>No cereals found matching your search. Try adjusting your criteria.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'HomeView',

  data() {
    return {
      searchQuery: '',
    }
  },
  computed: {
    // Map state properties from the store
    ...mapState(useCerealStore, [
        'cereals',
        'loading',
        'error',
        'baseURL',
        'uniqueManufacturers',
        'getManufacturerFullName' // Map the getter
    ]),

    // Local computed property that depends on store state and local data
    filteredCereals() {
      if (!this.searchQuery) return this.cereals // Access mapped 'cereals'
      const lowerCaseQuery = this.searchQuery.toLowerCase()
      // Access mapped 'cereals'
      return this.cereals.filter((cereal) => cereal.name.toLowerCase().includes(lowerCaseQuery))
    },
  },
  methods: {
    // Map actions from the store
    ...mapActions(useCerealStore, ['fetchCereals']),

    // Local method that uses a computed property
    getCerealsByManufacturer(mfr) {
      return this.filteredCereals.filter((cereal) => cereal.mfr === mfr)
    },
    handleCerealClick(cereal) {
      if (this.$router) {
        this.$router.push({ name: 'CerealDetail', params: { id: cereal.id } });
      } else {
        console.error('Vue Router is not available.');
      }
    },
  },
  mounted() {
    // Call the mapped action, check if data needs fetching
    if (!this.cereals || this.cereals.length === 0) {
        this.fetchCereals()
    }
  },
}
</script>

<style scoped>
main {
  padding: 2rem 1rem; /* Default padding */
}

h1 {
  text-align: center;
  color: rgb(var(--v-theme-primary));
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 2rem;
}

.search-controls {
  max-width: 600px;
  margin: 0 auto 3rem;
  padding: 0 1rem; /* Keep padding for spacing */
}

.carousels-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0 1rem; /* Consistent padding with section h2 */
}

.carousel-section h2 {
  color: rgb(var(--v-theme-primary));
  font-size: 1.8em;
  font-weight: 600;
  padding: 0 1rem; /* Padding for alignment */
  margin: 0; /* Reset margin */
}

/* Style overrides for the v-btn */
.show-all-btn {
  text-transform: none; /* Keep text as is */
  font-weight: 500;
  font-size: 0.9em;

  border-color: rgb(var(--v-theme-primary)); /* Use primary color for border */
  color: rgb(var(--v-theme-primary)); /* Use primary color for text */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
}

.show-all-btn:hover {
  background-color: rgba(var(--v-theme-primary-rgb), 0.1); /* Light primary background on hover */
  color: rgb(var(--v-theme-primary)); /* Keep text color */
}

/* Style for the v-card within v-slide-group */
.cereal-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease !important; /* Smoother transition */
  display: flex;
  flex-direction: column;
  background-color: #fff; /* Ensure a clean background */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer, more modern shadow */
}

.cereal-card:hover {
  transform: translateY(-5px) scale(1.02); /* Lift and slightly scale on hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Enhanced shadow on hover */
}

/* Ensure image fits well */
.cereal-card .v-img {
  border-top-left-radius: inherit; /* Inherit border-radius from card */
  border-top-right-radius: inherit;
}


/* Ensure title wraps correctly and improve typography */
.cereal-card .v-card-title {
  line-height: 1.4; /* Slightly increased line-height */
  word-break: break-word;
  white-space: normal;
  font-weight: 600; /* Slightly bolder title */
  color: #333; /* Darker text color */
}

.cereal-card .v-card-subtitle {
    color: #666; /* Lighter subtitle color */
}

/* Wrapper for card text content */
.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem; /* Standardized padding */
}


/* Common styles for status indicators */
.loading-indicator,
.error-message,
.no-results {
  text-align: center;
  padding: 4rem 1rem;
  margin: 2rem auto;
  max-width: 600px;
}

.loading-indicator p {
  margin-top: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  main {
    padding: 1.5rem 0.5rem;
  }

  .carousel-section h2 {
    font-size: 1.5em;
  }

  .carousel-header {
    padding: 0 0.5rem;
  }
}

@media (max-width: 576px) {
  main {
    padding: 1rem 0;
  }

  h1 {
    font-size: 2em; /* Smaller heading on mobile */
  }

  .search-controls {
    margin-bottom: 2rem; /* Reduce bottom margin */
  }

  .carousels-container {
    gap: 1.5rem;
  }

   .carousel-header {
    padding: 0;

  }

  .carousel-section h2 {
    font-size: 1.3em;
    padding: 0 0.5rem;
  }
}
</style>
