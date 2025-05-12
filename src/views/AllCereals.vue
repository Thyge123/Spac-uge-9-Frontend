<template>
  <v-container fluid class="all-cereals-container">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center text-primary">All Cereals</h1>
        <p class="text-center mb-6">Look at all them cereals! <br /></p>
      </v-col>
    </v-row>

    <div class="SearchAndButton">
      <SearchBar
        v-model:searchQuery="searchQuery"
        v-model:selectedManufacturer="selectedManufacturer"
        v-model:selectedType="selectedType"
      />
    </div>
    <AddNewCerealModal
      v-model="showAddCerealModal"
      :cereal="newCerealTemplate"
      @submit="handleCerealAdded"
    />
    <UpdateCerealModal
      v-if="cerealToEdit"
      v-model="showUpdateCerealModal"
      :cereal="cerealToEdit"
      @submit="handleCerealUpdated"
    />
    <!-- The Main Data Table Section -->
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="pa-0">
            <!-- v-data-table-->
            <v-data-table
              :headers="headers"
              :items="filteredCereals"
              :search="searchQuery"
              :loading="loading"
              loading-text="Loading Cereals..."
              no-data-text="Uh oh, this is not good. No cereals found."
              :items-per-page="15"
              class="elevation-1 cereals-table"
              item-value="name"
              hover
              density="compact"
              fixed-header
              height="600px"
              @click:row="handleRowClick"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title> </v-toolbar-title>
                  <v-btn
                    class="me-2"
                    prepend-icon="mdi-plus"
                    rounded="lg"
                    text="Add New Cereal"
                    border
                    @click="openAddCerealModal"
                  ></v-btn>
                </v-toolbar>
              </template>
              <!-- Custom Slot for Manufacturer Column: Display full name instead of code. -->
              <template v-slot:[`item.mfr`]="{ item }">
                {{ getManufacturerFullName(item.mfr) }}
              </template>

              <!-- Custom Slot for Type Column: Display 'Hot'/'Cold' instead of 'H'/'C'. -->
              <template v-slot:[`item.type`]="{ item }">
                {{ getCerealTypeFormatted(item.type) }}
              </template>

              <!-- Custom Slot for Loading State: Show skeleton loaders. -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex ga-2 justify-end">
                  <v-icon
                    color="medium-emphasis"
                    icon="mdi-pencil"
                    size="small"
                    @click.stop="edit(item)"
                  ></v-icon>

                  <v-icon
                    color="medium-emphasis"
                    icon="mdi-delete"
                    size="small"
                    @click.stop="remove(item.id)"
                  ></v-icon>
                </div>
              </template>

              <!-- Custom Slot for No Results: Show a helpful message. -->
              <template v-slot:no-results>
                <v-alert type="warning" class="ma-3">
                  No cereals found matching "{{ searchQuery }}".
                </v-alert>
              </template>
            </v-data-table>
            <!-- Uh oh, something broke -->
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
// Pinia imports for state management.
import { mapState, mapActions } from 'pinia'
// Import the specific store we need.
import { useCerealStore } from '@/stores/cerealStore.js'

import SearchBar from '@/components/SearchBar.vue'
import AddNewCerealModal from '@/components/AddNewCerealModal.vue'
import UpdateCerealModal from '@/components/UpdateCerealModal.vue'

export default {
  name: 'AllCereals',
  components: {
    SearchBar,
    AddNewCerealModal,
    UpdateCerealModal,
  },
  data() {
    return {
      searchQuery: '', // Holds the text entered in the search bar.
      selectedManufacturer: null, // Holds the selected manufacturer code (e.g., 'G', 'K'). Null means 'All'.
      selectedType: null, // Holds the selected type code ('C' or 'H'). Null means 'All'.
      showAddCerealModal: false, // Controls modal visibility
      showUpdateCerealModal: false,
      cerealToEdit: null,
      newCerealTemplate: {
        name: '',
        mfr: '',
        type: null,
        calories: null,
        protein: null,
        fat: null,
        sodium: null,
        fiber: null,
        carbs: null,
        sugars: null,
        vitamins: null,
        shelf: null,
        potassium: null,
        cups: null,
        weight: null,
      },

      // --- Table Configuration ---
      // Defines the columns for the v-data-table.
      // 'title' is the displayed header text.
      // 'key' matches the property name in the cereal data objects.
      // 'key' matches the property name in the cereal data objects.
      // 'align' controls text alignment.
      // 'sortable' allows users to sort by this column.
      headers: [
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
        { title: 'Actions', key: 'actions', align: 'end', sortable: false },
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

    // Computed property to filter cereals based on selections
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
      return filtered
    },
  },
  methods: {
    // Map actions from the store
    ...mapActions(useCerealStore, ['fetchCereals', 'createCereal', 'updateCereal', 'deleteCereal']),
    openAddCerealModal() {
      this.newCerealTemplate = {
        name: '',
        mfr: '',
        type: null,
        calories: null,
        protein: null,
        fat: null,
        sodium: null,
        fiber: null,
        carbs: null,
        sugars: null,
        vitamins: null,
        shelf: null,
        potassium: null,
        cups: null,
        weight: null,
      }
      this.showAddCerealModal = true
    },
    async handleCerealAdded(cerealData) {
      try {
        // Here you would typically call an action to add the cereal to your backend/store
        console.log('New cereal data submitted:', cerealData)
        // For example, if you have an action in your store:
        await this.createCereal(cerealData)
        // Assuming you map/create this action
        this.fetchCereals() // Refresh the list of cereals
        // The modal closes itself on successful submit, and v-model updates showAddCerealModal
      } catch (err) {
        console.error('Error adding cereal:', err)
        // Update your error state if needed
        this.error = err
        // Or a more user-friendly message
      }
    },
    openUpdateCerealModal(cerealItem) {
      // Find the full cereal object from the store's list to ensure all data is fresh
      const cerealData = this.cereals.find((c) => c.id === cerealItem.id)
      if (cerealData) {
        this.cerealToEdit = { ...cerealData } // Pass a copy to avoid direct mutation
        this.showUpdateCerealModal = true
      } else {
        console.error('Cereal data not found for editing:', cerealItem.id)
        // Optionally, show an error to the user
      }
    },

    async handleCerealUpdated(updatedCerealData) {
      try {
        await this.updateCereal(updatedCerealData)
        this.fetchCereals() // Refresh the list
        this.showUpdateCerealModal = false // Close the modal
      } catch (err) {
        console.error('Error updating cereal:', err)
        this.error = err // Display error
      }
    },
    edit(item) {
      // Changed parameter to be the full item
      // The 'item' passed from the v-data-table slot is the actual cereal object
      // Ensure you are passing the item itself, not just item.id if you change the @click handler
      // If `item` is just an ID, you'll need to find it in `this.cereals` first.
      // Assuming `item` is the cereal object from the table row:
      if (item && item.id) {
        this.openUpdateCerealModal(item)
      } else {
        // If item is just an ID (e.g. if you changed @click="edit(item.id)")
        const cerealToUpdate = this.cereals.find((c) => c.id === item)
        if (cerealToUpdate) {
          this.openUpdateCerealModal(cerealToUpdate)
        } else {
          console.error('Could not find cereal to edit with ID:', item)
        }
      }
    },

    async remove(itemId) {
      // Optional: Add a confirmation dialog here before deleting
      if (confirm('Are you sure you want to delete this cereal? Id: ' + itemId)) {
        try {
          await this.deleteCereal(itemId)
          this.fetchCereals() // Refresh the list
        } catch (err) {
          console.error('Error deleting cereal:', err)
          this.error = err // Display error
        }
      }
    },
    // Method called when a table row is clicked.
    // The event object and item data are passed automatically by v-data-table.
    handleRowClick(event, { item }) {
      // Vuetify's item structure can sometimes be nested under 'value' or 'raw'.
      // We try to get the actual data object robustly.
      const actualItem = item.value || item.raw || item
      // Check if we have a valid item with an ID and if the router is available.
      if (actualItem && actualItem.id && this.$router) {
        // Navigate to the CerealDetail page, passing the clicked cereal's ID as a route parameter.
        this.$router.push({ name: 'CerealDetail', params: { id: actualItem.id } })
      } else {
        // Log an error if navigation fails (e.g., missing ID or router).
        console.error(
          'Could not navigate to detail view. Item or router missing?',
          actualItem,
          this.$router,
        )
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
  padding: 2rem 1rem; /* Add some space around the content. */
  font-family: Poppins, sans-serif; /* Consistent font. */
}

/* Ensure the h1 title uses the primary theme color. */
h1.text-primary {
  color: rgb(var(--v-theme-primary));
}

.SearchAndButton {
  display: flex; /* Use flexbox for layout. */
}

.show-all-btn {
  text-transform: none; /* Keep the text casing as written. */
  font-weight: 500;
  font-size: 0.9em;
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  transition:
    background-color 0.3s ease,
    color 0.3s ease; /* Smooth hover effect. */
  height: 40px !important;
}

/* Style the table header cells. */
/* :deep() is needed to style elements inside child components (like v-data-table). */
.cereals-table :deep(thead th) {
  background-color: #f5f5f5; /* Light grey background for the header row. */
  color: #333; /* Darker text for contrast. */
  font-weight: bold; /* Make header text bold. */
  text-transform: uppercase; /* Uppercase text for a classic table look. */
  font-size: 0.8rem; /* Slightly smaller font size. */
  position: sticky; /* Keep header sticky when scrolling vertically. */
  top: 0; /* Stick to the top of the scrollable container. */
  z-index: 1; /* Ensure header stays above the scrolling table body. */
}

/* Change cursor to a pointer on table rows to indicate they are clickable. */
.cereals-table :deep(tbody tr) {
  cursor: pointer;
  transition: background-color 0.2s ease; /* Smooth background transition on hover */
}

/* Slightly darken row background on hover for better feedback. */
.cereals-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary-rgb), 0.08); /* Use theme color with low opacity */
}

/* Adjust padding within table cells for better spacing. */
.cereals-table :deep(td),
.cereals-table :deep(th) {
  padding: 8px 16px; /* Vertical and horizontal padding. */
}

/* Responsive adjustments */
@media (max-width: 960px) {
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
    padding: 6px 8px;
    font-size: 0.75rem;
  }
  .cereals-table :deep(thead th) {
    font-size: 0.7rem; /* Adjust header font size */
  }
}
</style>
