import api from "./api";

export const AdoptantServices = {
  async getAllAdoptants(params = {}) {
    const res = await api.get("/admin/adoptants", { params });
    return res.data;
  },
  async updateAdoptantStatus(id, status, observacoes = "") {
    const res = await api.patch(`/admin/adoptants/${id}/status`, { status, observacoes });
    return res.data;
  },
};
