<template>
  <v-slide-group :show-arrows="showArrowsBehavior" class="py-4">
    <v-slide-group-item v-for="cereal in cereals" :key="cereal.id">
      <v-card
        class="ma-3 cereal-card"
        width="300"
        rounded="lg"
        hover
        @click="$emit('cereal-clicked', cereal)"
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
            By: {{ manufacturerFullName(cereal.mfr) }}
          </v-card-subtitle>
        </div>
      </v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>

<script>
export default {
  name: 'CerealCarousel',
  props: {
    cereals: {
      type: Array,
      required: true,
    },
    baseURL: {
      type: String,
      required: true,
    },
    manufacturerFullName: {
      type: Function,
      required: true,
    },
    showArrowsBehavior: {
      type: [Boolean, String],
      default: true, // Default behavior for v-slide-group show-arrows
    },
  },
  emits: ['cereal-clicked'],
}
</script>

<style scoped>
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

.card-content {
  flex-grow: 1; /* Allow this area to take up remaining vertical space. */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center the text vertically if there's extra space. */
  padding: 1rem; /* Consistent padding inside the content area. */
}
</style>
