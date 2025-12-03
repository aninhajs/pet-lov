import api from "./api";

export const AdoptantServices = {
  async getAllAdoptants(params = {}) {
    const res = await api.get("/admin/adoptants", { params });
    return res.data;
  },
  async updateAdoptantStatus(id, status, observacoes = "", pet_id) {
    const res = await api.patch(`/admin/adoptants/${id}/status`, {
      status,
      observacoes,
      pet_id,
    });
    return res.data;
  },
  async getAdoptantById(id) {
    const res = await api.get(`/admin/adoptants/${id}`);
    return res.data;
  },
};
