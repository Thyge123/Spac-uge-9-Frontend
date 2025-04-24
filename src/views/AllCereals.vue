<template>
  <v-container fluid class="all-cereals-container">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center text-primary mb-6">All Cereals</h1>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-4 filter-controls">

<v-col cols="12" md="6" lg="4">
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
</v-col>

<v-col cols="12" md="3" lg="2">
  <v-select
    v-model="selectedManufacturer"
    :items="manufacturerOptions"
    label="Manufacturer"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    rounded="pill"
    class="filter-input"
  ></v-select>
</v-col>

<v-col cols="12" md="3" lg="2">
         <v-select
          v-model="selectedType"
          :items="typeOptions"
          label="Type"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          rounded="pill"
          class="filter-input"
        ></v-select>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="filteredCereals"
              :search="searchQuery"
              :loading="loading"
              loading-text="Loading Cereals..."
              no-data-text="No cereals available matching your criteria."
              :items-per-page="15"
              class="elevation-1 cereals-table"
              item-value="name"
              hover
              density="compact"
              fixed-header
              height="600px"
              @click:row="handleRowClick"
            >


              <template #item.mfr="{ item }">
                {{ getManufacturerFullName(item.mfr) }}
              </template>



              <template #item.type="{ item }">
                {{ getCerealTypeFormatted(item.type) }}
              </template>


              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>


              <template v-slot:no-results>
                <v-alert type="warning" class="ma-3">
                  No cereals found matching "{{ searchQuery }}".
                </v-alert>
              </template>

            </v-data-table>
            <v-alert v-if="error" type="error" dense outlined class="mt-4 mx-4 mb-4">
              Error loading cereals: {{ error.message }}. Please try refreshing the page.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { mapState, mapActions } from 'pinia'
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'AllCereals',

  data() {
    return {
      searchQuery: '',
      selectedManufacturer: null, // Added for manufacturer filter
      selectedType: null,         // Added for type filter
      headers: [
        // ... existing headers ...
        { title: 'Cereal Name', key: 'name', align: 'start', sortable: true },
        { title: 'Manufacturer', key: 'mfr', sortable: true },
        { title: 'Type', key: 'type', sortable: true },
        { title: 'Calories', key: 'calories', sortable: true },
        { title: 'Protein (g)', key: 'protein', sortable: true },
        { title: 'Fat (g)', key: 'fat', sortable: true },
        { title: 'Sodium (mg)', key: 'sodium', sortable: true },
        { title: 'Fiber (g)', key: 'fiber', sortable: true },
        { title: 'Carbs (g)', key: 'carbo', sortable: true },
        { title: 'Sugars (g)', key: 'sugars', sortable: true },
        { title: 'Vitamins (%)', key: 'vitamins', sortable: true },
        { title: 'Shelf', key: 'shelf', sortable: true },
        { title: 'Potassium (mg)', key: 'potass', sortable: true },
        { title: 'Cups', key: 'cups', sortable: true },
        { title: 'Weight (kg)', key: 'weight', sortable: true },
        { title: 'Rating', key: 'rating', sortable: true },
      ],
      // Define options for the type filter dropdown
      typeOptions: [
        { title: 'Cold', value: 'C' },
        { title: 'Hot', value: 'H' },
      ],
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
        'getManufacturerFullName',
        'getCerealTypeFormatted'
    ]),

    // Format manufacturer options for the v-select
    manufacturerOptions() {
      // Ensure uniqueManufacturers is available and is an array
      if (!Array.isArray(this.uniqueManufacturers)) {
        return [];
      }
      return this.uniqueManufacturers.map(mfr => ({
        title: this.getManufacturerFullName(mfr), // Get full name using the getter
        value: mfr // Keep the abbreviation as the value
      })).sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by full name
    },

    // Computed property to filter cereals based on selections
    filteredCereals() {
      let filtered = this.cereals;

      // Apply manufacturer filter
      if (this.selectedManufacturer) {
        filtered = filtered.filter(cereal => cereal.mfr === this.selectedManufacturer);
      }

      // Apply type filter
      if (this.selectedType) {
        filtered = filtered.filter(cereal => cereal.type === this.selectedType);
      }

      // Note: The text search is handled directly by v-data-table's :search prop
      // No need to filter by searchQuery here unless combining filters in a more complex way

      return filtered;
    },

  },
  methods: {
    // Map actions from the store
    ...mapActions(useCerealStore, ['fetchCereals']),

    // Local method that uses a computed property (keep if needed elsewhere, otherwise removable)
    // getCerealsByManufacturer(mfr) {
    //   return this.filteredCereals.filter((cereal) => cereal.mfr === mfr)
    // },

    handleRowClick(event, { item }) {
      // Ensure item.value contains the actual data object when using item-value prop
      const actualItem = item.value || item; // Adjust based on Vuetify version/behavior
      if (actualItem && actualItem.id && this.$router) {
        this.$router.push({ name: 'CerealDetail', params: { id: actualItem.id } });
      } else if (!actualItem || !actualItem.id) {
        console.error('Clicked item is missing or does not have an ID:', actualItem);
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
.all-cereals-container {
  padding: 2rem 1rem;
  font-family: Poppins, sans-serif;
}

/* Adjust filter controls layout */
.filter-controls .v-col {
  padding-top: 0;
  padding-bottom: 0;
}


h1.text-primary {
  color: rgb(var(--v-theme-primary));
}

/* Style table headers */
.cereals-table :deep(thead th) {
  background-color: #f5f5f5; /* Light grey background */
  color: #333; /* Darker text */
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  position: sticky; /* Keep header sticky */
  top: 0; /* Stick to the top */
  z-index: 1; /* Ensure header is above scrolling content */
}

/* Add alternating row colors (striping) */
.cereals-table :deep(tbody tr:nth-of-type(odd)) {
  background-color: rgba(0, 0, 0, 0.02); /* Very light grey for odd rows */
}

/* Add cursor pointer to indicate rows are clickable */
.cereals-table :deep(tbody tr) {
  cursor: pointer;
}


/* Adjust table cell padding */
.cereals-table :deep(td),
.cereals-table :deep(th) {
  padding: 8px 16px; /* Adjust padding for compact density */
}


/* Responsive adjustments */
@media (max-width: 960px) { /* Adjust breakpoint if needed */
  .filter-controls .v-col {
    padding-bottom: 12px; /* Add spacing between stacked filters */
  }
}

@media (max-width: 600px) {
  .all-cereals-container {
    padding: 1rem 0.5rem;
  }
  h1 {
    font-size: 1.8rem !important; /* Adjust heading size */
  }
  .cereals-table :deep(td),
  .cereals-table :deep(th) {
    padding: 6px 8px; /* Reduce padding further on small screens */
    font-size: 0.75rem;
  }
  .cereals-table :deep(thead th) {
     font-size: 0.7rem; /* Adjust header font size */
  }
}
</style>
