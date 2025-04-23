const BASE_URL = 'https://localhost:7226/api/products/'
import axios from 'axios'

const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const FetchAllCereals = async () => {
  try {
    const response = await apiService.get('/cereals')
    return response
  } catch (error) {
    console.error('Error fetching cereals:', error)
    throw error
  }
}

export const FetchAllCerealsWithImages = async () => {
  try {
    const response = await apiService.get('/cereals/pictures')
    return response
  } catch (error) {
    console.error('Error fetching cereals with images:', error)
    throw error
  }
}
