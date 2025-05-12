<!--Modal for updating existing cereal product-->
<template>
  <v-dialog v-model="internalDialogVisible" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Update Cereal</span>
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
          <v-select v-model="cerealData.type" :items="typeOptions" label="Type" required></v-select>
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
        <v-btn color="primary" @click="submitForm">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'pinia'
// Import the specific store we need.
import { useCerealStore } from '@/stores/cerealStore.js'

export default {
  name: 'UpdateCerealModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    cereal: {
      // Prop for existing cereal data, must include 'id'
      type: Object,
      required: true,
      default: () => ({ id: null }), // Default to an object with id: null
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
        this.$emit('update:modelValue', val)
      },
    },
  },
  watch: {
    modelValue(isOpen) {
      if (isOpen) {
        this.resetFormAndData()
      }
    },
    cereal: {
      handler() {
        // If the dialog is open and the cereal prop changes, reset the form with new data.
        if (this.modelValue) {
          this.resetFormAndData()
        } else {
          // If dialog is closed, just update the internal data structure.
          // It will be correctly applied when resetFormAndData is called upon opening.
          this.cerealData = this.getInitialCerealData()
        }
      },
      deep: true, // Watch for nested changes in the cereal object
    },
  },
  methods: {
    getInitialCerealData() {
      // For an update modal, cerealData should be a copy of the cereal prop,
      // ensuring all fields, including 'id', are present.
      // Fallback values ensure the form fields have defined values.
      const currentCereal = this.cereal || {}
      return {
        id: currentCereal.id ?? null,
        name: currentCereal.name ?? '',
        mfr: currentCereal.mfr ?? '',
        type: currentCereal.type ?? null,
        calories: currentCereal.calories ?? null,
        protein: currentCereal.protein ?? null,
        fat: currentCereal.fat ?? null,
        sodium: currentCereal.sodium ?? null,
        fiber: currentCereal.fiber ?? null,
        carbo: currentCereal.carbo ?? null,
        sugars: currentCereal.sugars ?? null,
        vitamins: currentCereal.vitamins ?? null,
        shelf: currentCereal.shelf ?? null,
        potass: currentCereal.potass ?? null,
        cups: currentCereal.cups ?? null,
        weight: currentCereal.weight ?? null,
      }
    },
    resetFormAndData() {
      this.cerealData = this.getInitialCerealData()
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.resetValidation()
        }
        this.validForm = true
      })
    },
    async submitForm() {
      const isValid = await this.$refs.form.validate()
      if (isValid && this.validForm) {
        // Emit an event to the parent component with the updated cereal data.
        // The cerealData object already includes the 'id'.
        this.$emit('submit', { ...this.cerealData })
        this.closeDialog()
      }
    },
    closeDialog() {
      this.internalDialogVisible = false
    },
  },
}
</script>

<style scoped></style>
