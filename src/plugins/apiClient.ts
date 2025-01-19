import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://run.mocky.io/v3',
})

export default apiClient
