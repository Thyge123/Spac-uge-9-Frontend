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
      <!-- Something funny please-->
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
            <v-btn variant="outlined" size="small" rounded to="/all-cereals" class="show-all-btn"
              >Show all</v-btn
            >
          </div>
          <!-- Using v-slide-group -->
          <v-slide-group show-arrows class="py-4">
            <!-- Here we loop through our filtered cereals.-->
            <v-slide-group-item v-for="cereal in filteredCereals" :key="cereal.id">
              <!-- The v-card, displaying our cereals. -->
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
                    <!-- Using our getter to show the full manufacturer name.-->
                    By: {{ getManufacturerFullName(cereal.mfr) }}
                  </v-card-subtitle>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </section>

        <!-- Manufacturer Sections: Dynamically creating rows for each brand. Neat! -->
        <template v-if="filteredCereals.length > 0">
          <!-- Loop through the unique manufacturers we found earlier. -->
          <section v-for="mfr in uniqueManufacturers" :key="mfr" class="carousel-section">
            <!-- Displaying the manufacturer's full name, because 'G' isn't very descriptive. -->
            <h2>{{ getManufacturerFullName(mfr) }}</h2>
            <!-- Using v-slide-group -->
            <v-slide-group show-arrows="always" class="py-4">
              <v-slide-group-item v-for="cereal in getCerealsByManufacturer(mfr)" :key="cereal.id">
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
      'cereals', // The big list of all cereals.
      'loading', // Are we currently fetching data?
      'error', // Did something go boom during fetch?
      'baseURL', // Where do the cereal pictures live?
      'uniqueManufacturers', // A pre-calculated list of manufacturer codes (like 'G', 'K', 'P').
      'getManufacturerFullName', // The handy function (getter) to translate 'G' to 'General Mills'.
    ]),

    // A local computed property. It recalculates automatically when `searchQuery` or `cereals` changes.
    filteredCereals() {
      // If the search bar is empty, just show everything.
      if (!this.searchQuery) return this.cereals // Accessing the 'cereals' from mapState.
      // Make the search case-insensitive.
      const lowerCaseQuery = this.searchQuery.toLowerCase()
      // Filter the main list. Keep only cereals whose names include the search query.
      return this.cereals.filter((cereal) => cereal.name.toLowerCase().includes(lowerCaseQuery))
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

/* Styling the individual cereal cards. */
.cereal-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease !important; /* Smooth hover animation. !important might be needed if Vuetify is stubborn. */
  display: flex; /* Use flexbox for internal layout. */
  flex-direction: column; /* Stack image and text vertically. */
  background-color: #fff; /* White background for the card. */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* A nice, soft shadow. */
}

.cereal-card:hover {
  transform: translateY(-5px) scale(1.02); /* Lift and slightly enlarge on hover.*/
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25); /* Make the shadow more pronounced on hover. */
}

/* Fine-tuning the text inside the card. */
.cereal-card .v-card-title {
  line-height: 1.4; /* Improve readability if the name wraps. */
  word-break: break-word; /* Prevent long names from overflowing the card. */
  white-space: normal; /* Allow text to wrap naturally. */
  font-weight: 600; /* Make the title a bit bolder. */
  color: #333; /* Dark grey for good contrast. */
}

.cereal-card .v-card-subtitle {
  color: #666; /* Lighter grey for the subtitle. */
}

/* The container for the text content below the image. */
.card-content {
  flex-grow: 1; /* Allow this area to take up remaining vertical space. */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center the text vertically if there's extra space. */
  padding: 1rem; /* Consistent padding inside the content area. */
}

/* Styles for loading, error, and no-results messages. */
.loading-indicator,
.error-message,
.no-results {
  text-align: center; /* Center the text. */
  padding: 4rem 1rem; /* Lots of padding to make it fill space. */
  margin: 2rem auto; /* Center the block itself. */
  max-width: 600px; /* Keep it from getting too wide. */
}

.loading-indicator p {
  margin-top: 1rem; /* Space between spinner and text. */
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
