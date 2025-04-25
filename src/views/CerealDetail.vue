<template>
  <div>
    <!-- Loading State: Show a spinner while we fetch the cereal's secrets. Is it hiding something? -->
    <div v-if="loading" class="text-center pa-5">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading cereal details...</p>
    </div>
    <!-- Error State: If fetching fails, show a prominent error message. Did the cereal run away? -->
    <v-alert
      v-else-if="error"
      type="error"
      prominent
      border="left"
      elevation="2"
      class="text-center"
    >
      Failed to load cereal details: {{ error.message }}. Maybe the cereal is shy? Or the server is
      napping.
    </v-alert>
    <!-- Main Content: Displayed only when loading is done, there's no error, and we actually have cereal data. -->
    <v-container v-if="!loading && !error && cereal" class="cereal-detail-page my-5">
      <!-- v-card: The main container for the detail view, centered and with a max width. -->
      <v-card class="mx-auto" max-width="900" outlined elevation="3">
        <!-- v-row/v-col: Creating a two-column layout. -->
        <v-row no-gutters>
          <!-- no-gutters removes spacing between columns. -->
          <v-col cols="12" md="5">
            <v-img
              :src="baseURL + cereal.picture"
              height="100%"
              cover
              class="rounded-l-lg d-none d-md-block"
            ></v-img>
            <v-img
              :src="baseURL + cereal.picture"
              height="300px"
              cover
              class="rounded-t-lg d-md-none"
            ></v-img>
          </v-col>
          <!-- Details Column -->
          <v-col cols="12" md="7">
            <v-card-title class="text-h4 pt-4 pb-2">{{ cereal.name }}</v-card-title>
            <v-card-subtitle class="pb-3">
              <!-- Subtitle: Manufacturer and Type, using our handy formatters from the store. -->
              By {{ getManufacturerFullName(cereal.mfr) }} | Type:
              {{ getCerealTypeFormatted(cereal.type) }}
            </v-card-subtitle>

            <v-divider class="mx-4"></v-divider>

            <!-- Nutritional Information Section -->
            <v-card-text class="pt-4">
              <h3 class="text-h6 mb-3">Nutritional Information <small>(per serving)</small></h3>
              <v-row dense>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Calories:</span>
                    <span class="nutrient-value">{{ cereal.calories }}</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Sugars:</span>
                    <span class="nutrient-value">{{ cereal.sugars }}g</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Fiber:</span>
                    <span class="nutrient-value">{{ cereal.fiber }}g</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Carbs:</span>
                    <span class="nutrient-value">{{ cereal.carbo }}g</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Protein:</span>
                    <span class="nutrient-value">{{ cereal.protein }}g</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Vitamins:</span>
                    <span class="nutrient-value">{{ cereal.vitamins }}%</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Fat:</span>
                    <span class="nutrient-value">{{ cereal.fat }}g</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Sodium:</span>
                    <span class="nutrient-value">{{ cereal.sodium }}mg</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Potassium:</span>
                    <span class="nutrient-value">{{ cereal.potass }}mg</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>

            <!-- Serving & Storage Information Section -->
            <v-card-text class="pt-4">
              <h3 class="text-h6 mb-3">Serving & Storage</h3>
              <v-row dense>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Weight:</span>
                    <span class="nutrient-value">{{ cereal.weight }}kg</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Shelf:</span>
                    <span class="nutrient-value">{{ cereal.shelf }}</span>
                  </div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="nutrient-item">
                    <span class="nutrient-label">Cups:</span>
                    <span class="nutrient-value">{{ cereal.cups }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- Card Actions: Back button to return to the list of cereals. -->
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <!-- Pushes the button to the right. -->
              <!-- Back Button: Uses Vue Router to go back to the previous page. Go back! Go back! -->
              <v-btn color="primary" text @click="$router.go(-1)">
                <v-icon left>mdi-arrow-left</v-icon>
                Back to List
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'CerealDetail',
  data() {
    return {
      // No local data needed as it's managed by Pinia
    }
  },
  computed: {
    ...mapState(useCerealStore, [
      'loading',
      'error',
      'baseURL',
      'cereal',
      'getManufacturerFullName',
      'getCerealTypeFormatted',
    ]),
  },
  methods: {
    ...mapActions(useCerealStore, ['fetchCerealById']),
  },
  async mounted() {
    const cerealId = this.$route.params.id
    await this.fetchCerealById(cerealId)
  },
  // Clear the specific 'cereal' state in the store when leaving this page.
  // This prevents briefly showing the old cereal's data if the user navigates
  // directly from one detail page to another. No ghosts of cereals past!
  beforeUnmount() {
    const store = useCerealStore()
    store.cereal = null // Reset the specific cereal state
  },
}
</script>

<style scoped>
.cereal-detail-page {
  padding: 0;
}

.v-card {
  transition: box-shadow 0.3s ease-in-out;
  overflow: hidden; /* Ensures content respects the card's rounded corners.*/
}

/* Ensure card text sections don't try to grow unnecessarily */
.v-card-text {
  flex-grow: 0; /* Prevent v-card-text from expanding vertically. */
  flex-shrink: 0; /* Prevent shrinking too much if content is sparse */
}

/* Style the main title. */
.v-card-title.text-h4 {
  font-weight: 500;
  line-height: 1.2; /* Adjust line spacing for readability. */
  word-break: break-word; /* Prevent long cereal names from overflowing the card. */
}

/* Style the subtitle. */
.v-card-subtitle {
  font-size: 1rem;
  color: rgba(0, 0, 0, 1);
  font-weight: 600; /* Regular weight for subtitle. */
  padding: 0 1.25rem; /* Add some padding for breathing room. */
}

/* Styling for the individual nutrient fact boxes. */
.nutrient-item {
  background-color: #dddddd; /* Light background for visual separation. */
  padding: 8px 12px;
  border-radius: 4px; /* Slightly rounded corners. */
  margin-bottom: 8px; /* Space between items vertically. */
  display: flex; /* Use flexbox to align label and value. */
  justify-content: space-between; /* Push label left, value right. */
  align-items: center; /* Keep them vertically centered. */
  min-height: 40px; /* Ensure consistent height, even if values are short. */
}

/* Style the label part (e.g., "Calories:"). */
.nutrient-label {
  font-weight: 500; /* Medium weight. */
  color: #333; /* Dark grey text. */
  margin-right: 8px; /* Space between label and value. */
  white-space: nowrap; /* Prevent label text from wrapping. Keep it tidy. */
}

/* Style the value part (e.g., "110"). */
.nutrient-value {
  font-weight: bold; /* Make the value stand out. */
  color: rgb(var(--v-theme-primary)); /* Use the primary theme color. */
  text-align: right; /* Align value to the right */
}

/* Style the small text within the section headings. */
.text-h6 small {
  font-size: 0.8em;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.6);
}

/* Ensure the image covers its container nicely.*/
.v-img {
  object-fit: cover;
}

/* Force card actions to the bottom of the details column */
.v-card-actions {
  margin-top: auto; /* Pushes actions to the bottom in the flex column. Gravity! */
}

/* Ensure the details column uses flex layout to position actions at the bottom */
div.v-col-md-7.v-col-12 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align content top, but allow actions to push down */
}

/* Responsive adjustments */
@media (max-width: 959px) {
  /* Vuetify 'md' breakpoint */
  .v-card-title.text-h4 {
    font-size: 1.75rem !important; /* Slightly smaller title on smaller screens */
  }
  .v-img.rounded-l-lg {
    border-radius: 0 !important; /* Remove side rounding when stacked */
  }
  .v-card {
    border-radius: 8px !important; /* Ensure card has rounding when stacked */
  }
}

/* Loading and Error states */
.text-center.pa-5 {
  margin-top: 40px; /* Add some top margin to center vertically better. */
}

/* Ensure alert messages are constrained and centered like the card */
.v-alert {
  max-width: 900px; /* Match the card width. */
  margin-left: auto; /* Center the alert horizontally. */
  margin-right: auto;
}
</style>
