import api from "./api";

export const brandService = {
  async getAll() {
    const response = await api.get('/brands')
    return response.data
  }
}
