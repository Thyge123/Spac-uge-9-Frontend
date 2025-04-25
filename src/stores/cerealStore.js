import { defineStore } from 'pinia'
import { FetchAllCerealsWithImages, FetchCerealById } from '@/apis/apiservice.js'

// Define the manufacturer map
const manufacturerMap = {
  A: 'American Home Food Products',
  G: 'General Mills',
  K: 'Kelloggs',
  N: 'Nabisco',
  P: 'Post',
  Q: 'Quaker Oats',
  R: 'Ralston Purina',
}

export const useCerealStore = defineStore('cereals', {
  // State: Defined as a function that returns the initial state object
  state: () => ({
    cereals: [],
    loading: false,
    error: null,
    baseURL: 'https://localhost:7226', // Base URL for images
    cereal: null, // To store a single cereal object
  }),

  // Getters: Computed properties that derive state
  getters: {
    uniqueManufacturers: (state) => {
      const manufacturers = new Set(state.cereals.map((cereal) => cereal.mfr)) // Get unique manufacturers from the cereals array. Use Set to filter out duplicates
      return Array.from(manufacturers).sort()
    },
    getManufacturerFullName: () => {
      return (code) => manufacturerMap[code] || code // Return the full name or the code if not found.
    },
    // Getter for formatting cereal type
    getCerealTypeFormatted: () => {
      return (typeCode) => {
        if (typeCode === 'C') return 'Cold'
        if (typeCode === 'H') return 'Hot'
        return typeCode // Return original code if not C or H
      }
    },
  },

  // Actions: Methods that can be asynchronous and mutate the state
  actions: {
    async fetchCereals() {
      this.loading = true
      this.error = null
      try {
        const response = await FetchAllCerealsWithImages()
        this.cereals = response.data || [] // Ensure it's an array
      } catch (err) {
        console.error('Failed to fetch cereals in store:', err)
        this.error = err
        this.cereals = [] // Reset cereals on error
      } finally {
        this.loading = false
      }
    },
    async fetchCerealById(id) {
      this.loading = true
      this.error = null
      this.cereal = null
      try {
        const response = await FetchCerealById(id)
        this.cereal = response.data || null // Assign fetched data or null
      } catch (err) {
        console.error('Failed to fetch cereal by ID in store:', err)
        this.error = err
        this.cereal = null // Reset cereal on error
      } finally {
        this.loading = false
      }
    },
  },
})
