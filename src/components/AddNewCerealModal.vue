<template>
  <v-dialog v-model="internalDialogVisible" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Add New Cereal</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="validForm">
          <v-text-field v-model="cerealData.name" label="Name" required></v-text-field>
          <v-select
            v-model="cerealData.mfr"
            :items="manufacturerOptions"
            label="Manufacturer"
            required
          ></v-select>
          <v-select
            v-model="cerealData.type"
            :items="typeOptions"
            value=""
            label="Type"
            required
          ></v-select>
          <v-text-field
            v-model="cerealData.calories"
            label="Calories"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.protein"
            label="Protein"
            type="number"
            required
          ></v-text-field>
          <v-text-field v-model="cerealData.fat" label="Fat" type="number" required></v-text-field>
          <v-text-field
            v-model="cerealData.sodium"
            label="Sodium"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.fiber"
            label="Fiber"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.carbo"
            label="Carbs"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.sugars"
            label="Sugars"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.vitamins"
            label="Vitamins"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.shelf"
            label="Shelf"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.potass"
            label="Potassium"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.cups"
            label="Cups"
            type="number"
            required
          ></v-text-field>
          <v-text-field
            v-model="cerealData.weight"
            label="Weight"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'pinia'
// Import the specific store we need.
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'AddNewCerealModal',
  props: {
    modelValue: {
      // For v-model on the component: <AddNewCerealModal v-model="dialogOpen" ... />
      type: Boolean,
      required: true,
    },
    cereal: {
      // Prop for initial cereal data (template for new, or existing for edit)
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      validForm: true, // Form validity state, updated by v-form
      cerealData: this.getInitialCerealData(), // Initialize form data
      typeOptions: [
        { title: 'Cold', value: 'C' },
        { title: 'Hot', value: 'H' },
      ],
    }
  },
  computed: {
    ...mapState(useCerealStore, [
      'cereals',
      'loading',
      'error',
      'baseURL',
      'uniqueManufacturers',
      'getManufacturerFullName',
      'getCerealTypeFormatted',
    ]),
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
    internalDialogVisible: {
      get() {
        return this.modelValue
      },
      set(val) {
        // Emit 'input' event to support v-model on the component
        this.$emit('update:modelValue', val)
      },
    },
  },
  watch: {
    // When the dialog visibility changes (prop 'value')
    modelValue(isOpen) {
      if (isOpen) {
        this.resetFormAndData() // Reset form when dialog opens
      }
    },
    // When the 'cereal' prop changes
    cereal: {
      handler() {
        // If the dialog is open and the cereal prop changes, reset the form with new data.
        // If dialog is not open, resetFormAndData will be called when it opens via 'value' watcher.
        if (this.modelValue) {
          this.resetFormAndData()
        } else {
          // If dialog is closed, just update the internal data structure that will be used when it opens.
          this.cerealData = this.getInitialCerealData()
        }
      },
      deep: true, // Watch for nested changes in the cereal object
    },
  },
  methods: {
    // Helper to get initial data structure from the cereal prop
    getInitialCerealData() {
      return {
        name: this.cereal?.name ?? '',
        mfr: this.cereal?.mfr ?? '',
        type: this.cereal?.type ?? null,
        calories: this.cereal?.calories ?? null,
        protein: this.cereal?.protein ?? null,
        fat: this.cereal?.fat ?? null,
        sodium: this.cereal?.sodium ?? null,
        fiber: this.cereal?.fiber ?? null,
        carbo: this.cereal?.carbo ?? null,
        sugars: this.cereal?.sugars ?? null,
        vitamins: this.cereal?.vitamins ?? null,
        shelf: this.cereal?.shelf ?? null,
        potass: this.cereal?.potass ?? null,
        cups: this.cereal?.cups ?? null,
        weight: this.cereal?.weight ?? null,
      }
    },
    // Resets the form data and validation state
    resetFormAndData() {
      this.cerealData = this.getInitialCerealData()
      // $nextTick ensures the form DOM is updated before resetting validation
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
        this.validForm = true // Explicitly reset form validity state
      })
    },
    // Handles form submission
    async submitForm() {
      const isValid = await this.$refs.form.validate() // Explicitly validate the form
      if (isValid && this.validForm) {
        // Check both explicit validation and v-model state
        // Emit an event to the parent component with the new cereal data
        this.$emit('submit', { ...this.cerealData })
        this.closeDialog() // Close the dialog on successful submission
      }
    },
    // Closes the dialog
    closeDialog() {
      this.internalDialogVisible = false // This will trigger the 'set' in computed property, emitting 'input'
    },
  },
}
</script>
