import axios from 'axios'

// The home base for our API calls. All cereal-related endpoints live under this URL.
const BASE_URL = 'https://cerealsapi.runasp.net/api/'
const LOGIN_URL = 'https://cerealsapi.runasp.net/api/login' // URL for the login endpoint.

// Create an Axios instance with default settings.
const apiService = axios.create({
  baseURL: BASE_URL, // All requests made with this instance will automatically use this base URL.
  timeout: 10000, // If a request takes longer than 10 seconds (10000ms), cancel it.
  headers: {
    'Content-Type': 'application/json', // We'll primarily be sending and receiving JSON data.
  },
})

// Function to set the authorization token for the apiService instance
export const setAuthToken = (token) => {
  if (token) {
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiService.defaults.headers.common['Authorization']
    console.log('API Service: Auth token has been removed.')
  }
}

// Automatically set the token if it's in localStorage when the app loads
const storedToken = localStorage.getItem('authToken')
if (storedToken) {
  setAuthToken(storedToken)
}

// --- API Function Definitions ---

// Fetches all cereals with their associated images.
export const FetchAllCerealsWithImages = async () => {
  try {
    // Make a GET request to the '/cereals/pictures' endpoint (relative to the baseURL).
    const response = await apiService.get('products/cereals/pictures')
    // If successful, return the entire response object (which includes data, status, headers, etc.).
    return response
  } catch (error) {
    // If the request fails (network error, server error, timeout)...
    console.error('API Service: Error fetching cereals with images:', error)
    // Re-throw the error so the calling code (like the Pinia store action) can handle it.
    throw error
  }
}

// Fetches a single, specific cereal by its unique ID, including picture info.
export const FetchCerealById = async (id) => {
  // Basic validation: Ensure an ID was actually provided. No ID, no cereal!
  if (!id) {
    console.error('API Service: FetchCerealById called without an ID.')
    throw new Error('Cereal ID is required to fetch details.') // Throw a specific error.
  }
  try {
    // Make a GET request using a template literal to include the ID in the URL path.
    const response = await apiService.get(`products/cereal/picture/${id}`)
    console.log(`API Service: Successfully fetched cereal ID: ${id}.`)
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error(`API Service: Error fetching cereal by ID ${id}:`, error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Create a new cereal entry in the database.
export const CreateCereal = async (cerealData) => {
  try {
    // Make a POST request to the '/cereal' endpoint with the cereal data.
    const response = await apiService.post('products/cereal/add', cerealData)
    console.log('API Service: Successfully created new cereal.')
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error('API Service: Error creating new cereal:', error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Update an existing cereal entry in the database.
export const UpdateCereal = async (cerealData) => {
  try {
    // Make a PUT request to the '/cereal' endpoint with the cereal data.
    const response = await apiService.put('products/cereal/update', cerealData)
    console.log('API Service: Successfully updated cereal.')
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error('API Service: Error updating cereal:', error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Delete a cereal entry from the database.
export const DeleteCereal = async (id) => {
  // Basic validation: Ensure an ID was actually provided. No ID, no cereal!
  if (!id) {
    console.error('API Service: DeleteCereal called without an ID.')
    throw new Error('Cereal ID is required to delete.') // Throw a specific error.
  }
  try {
    // Make a DELETE request using a template literal to include the ID in the URL path.
    const response = await apiService.delete(`products/cereal/delete/${id}`)
    console.log(`API Service: Successfully deleted cereal ID: ${id}.`)
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error(`API Service: Error deleting cereal by ID ${id}:`, error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

//Fetch user profile data
export const FetchUserProfile = async (userId) => {
  // Basic validation: Ensure a user ID was actually provided.
  if (!userId) {
    console.error('API Service: FetchUserProfile called without a user ID.')
    throw new Error('User ID is required to fetch profile.') // Throw a specific error.
  }
  try {
    // Make a GET request using a template literal to include the user ID in the URL path.
    const response = await apiService.get(`users/${userId}`)
    console.log(`API Service: Successfully fetched user profile ID: ${userId}.`)
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error(`API Service: Error fetching user profile by ID ${userId}:`, error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Fetch user data by username.
export const FetchUserByUsername = async (username) => {
  // Basic validation: Ensure a username was actually provided.
  if (!username) {
    console.error('API Service: FetchUserByUsername called without a username.')
    throw new Error('Username is required to fetch user data.') // Throw a specific error.
  }
  try {
    // Make a GET request using a template literal to include the username in the URL path.
    const response = await apiService.get(`users/username/${username}`)
    console.log(`API Service: Successfully fetched user by username: ${username}.`)
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error(`API Service: Error fetching user by username ${username}:`, error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Create a new user entry in the database.
export const CreateUser = async (userData) => {
  try {
    // Make a POST request to the '/users' endpoint with the user data.
    const response = await apiService.post('users', userData)
    console.log('API Service: Successfully created new user.')
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error('API Service: Error creating new user:', error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Update an existing user entry in the database.
export const UpdateUser = async (userData) => {
  try {
    // Make a PUT request to the '/users' endpoint with the user data.
    const response = await apiService.put('users', userData)
    console.log('API Service: Successfully updated user.')
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error('API Service: Error updating user:', error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Delete a user entry from the database.
export const DeleteUser = async (id) => {
  // Basic validation: Ensure an ID was actually provided. No ID, no user!
  if (!id) {
    console.error('API Service: DeleteUser called without an ID.')
    throw new Error('User ID is required to delete.') // Throw a specific error.
  }
  try {
    // Make a DELETE request using a template literal to include the ID in the URL path.
    const response = await apiService.delete(`users/${id}`)
    console.log(`API Service: Successfully deleted user ID: ${id}.`)
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error(`API Service: Error deleting user by ID ${id}:`, error)
    // Re-throw the error for upstream handling.
    throw error
  }
}

// Login function to authenticate a user.
export const Login = async (credentials) => {
  try {
    // Make a POST request to the login endpoint with the provided credentials.
    const response = await apiService.post(LOGIN_URL, credentials)
    console.log('API Service: Successfully logged in.')
    // Return the full response object.
    return response
  } catch (error) {
    // Handle potential errors.
    console.error('API Service: Error during login:', error)
    // Re-throw the error for upstream handling.
    throw error
  }
}
