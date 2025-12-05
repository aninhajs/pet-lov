import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const sections = [
  {
    id: "adotante",
    title: "Informações do adotante",
    accent: "sky",
    items: [
      { field: "nome", label: "Nome completo", type: "text", required: true },
      { field: "idade", label: "Idade", type: "text" },
      {
        field: "endereco",
        label: "Endereço completo",
        type: "text",
        required: true,
        fullWidth: true,
      },
      { field: "bairro", label: "Bairro", type: "text" },
      { field: "cep", label: "CEP", type: "text" },
      { field: "celular_01", label: "Celular 01", type: "text", required: true },
      { field: "celular_02", label: "Celular 02", type: "text" },
      { field: "profissao", label: "Profissão", type: "text" },
      { field: "instagram", label: "Instagram", type: "text" },
      { field: "facebook", label: "Facebook", type: "text" },
    ],
  },
  {
    id: "residencia",
    title: "Informações sobre a residência",
    accent: "yellow",
    items: [
      {
        field: "mora_em",
        label: "Mora em",
        type: "radio",
        options: ["Casa", "Apartamento", "Sítio", "Chácara"],
      },
      {
        field: "residencia_tipo",
        label: "Sua residência é",
        type: "radio",
        options: ["Alugada", "Própria", "De um parente"],
      },
      {
        field: "proprietarios_aceitam",
        label: "Se alugada, os proprietários aceitam animais?",
        type: "text",
        fullWidth: true,
      },
      {
        field: "normas_condominio_animais",
        label: "Normas do condomínio sobre animais",
        type: "text",
        fullWidth: true,
      },
      {
        field: "tipo_portao",
        label: "Portão com acesso à rua",
        type: "radio",
        options: [
          "Gradeado",
          "Parte gradeado, parte fechado",
          "Totalmente fechado",
          "Telado",
          "Não tem portão",
          "Outro",
        ],
        fullWidth: true,
      },
      {
        field: "residencia_possui",
        label: "Assinale o que sua residência possui",
        type: "checkbox",
        options: [
          "Quintal",
          "Área",
          "Varanda",
          "Muro com mais de 2 metros",
          "Muro com 1 metro",
          "Cercada",
          "Janelas teladas",
        ],
        fullWidth: true,
      },
      {
        field: "area_tipo",
        label: "Caso tenha quintal/área/varanda, elas são",
        type: "checkbox",
        options: [
          "Gramado(a)",
          "No cimento",
          "Cerâmica",
          "Coberto(a)",
          "Parcialmente coberto(a)",
          "Tem proteção contra a chuva",
        ],
        fullWidth: true,
      },
    ],
  },
  {
    id: "moradores",
    title: "Moradores da casa",
    accent: "green",
    items: [
      {
        field: "reside_com_quantas_pessoas",
        label:
          "Reside com quantas pessoas? Quem são? Estão de acordo com a adoção?",
        type: "textarea",
        fullWidth: true,
      },
      {
        field: "responsavel_financeiro",
        label: "Quem será o responsável financeiro pelo animal?",
        type: "text",
      },
      {
        field: "reacao_mordida_arranho",
        label:
          "Se o animal mordesse/arranhasse alguém, qual seria a reação?",
        type: "textarea",
      },
      {
        field: "possui_veiculo",
        label:
          "Possui veículo para transporte? Se não, como levará ao veterinário?",
        type: "textarea",
      },
      {
        field: "trabalha",
        label: "Você trabalha? Qual profissão/emprego?",
        type: "text",
      },
      {
        field: "profissao_moradores",
        label: "As pessoas que moram com você trabalham? Profissões?",
        type: "text",
      },
      {
        field: "alguem_alergico",
        label: "Algum morador é alérgico?",
        type: "text",
      },
      {
        field: "tem_criancas",
        label: "Tem crianças em casa? Qual a idade?",
        type: "text",
      },
      {
        field: "alguem_dirige",
        label:
          "Alguém dirige e poderia levar o animal imediatamente ao veterinário?",
        type: "text",
      },
    ],
  },
  //A partir daqui as perguntas NÃO são obrigatórias!!!
  {
    id: "animais",
    title: "Animais atuais ou anteriores",
    accent: "purple",
    items: [
      {
        field: "ja_teve_tem_animais",
        label: "Já teve/tem outros animais? Quantos, espécie e idade.",
        type: "textarea",
        fullWidth: true,
      },
      {
        field: "motivo_perda_animais",
        label: "O que houve com os antigos animais?",
        type: "checkbox",
        options: [
          "Faleceram de velhice",
          "Faleceram por doença",
          "Se perderam/fugiram",
          "Morreu atropelado/envenenado",
          "Doado para alguém de confiança",
          "Doado para um estranho",
          "Vendido",
          "Outro",
        ],
        fullWidth: true,
      },
      {
        field: "vacinados_quais",
        label: "São/eram vacinados? Quais?",
        type: "textarea",
      },
      { field: "marca_racao", label: "Marca da ração atual/anterior", type: "text" },
      {
        field: "castrados_motivo",
        label: "São/eram castrados? Caso não, por quê?",
        type: "textarea",
      },
      {
        field: "teve_filhotes",
        label:
          "Já tiveram filhotes? Quantas vezes? O que fez com os filhotes?",
        type: "textarea",
      },
    ],
  },
  //Aqui elas já voltam a ser obrigatórias!!
  {
    id: "cuidados",
    title: "Cuidados com o futuro animalzinho",
    accent: "orange",
    items: [
      {
        field: "passeios",
        label: "Em relação aos passeios",
        type: "radio",
        options: [
          "Acesso livre à rua",
          "Ensinar a passear sozinho e voltar",
          "Passeios sem guia, apenas com presença",
          "Passeios apenas com guia e com presença",
        ],
        fullWidth: true,
      },
      {
        field: "quantia_mensal",
        label: "Quantia mensal disponível para cuidados",
        type: "radio",
        options: [
          "Menos que 50 reais",
          "50 reais",
          "50-100 reais",
          "100-150 reais",
          "150-200 reais",
          "Mais que 200 reais",
        ],
        fullWidth: true,
      },
      {
        field: "tempo_sozinho",
        label: "Quanto tempo o animal ficará sozinho?",
        type: "text",
      },
      {
        field: "frequencia_passeios",
        label: "Quantas vezes por dia/semana poderá passear?",
        type: "text",
      },
      {
        field: "devolveria_se_mudar",
        label:
          "Devolveria o animal caso precise mudar? Como se organizaria?",
        type: "textarea",
      },
      {
        field: "destino_animal",
        label: "Para qual destino seria o animal?",
        type: "radio",
        options: ["Guarda", "Companhia", "Presente", "Outros"],
        fullWidth: true,
      },
      {
        field: "comodo_dia",
        label: "Em qual cômodo ficará durante o dia",
        type: "radio",
        options: [
          "Quintal/Área/Varanda",
          "Canil",
          "Amarrado",
          "Dentro de casa",
          "Dentro de casa com acesso ao quintal",
        ],
        fullWidth: true,
      },
      {
        field: "local_dormir",
        label: "Onde o animalzinho irá dormir",
        type: "radio",
        options: [
          "No chão do quintal/Área/Varanda",
          "Na casinha/caminha externa",
          "Na casinha/caminha interna",
          "No meu quarto/sala",
          "No canil",
          "Amarrado",
        ],
        fullWidth: true,
      },
      {
        field: "tempo_preso",
        label: "O animal ficará amarrado/preso? Razões e tempo.",
        type: "textarea",
      },
      {
        field: "reacao_bagunca",
        label:
          "Se fizer bagunça ou destruir algo de valor, qual sua atitude?",
        type: "textarea",
      },
      {
        field: "providencia_crescimento",
        label: "Caso o animal cresça mais que o esperado, o que fará?",
        type: "radio",
        options: [
          "Doar para alguém com mais espaço",
          "Deixar apenas no quintal",
          "Levar para um sítio",
          "Devolver para a ONG",
          "Continuar com ele",
        ],
        fullWidth: true,
      },
      {
        field: "responsavel_viagem",
        label: "Em caso de viagem, quem ficará com o animal?",
        type: "text",
      },
      {
        field: "pretende_mudar_5_anos",
        label: "Pretende se mudar em 5 anos? Como ficará o animal?",
        type: "text",
      },
      {
        field: "reacao_choro_latido",
        label: "O que fará se o animal chorar/latir/uivar?",
        type: "textarea",
      },
    ],
  },
  {
    id: "veterinario",
    title: "Cuidados veterinários e saúde",
    accent: "red",
    items: [
      {
        field: "vacinas_que_dara",
        label: "Quais vacinas irá dar ao adotado?",
        type: "textarea",
      },
      {
        field: "marca_racao_adotado",
        label: "Marca de ração para o adotado",
        type: "text",
      },
      {
        field: "criterios_alimentacao",
        label: "Critérios para escolha da alimentação",
        type: "textarea",
      },
      {
        field: "filhotes_ou_castrar",
        label: "Pretende ter filhotes ou castrar? O que pensa?",
        type: "textarea",
      },
      {
        field: "preparado_responsabilidade",
        label: "Está preparado para 10 a 15 anos de responsabilidade?",
        type: "text",
      },
      {
        field: "disposto_adaptacao",
        label:
          "A adaptação pode levar 1 semana a 1 mês. Está disposto a aguardar?",
        type: "text",
      },
      {
        field: "clinica_veterinario",
        label:
          "Clínica e veterinário (nome do estabelecimento, endereço e responsável)",
        type: "textarea",
      },
      {
        field: "reacao_doenca",
        label:
          "Se diagnosticado com Calazar/Cinomose/Parvovirose/Erliquiose, o que faria?",
        type: "textarea",
      },
      {
        field: "conhece_doencas",
        label:
          "Conhece essas doenças? Sabe formas de precaução e tratamento?",
        type: "textarea",
      },
      {
        field: "frequencia_remedio_verme",
        label: "Frequência do remédio de verme/carrapato/pulga",
        type: "radio",
        options: [
          "Nunca tomaram",
          "Uma vez por ano",
          "A cada 6 meses",
          "A cada 3 meses",
          "Raramente",
          "Só quando necessário",
        ],
        fullWidth: true,
      },
      {
        field: "frequencia_veterinario",
        label: "Frequência de visitas ao veterinário",
        type: "radio",
        options: [
          "Nunca foram",
          "Uma vez por ano",
          "A cada 6 meses",
          "A cada 3 meses",
          "Raramente",
          "Só quando necessário",
        ],
        fullWidth: true,
      },
    ],
  },
];

const Questionnaire = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");
  const petName = searchParams.get("petName");

  const initialFormData = useMemo(() => {
    const base = {};
    sections.forEach((section) => {
      section.items.forEach((item) => {
        base[item.field] = item.type === "checkbox" ? [] : "";
      });
    });
    return base;
  }, []);

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxArray = (field, option) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(option);
      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Integração com backend será adicionada na próxima etapa.
    console.log("Formulário de adoção (pré-envio):", { petId, ...formData });
  };

  const renderField = (item) => {
    if (item.type === "text") {
      return (
        <input
          type="text"
          name={item.field}
          value={formData[item.field]}
          onChange={handleChange}
          required={item.required}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      );
    }

    if (item.type === "textarea") {
      return (
        <textarea
          name={item.field}
          value={formData[item.field]}
          onChange={handleChange}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      );
    }

    if (item.type === "radio") {
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {item.options.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                formData[item.field] === option
                  ? "border-sky-500 bg-sky-50 text-sky-800"
                  : "border-gray-200 bg-white hover:border-sky-300"
              }`}
            >
              <input
                type="radio"
                name={item.field}
                value={option}
                checked={formData[item.field] === option}
                onChange={handleChange}
                className="text-sky-600"
              />
              <span className="text-sm font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    if (item.type === "checkbox") {
      return (
        <div className="flex flex-wrap gap-2">
          {item.options.map((option) => (
            <label
              key={option}
              className={`px-3 py-2 rounded-full border text-sm cursor-pointer transition ${
                formData[item.field]?.includes(option)
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-sky-400"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData[item.field]?.includes(option)}
                onChange={() => handleCheckboxArray(item.field, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  const accentBorder = (accent) => {
    const map = {
      sky: "border-sky-100",
      yellow: "border-yellow-100",
      green: "border-green-100",
      purple: "border-purple-100",
      orange: "border-orange-100",
      red: "border-red-100",
    };
    return map[accent] || "border-gray-100";
  };

  const accentPill = (accent) => {
    const map = {
      sky: "text-sky-600",
      yellow: "text-yellow-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
    };
    return map[accent] || "text-gray-600";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl shadow-2xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="uppercase text-sm tracking-widest font-semibold opacity-80">
                Formulário de Adoção
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
                Quer adotar? Preencha com atenção
              </h1>
              <p className="mt-3 text-sm md:text-base text-sky-100">
                As informações ajudam a garantir uma adoção responsável e o
                bem-estar do animal.
              </p>
              {petName && (
                <p className="mt-2 text-sm font-semibold text-yellow-200">
                  Pet de interesse: {petName} (ID: {petId})
                </p>
              )}
            </div>
            <div className="bg-white/15 backdrop-blur-lg px-4 py-3 rounded-xl border border-white/30 text-sm max-w-sm">
              <p className="font-semibold">Importante</p>
              <p className="text-sky-50">
                O envio ainda não grava no sistema. Integraremos ao backend na
                próxima etapa.
              </p>
            </div>
          </div>
        </div>

        {submitted && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800 shadow">
            Dados prontos! Integração com o backend será adicionada em seguida.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
          aria-label="Formulário de adoção"
        >
          {sections.map((section) => (
            <section
              key={section.id}
              className={`bg-white rounded-2xl shadow-lg border ${accentBorder(
                section.accent
              )} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs font-semibold ${accentPill(section.accent)}`}>
                    Seção
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.field}
                    className={item.fullWidth ? "md:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                    </label>
                    {renderField(item)}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 justify-end pb-8">
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:shadow-md transition"
            >
              Limpar respostas
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:from-sky-600 hover:to-sky-700 transition"
            >
              Salvar respostas (frontend)
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;