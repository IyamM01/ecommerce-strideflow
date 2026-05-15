import api from './api'

export const genderService = {
  async getAll() {
    const response = await api.get('/genders')
    return response.data
  },
}
