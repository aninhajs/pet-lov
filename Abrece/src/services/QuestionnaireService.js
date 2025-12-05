import api from "./api";

const QuestionnaireService = {
  async submit(payload) {
    const res = await api.post("/candidatos", payload);
    return res.data;
  },
};

export default QuestionnaireService;
