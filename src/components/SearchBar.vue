<template>
  <!-- Filter Controls Section. -->
  <v-row justify="center" class="mb-4 filter-controls">
    <v-col cols="12" md="6" lg="4">
      <!-- Search Input -->
      <v-text-field
        v-model="localSearchQuery"
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

    <!-- Manufacturer Dropdown -->
    <v-col cols="12" md="3" lg="2">
      <v-select
        v-model="localManufacturer"
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

    <!-- Type Dropdown (Hot/Cold) -->
    <v-col cols="12" md="3" lg="2">
      <v-select
        v-model="localType"
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
</template>

<script>
// Pinia imports for state management.
import { mapState } from 'pinia'
// Import the specific store we need.
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'SearchBar',
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
    selectedManufacturer: {
      type: String,
      default: null,
    },
    selectedType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      localSearchQuery: this.searchQuery,
      localManufacturer: this.selectedManufacturer,
      localType: this.selectedType,
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
      'getCerealTypeFormatted',
    ]),

    // Format manufacturer options for the v-select
    manufacturerOptions() {
      // Ensure uniqueManufacturers is available and is an array
      if (!Array.isArray(this.uniqueManufacturers)) {
        return []
      }
      return this.uniqueManufacturers
        .map((mfr) => ({
          title: this.getManufacturerFullName(mfr), // Get full name using the getter
          value: mfr, // Keep the abbreviation as the value
        }))
        .sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically by full name
    },

    // Computed property to filter cereals based on selections
    filteredCereals() {
      let filtered = [...this.cereals] // Start with a copy of all cereals

      return filtered
    },
  },
  watch: {
    localSearchQuery(newValue) {
      this.$emit('update:searchQuery', newValue)
    },
    localManufacturer(newValue) {
      this.$emit('update:selectedManufacturer', newValue)
    },
    localType(newValue) {
      this.$emit('update:selectedType', newValue)
    },
  },
}
</script>

<style scoped>
/* Adjust vertical padding for filter control columns. */
.filter-controls .v-col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
