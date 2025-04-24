<template>
  <div>
    <div v-if="loading" class="text-center pa-5">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading cereal details...</p>
    </div>
    <v-alert v-else-if="error" type="error" prominent border="left" elevation="2" class="ma-5">
      Failed to load cereal details: {{ error.message }}
    </v-alert>
    <v-container v-if="!loading && !error && cereal" class="cereal-detail-page my-5">
      <v-card class="mx-auto" max-width="900" outlined elevation="3">
        <v-row no-gutters>
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
          <v-col cols="12" md="7">
            <v-card-title class="text-h4 pt-4 pb-2">{{ cereal.name }}</v-card-title>
            <v-card-subtitle class="pb-3">
              By {{ getManufacturerFullName(cereal.mfr) }} | Type: {{ getCerealTypeFormatted(cereal.type) }}
            </v-card-subtitle>

            <v-divider class="mx-4"></v-divider>

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
              </v-row>

            </v-card-text>
            <v-divider class="mx-4"></v-divider>
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
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
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
        'getCerealTypeFormatted'
    ]),
  },
  methods: {
    ...mapActions(useCerealStore, ['fetchCerealById']),
  },
  async mounted() {
    const cerealId = this.$route.params.id
    await this.fetchCerealById(cerealId)
  },
  // Optional: Clear the specific cereal from the store when leaving the component
  // to avoid showing stale data briefly if navigating between detail pages.
  beforeUnmount() {
    const store = useCerealStore();
    store.cereal = null; // Reset the specific cereal state
  }
}
</script>

<style scoped>
.cereal-detail-page {
  padding: 0; /* Remove default container padding if needed */
}

.v-card {
  transition: box-shadow 0.3s ease-in-out;
  overflow: hidden; /* Ensures rounded corners apply correctly */
}

.v-card-text {
  flex: 0;
}

.v-card-title.text-h4 {
  font-weight: 500;
  line-height: 1.2;
  word-break: break-word; /* Prevent long names from breaking layout */
}

.v-card-subtitle {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.6);
}

.nutrient-item {
  background-color: #f5f5f5; /* Light background for each item */
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 8px; /* Space between items */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nutrient-label {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.nutrient-value {
  font-weight: bold;
  color: #1976D2; /* Primary color for value */
}

.text-h6 small {
  font-size: 0.8em;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.6);
}

.v-img {
  object-fit: cover; /* Ensure image covers the area */
}

.v-card-actions {
  margin-top:auto
}

div.v-col-md-7.v-col-12 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}


/* Responsive adjustments */
@media (max-width: 959px) { /* Vuetify 'md' breakpoint */
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
  margin-top: 40px;
}


.v-alert {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
</style>
