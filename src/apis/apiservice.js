import axios from 'axios'

const BASE_URL = 'https://localhost:7226/api/products/'

// Create an Axios instance with default settings
const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fetch all cereals with images
// This function fetches all cereals with their images from the API and returns the response data.
export const FetchAllCerealsWithImages = async () => {
  try {
    const response = await apiService.get('/cereals/pictures')
    return response
  } catch (error) {
    console.error('Error fetching cereals with images:', error)
    throw error
  }
}

// Fetch a cereal by its ID
// This function fetches a specific cereal by its ID from the API and returns the response data.
export const FetchCerealById = async (id) => {
  try {
    const response = await apiService.get(`/cereal/picture/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching cereal by ID:', error)
    throw error
  }
}
