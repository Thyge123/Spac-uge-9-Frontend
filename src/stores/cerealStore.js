// Pinia: The state management library that makes Vue components less stressed.
import { defineStore } from 'pinia'
// Our custom API service functions. Like little messengers fetching data.
import {
  FetchAllCerealsWithImages,
  FetchCerealById,
  CreateCereal,
  UpdateCereal,
  DeleteCereal,
  Login,
  setAuthToken,
  CreateUser,
} from '@/apis/apiservice.js'

// Define the manufacturer map: Translating cryptic codes into actual company names.
// Because who remembers what 'A' stands for?.
const manufacturerMap = {
  A: 'American Home Food Products',
  G: 'General Mills',
  K: 'Kelloggs',
  N: 'Nabisco',
  P: 'Post',
  Q: 'Quaker Oats',
  R: 'Ralston Purina',
}

// defineStore: This is where the magic happens. We're creating a 'store' named 'cereals'.
export const useCerealStore = defineStore('cereals', {
  // State: The heart of the store. Where all the data lives.
  // Defined as a function returning an object to ensure reactivity and prevent state sharing between components.
  state: () => ({
    cereals: [], // An array to hold all our cereal objects.
    loading: false, // Are we currently fetching data?
    error: null, // Did something go wrong during fetch? Starts null, hoping for the best.
    baseURL: 'https://localhost:7226', // The root URL for fetching cereal images.
    cereal: null, // Holds a single cereal object, for the detail view. Starts lonely.
    authToken: localStorage.getItem('authToken') || null, // Initialize token from localStorage
    user: null,
  }),

  // Getters: Computed properties derived from the state.
  getters: {
    // Calculates a unique list of manufacturer codes from the 'cereals' array.
    uniqueManufacturers: (state) => {
      // 1. Map over cereals to get just the 'mfr' codes.
      // 2. Use a Set to automatically discard duplicates. Sets are cool like that.
      // 3. Convert the Set back to an Array.
      // 4. Sort it alphabetically.
      const manufacturers = new Set(state.cereals.map((cereal) => cereal.mfr))
      return Array.from(manufacturers).sort()
    },
    //This function takes a manufacturer code...
    getManufacturerFullName: () => {
      // ...and returns the full name from our map, or the code itself if it's not in the map (fallback).
      return (code) => manufacturerMap[code] || `Unknown (${code})`
    },
    // Getter for formatting cereal type: Turns 'C' into 'Cold' and 'H' into 'Hot'.
    getCerealTypeFormatted: () => {
      // Another getter returning a function. Takes the type code...
      return (typeCode) => {
        if (typeCode === 'C') return 'Cold'
        if (typeCode === 'H') return 'Hot'
        return typeCode // If it's neither C nor H, just return the code. Maybe it's a secret type? Who knows. I don't.
      }
    },
    isAuthenticated: (state) => !!state.authToken, // Getter to check if user is authenticated
  },

  // Actions: Methods that can perform asynchronous operations (like API calls) and mutate the state.
  actions: {
    // Action to fetch the list of all cereals.
    async fetchCereals() {
      this.loading = true // Set loading state to true. "Working on it!"
      this.error = null // Clear any previous errors. Fresh start!
      try {
        // Call the API function.
        const response = await FetchAllCerealsWithImages()
        console.log('Action: fetchCereals response received', response)
        // Update the state with the fetched data. Ensure it's an array, even if the API returns weird stuff.
        this.cereals = response.data || []
      } catch (err) {
        // If anything goes wrong in the 'try' block...
        console.error('Action: Failed to fetch cereals in store:', err)
        this.error = err // Store the error object in the state. Uh oh.
        this.cereals = [] // Reset cereals array to empty on error. Safety first.
      } finally {
        // This block always runs, whether the 'try' succeeded or failed.
        this.loading = false // Set loading state back to false. "Done working (or failed trying)!"
      }
    },

    // Action to fetch a single cereal by its ID. For the detail view.
    async fetchCerealById(id) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      this.cereal = null // Clear the previous single cereal data.
      try {
        // Call the API function to get a specific cereal. Await the result.
        const response = await FetchCerealById(id)
        console.log('Action: fetchCerealById response received', response)
        // Update the 'cereal' state property with the fetched data, or null if nothing came back.
        this.cereal = response.data || null
      } catch (err) {
        // If the fetch fails...
        console.error('Action: Failed to fetch cereal by ID in store:', err)
        this.error = err // Store the error.
        this.cereal = null // Ensure 'cereal' is null on error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },

    // Action to create a new cereal entry.
    async createCereal(cerealData) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to create a new cereal.
        const response = await CreateCereal(cerealData)
        console.log('Action: createCereal response received', response)
        // Optionally, you could fetch the updated list of cereals here or just return the new cereal.
        return response.data || null
      } catch (err) {
        // If the creation fails...
        console.error('Action: Failed to create cereal in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    // Action to update an existing cereal entry.
    async updateCereal(cerealData) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to update a cereal.
        const response = await UpdateCereal(cerealData)
        console.log('Action: updateCereal response received', response)
        // Optionally, you could fetch the updated list of cereals here or just return the updated cereal.
        return response.data || null
      } catch (err) {
        // If the update fails...
        console.error('Action: Failed to update cereal in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    // Action to delete a cereal entry.
    async deleteCereal(id) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to delete a cereal.
        const response = await DeleteCereal(id)
        console.log('Action: deleteCereal response received', response)
        // Optionally, you could fetch the updated list of cereals here or just return the response.
        return response.data || null
      } catch (err) {
        // If the deletion fails...
        console.error('Action: Failed to delete cereal in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    // Action to create a new user entry.
    async createUser(userData) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to create a new user.
        const response = await CreateUser(userData)
        console.log('Action: createUser response received', response)
        return response.data || null
      } catch (err) {
        // If the creation fails...
        console.error('Action: Failed to create user in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    // Action to log in a user.
    async login(credentials) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to log in.
        const response = await Login(credentials)
        console.log('Action: login response received', response)

        // Assuming your API returns the token in response.data.token
        // Adjust 'response.data.token' if the structure is different
        const token = response.data && response.data.token

        if (token) {
          this.authToken = token // 1. Store token in Pinia state
          localStorage.setItem('authToken', token) // 2. Store token in localStorage
          setAuthToken(token) // 3. Set token for API service headers

          // Optionally, store user information if it's part of the response
          // if (response.data.user) {
          //   this.user = response.data.user;
          // }
          console.log('User logged in, token stored.')
          return response.data // Or true, or user data, depending on what you want to return
        } else {
          // Handle cases where login is "successful" according to HTTP status, but no token is returned
          console.error('Action: Login successful but no token received.', response)
          throw new Error('Login successful but no token was provided by the server.')
        }
      } catch (err) {
        // If the login fails...
        console.error(
          'Action: Failed to log in in store:',
          err.response ? err.response.data : err.message,
        )
        this.error = err.response ? err.response.data.message || err.response.data : err.message // Store a more user-friendly error message

        // Clear any potentially stale token information
        this.authToken = null
        localStorage.removeItem('authToken')
        setAuthToken(null)
        throw err // Re-throw the error for the component to handle (e.g., display error message)
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    logout() {
      this.authToken = null
      this.user = null // Clear user data as well
      localStorage.removeItem('authToken')
      setAuthToken(null) // Clear token from API service headers
      console.log('User logged out, token cleared.')
      // Here you might want to redirect to the login page or update UI
      // Example: router.push('/login');
    },
  },
})
