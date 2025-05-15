// Pinia: The state management library that makes Vue components less stressed.
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode' // Import jwt-decode

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
  FetchUserProfile,
  FetchUserByUsername,
  UpdateUser,
  DeleteUser,
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
    baseURL: 'http://cerealsapi.runasp.net', // The root URL for fetching cereal images.
    cereal: null, // Holds a single cereal object, for the detail view. Starts lonely.
    authToken: localStorage.getItem('authToken') || null, // Initialize token from localStorage
    user: JSON.parse(localStorage.getItem('user')) || null,
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

    // Action to fetch a user by username.
    async fetchUserByUsername(username) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to fetch a user by username.
        const response = await FetchUserByUsername(username)
        return response.data || null
      } catch (err) {
        // If the fetch fails...
        console.error('Action: Failed to fetch user by username in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },

    // Action to update an existing user entry.
    async updateUser(userData) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to update a user.
        const response = await UpdateUser(userData)
        this.user = response.data // Update the user in the store
        localStorage.setItem('user', JSON.stringify(this.user)) // Update user in localStorage
        return response.data || null
      } catch (err) {
        // If the update fails...
        console.error('Action: Failed to update user in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },
    // Action to delete a user entry.
    async deleteUser(id) {
      this.loading = true // We're loading again!
      this.error = null // Clear previous errors.
      try {
        // Call the API function to delete a user.
        const response = await DeleteUser(id)
        this.authToken = null
        this.user = null
        localStorage.removeItem('authToken')
        setAuthToken(null)
        localStorage.removeItem('user') // Clear user from localStorage
        return response.data || null
      } catch (err) {
        // If the deletion fails...
        console.error('Action: Failed to delete user in store:', err)
        this.error = err // Store the error.
      } finally {
        // Always runs.
        this.loading = false // Stop loading indicator.
      }
    },

    // Action to log in a user.
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await Login(credentials)

        const token = response.data && response.data.token

        if (token) {
          this.authToken = token
          localStorage.setItem('authToken', token)
          setAuthToken(token) // Set token for API calls

          const decodedToken = jwtDecode(token) // Decode token to get user info
          const userData = await FetchUserProfile(decodedToken.id) // Fetch user profile
          this.user = userData.data
          localStorage.setItem('user', JSON.stringify(this.user)) // Store user in localStorage
          // No need to call checkTokenExpiration() immediately after login with a new token.
          return response.data
        } else {
          console.error('Action: Login successful but no token received.', response)
          throw new Error('Login successful but no token was provided by the server.')
        }
      } catch (err) {
        console.error(
          'Action: Failed to log in in store:',
          err.response ? err.response.data : err.message,
        )
        this.error = err.response ? err.response.data.message || err.response.data : err.message

        this.authToken = null
        this.user = null // Clear user state
        localStorage.removeItem('authToken')
        localStorage.removeItem('user') // Clear user from localStorage
        setAuthToken(null)
        throw err
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.authToken = null
      this.user = null
      localStorage.removeItem('authToken')
      setAuthToken(null)
      console.log('User logged out, token cleared.')
      // Here you might want to redirect to the login page or update UI
      // Example: router.push('/login');
    },
    checkTokenExpiration() {
      const token = this.authToken
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000 // Convert to seconds
          if (decodedToken.exp < currentTime) {
            console.log('Token expired, logging out.')
            this.logout()
            // Optionally, redirect to login or show a message
            // For example, if you have access to the router:
            // import router from '@/router'; // Adjust path as needed
            // router.push('/login');
          }
        } catch (error) {
          console.error('Error decoding token:', error)
          this.logout() // If token is malformed, logout
        }
      }
    },
    async initializeAuth() {
      const tokenFromStorage = localStorage.getItem('authToken')

      if (tokenFromStorage) {
        this.authToken = tokenFromStorage // Set token in state
        setAuthToken(tokenFromStorage) // Set token for API calls

        this.checkTokenExpiration() // Check if the token is expired. If so, logout() is called.

        // If token is still valid after checkTokenExpiration (i.e., logout was not called)
        if (this.authToken) {
          try {
            // User might have been loaded from localStorage by state initializer.
            // We will now attempt to refresh it from the server.
            const decoded = jwtDecode(this.authToken)
            const userProfileResponse = await FetchUserProfile(decoded.id)

            if (userProfileResponse && userProfileResponse.data) {
              this.user = userProfileResponse.data
              localStorage.setItem('user', JSON.stringify(this.user)) // Update localStorage with fresh data
            } else {
              // Failed to fetch fresh user profile, but token is valid.
              console.warn('Valid token, but failed to fetch user profile. Logging out.')
              this.logout()
            }
          } catch (error) {
            console.error('Error during auth initialization (fetching user profile):', error)
            this.logout()
          }
        }
      } else {
        // No token in localStorage, ensure clean logout state.
        this.logout()
      }
    },
  },
})
