<template>
  <main>
    <!-- Loading and Error States: Because nobody likes staring at a blank page -->
    <div v-if="loading" class="text-center pa-5">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading Cereals...</p>
    </div>
    <!-- Uh oh -->
    <div v-if="error" class="error-message">
      <p>Error loading cereals: {{ error.message }}</p>
      <p>Perhaps try shaking the monitor? (Or just refresh the page).</p>
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error">
      <h1>Cereals Collection</h1>
      <p class="text-center">Wow, that's a lot of cereals!<br /></p>

      <SearchBar
        v-model:searchQuery="searchQuery"
        v-model:selectedManufacturer="selectedManufacturer"
        v-model:selectedType="selectedType"
      />

      <div class="carousels-container">
        <!-- All Cereals Section -->
        <section
          v-if="!selectedManufacturer && filteredCereals.length > 0"
          class="carousel-section featured"
        >
          <div class="carousel-header">
            <h2>All Cereals</h2>
            <v-btn variant="outlined" size="small" rounded to="/all-cereals" class="show-all-btn"
              >Show all</v-btn
            >
          </div>
          <CerealCarousel
            :cereals="filteredCereals"
            :baseURL="baseURL"
            :manufacturer-full-name="getManufacturerFullName"
            @cereal-clicked="handleCerealClick"
          />
        </section>

        <!-- Manufacturer Sections: Dynamically creating rows for each brand. Neat! -->
        <template v-if="filteredCereals.length > 0">
          <!-- Loop through the manufacturers determined by filters. -->
          <section
            v-for="mfrCode in manufacturersToDisplay"
            :key="mfrCode"
            class="carousel-section"
          >
            <!-- Displaying the manufacturer's full name, because 'G' isn't very descriptive. -->
            <h2>{{ getManufacturerFullName(mfrCode) }}</h2>
            <CerealCarousel
              :cereals="getCerealsByManufacturer(mfrCode)"
              :baseURL="baseURL"
              :manufacturer-full-name="getManufacturerFullName"
              :show-arrows-behavior="'always'"
              @cereal-clicked="handleCerealClick"
            />
          </section>
        </template>

        <!-- No Results Message -->
        <div v-else class="no-results">
          <h2>No Matches Found</h2>
          <p>
            Cereal tumbleweeds... Maybe try searching for 'milk'? (Just kidding, search for
            cereals).
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
// Pinia power! mapState and mapActions help us connect to the store.
import { mapState, mapActions } from 'pinia'
// Importing our dedicated cereal store.
import { useCerealStore } from '@/stores/cerealStore.js'

// Importing the SearchBar component for our search functionality.
import SearchBar from '@/components/SearchBar.vue'
// Import the new CerealCarousel component
import CerealCarousel from '@/components/CerealCarousel.vue'

export default {
  name: 'HomeView',
  components: {
    SearchBar, // Registering the SearchBar component.
    CerealCarousel, // Registering the new CerealCarousel component
  },
  data() {
    return {
      searchQuery: '',
      selectedManufacturer: null, // For the manufacturer filter.
      selectedType: null, // For the type filter (Hot/Cold).
    }
  },
  computed: {
    // Map state properties from the store
    ...mapState(useCerealStore, [
      'cereals', // The big list of all cereals.
      'loading', // Are we currently fetching data?
      'error', // Did something go boom during fetch?
      'baseURL', // Where do the cereal pictures live?
      'uniqueManufacturers', // A pre-calculated list of manufacturer codes (like 'G', 'K', 'P').
      'getManufacturerFullName', // The handy function (getter) to translate 'G' to 'General Mills'.
    ]),

    // A local computed property. It recalculates automatically when `searchQuery` or `cereals` changes.
    filteredCereals() {
      let filtered = this.cereals

      // Apply manufacturer filter
      if (this.selectedManufacturer) {
        filtered = filtered.filter((cereal) => cereal.mfr === this.selectedManufacturer)
      }

      // Apply type filter
      if (this.selectedType) {
        filtered = filtered.filter((cereal) => cereal.type === this.selectedType)
      }

      // Apply search query filter
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const lowerCaseQuery = this.searchQuery.toLowerCase()
        filtered = filtered.filter((cereal) => cereal.name.toLowerCase().includes(lowerCaseQuery))
      }

      return filtered
    },
    manufacturersToDisplay() {
      if (this.selectedManufacturer) {
        // If a specific manufacturer is selected, and they have cereals matching all current filters
        // (which `filteredCereals` already ensures), then only list that manufacturer.
        return this.filteredCereals.length > 0 ? [this.selectedManufacturer] : []
      } else {
        // If no specific manufacturer is selected, list all manufacturers from `uniqueManufacturers`
        // that have at least one cereal in the current `filteredCereals` list.
        // This ensures we don't show empty carousels for manufacturers
        // if other filters (e.g., selectedType) have removed all their cereals.
        return this.uniqueManufacturers.filter((mfrCode) =>
          this.filteredCereals.some((cereal) => cereal.mfr === mfrCode),
        )
      }
    },
  },
  methods: {
    // Mapping actions from the store. Now we can call `this.fetchCereals()` like it's a local method.
    ...mapActions(useCerealStore, ['fetchCereals']),

    // Local method that uses a computed property
    getCerealsByManufacturer(mfr) {
      return this.filteredCereals.filter((cereal) => cereal.mfr === mfr)
    },
    // When a cereal card is clicked
    handleCerealClick(cereal) {
      // Check if the router exists.
      if (this.$router) {
        // Use Vue Router to navigate. We send the cereal's ID in the URL.
        this.$router.push({ name: 'CerealDetail', params: { id: cereal.id } })
      } else {
        console.error('Vue Router is not available. Did you forget to install or configure it?')
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
  padding: 2rem 1rem;
}

h1 {
  text-align: center;
  color: rgb(var(--v-theme-primary));
  font-size: 2.5em;
  font-weight: 700;
}

.text-center {
  text-align: center; /* Center the text. */
  margin-bottom: 2rem; /* Space below the title. */
}

.search-controls {
  max-width: 600px; /* Don't let the search bar get too wide on large screens. */
  margin: 0 auto 3rem; /* Center it horizontally, add space below. */
  padding: 0 1rem; /* Padding inside the controls area. */
}

.carousels-container {
  display: flex;
  flex-direction: column; /* Stack the carousels vertically. */
  gap: 2rem; /* Space between each carousel section. */
}

.carousel-header {
  display: flex; /* Use flexbox for layout. */
  justify-content: space-between; /* Push title left, button right. */
  align-items: center; /* Keep them vertically aligned. */
  margin-bottom: 0.5rem; /* Small gap before the actual carousel. */
  padding: 0 1rem; /* Align with section h2 padding. */
}

.carousel-section h2 {
  color: rgb(var(--v-theme-primary));
  font-size: 1.8em;
  font-weight: 600;
  padding: 0 1rem; /* Padding to align with content. */
  margin: 0; /* Remove browser default margins. */
}

/* Styling the "Show all" button to look less like a default button. */
.show-all-btn {
  text-transform: none; /* Keep the text casing as written. */
  font-weight: 500;
  font-size: 0.9em;
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  transition:
    background-color 0.3s ease,
    color 0.3s ease; /* Smooth hover effect. */
}

.show-all-btn:hover {
  background-color: rgba(var(--v-theme-primary-rgb), 0.1); /* Subtle background tint on hover. */
  color: rgb(var(--v-theme-primary));
}

/* Styles for .cereal-card, .card-content etc. have been moved to CerealCarousel.vue */

/* Styles for loading, error, and no-results messages. */
.loading-indicator, /* .loading-indicator class was not used, but kept for consistency if added later */
.error-message,
.no-results {
  text-align: center; /* Center the text. */
  padding: 4rem 1rem; /* Lots of padding to make it fill space. */
  margin: 2rem auto; /* Center the block itself. */
  max-width: 600px; /* Keep it from getting too wide. */
}

.loading-indicator p, /* Style for p inside .loading-indicator if used */
.error-message p:first-of-type, /* Add some margin to the first paragraph of error message */
.no-results p {
  margin-top: 1rem; /* Space between spinner/icon and text. */
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
