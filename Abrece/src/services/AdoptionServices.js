import api from "../lib/api";

export const AdoptionServices = {
  async createAdoption({
    pet_id,
    candidato_id,
    observacoes = "",
    taxa_adocao = null,
  }) {
    return api.post("/adocoes", {
      pet_id,
      candidato_id,
      observacoes,
      taxa_adocao,
    });
  },
};
