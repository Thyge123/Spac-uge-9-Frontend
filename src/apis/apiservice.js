import axios from 'axios'

// The home base for our API calls. All cereal-related endpoints live under this URL.
const BASE_URL = 'https://localhost:7226/api/products/'

// Create an Axios instance with default settings.
const apiService = axios.create({
  baseURL: BASE_URL, // All requests made with this instance will automatically use this base URL.
  timeout: 10000, // If a request takes longer than 10 seconds (10000ms), cancel it.
  headers: {
    'Content-Type': 'application/json', // We'll primarily be sending and receiving JSON data.
  },
})

// --- API Function Definitions ---

// Fetches all cereals with their associated images.
export const FetchAllCerealsWithImages = async () => {
  try {
    // Make a GET request to the '/cereals/pictures' endpoint (relative to the baseURL).
    const response = await apiService.get('/cereals/pictures')
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
    const response = await apiService.get(`/cereal/picture/${id}`)
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
