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
      { field: "cpf", label: "CPF", type: "text", required: true, placeholder: "000.000.000-00" },
      { field: "endereco", label: "Rua e Bairro", type: "text", required: true, fullWidth: true },
      { field: "cidade", label: "Cidade", type: "text", required: true, placeholder: "Fortaleza-CE" },
      { field: "cep", label: "CEP", type: "text", required: true, placeholder: "12345-00" },
      { field: "celular_01", label: "Celular 01", type: "text", required: true, placeholder: "(00) 9 0000-0000" },
      { field: "celular_02", label: "Celular 02", type: "text", placeholder: "(00) 9 0000-0000" },
      { field: "dt_nacimento", label: "Data de Nascimento", required: true, type: "text", placeholder: "DD/MM/AAAA" },
      { field: "profissao", label: "Você trabalha no momento? Qual sua profissão/emprego?", required: true, type: "text" },
      { field: "redes_sociais", label: "Redes Sociais", type: "text", placeholder: "Informe seu perfil de rede social ou coloque o link" },
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
        required: true,
      },
      {
        field: "residencia_tipo",
        label: "Sua residência é",
        type: "radio",
        options: ["Alugada", "Própria", "De um parente"],
        required: true,
      },
      {
        field: "proprietarios_aceitam",
        label: "Se alugada os proprietários aceitam animais?",
        type: "text",
        fullWidth: true,
        placeholder: " ",
      },
      {
        field: "normas_condominio_animais",
        label:
          "Em caso de residir em condomínio, quais são as normas a respeito da criação de animais?",
        type: "text",
        fullWidth: true,
        placeholder: " ",
      },
      {
        field: "tipo_portao",
        label: "O portão da sua residência que dá acesso à rua, é:",
        type: "radio",
        options: [
          "Gradeado",
          "Parte gradeado, parte fechado",
          "Totalmente fechado",
          "Telado",
          "Não tem portão",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "residencia_possui",
        label: "Assinale as opções que sua residência possui:",
        type: "checkbox",
        options: [
          "Quintal",
          "Área",
          "Varanda",
          "Muro com mais de 2 metros",
          "Muro com 1 metro",
          "Cercada",
          "Tem as janelas teladas",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "area_tipo",
        label: "Em caso de haver quintal/área/varanda, elas são:",
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
        required: true,
      },
    ],
  },
  {
    id: "moradores",
    title: "Informações sobre os moradores da casa",
    accent: "green",
    items: [
      {
        field: "reside_com_quantas_pessoas",
        label:
          "Reside com quantas pessoas? Quem são?",
        type: "textarea",
        fullWidth: true,
        required: true,
        placeholder: " ",
      },
      {
        field: "cientes_adocao",
        label: "Estão de acordo com a adoção?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "responsavel_financeiro",
        label: "Quem será o responsável financeiro pelo animal?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "reacao_mordida_arranho",
        label:
          "Se o animal mordesse/arranhasse você/seu filho/outro membro da família, como seria a reação?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "possui_veiculo",
        label:
          "Possui veículo para o transporte do animal? Caso sim, qual? Caso não, como levará o animal para o veterinário?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "profissao_moradores",
        label: "As pessoas que moram com você trabalham? Qual a profissão delas?",
        type: "text",
        placeholder: " ",
      },
      {
        field: "alguem_alergico",
        label: "Algum morador da residência é alérgico?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "tem_criancas",
        label: "Tem crianças em casa? Caso tenha, qual a idade?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "alguem_dirige",
        label:
          "Alguém da casa dirige? Teria como levar o animalzinho imediatamente ao veterinário em caso de acidentes?",
        type: "text",
        required: true,
        placeholder: " ",
      },
    ],
  },
  {
    id: "animais",
    title: "Informações quanto aos outros animais da casa/animais que criou no passado",
    accent: "purple",
    items: [
      {
        field: "ja_teve_tem_animais",
        label: "Já teve/tem outros animais? Quantos, qual a espécie, e idade.",
        type: "textarea",
        fullWidth: true,
        required: true,
        placeholder: " ",
      },
      {
        field: "motivo_perda_animais",
        label: "O que houve com os seus antigos animais?",
        type: "checkbox",
        options: [
          "Faleceram de velhice",
          "Faleceram por conta de uma doença. Qual?:",
          "Se perderam/fugiram",
          "Morreu atropelado/envenenado",
          "Doei para alguém de confiança",
          "Doei para um estranho",
          "Vendi",
          "Ainda moram comigo",
        ],
        fullWidth: true,
      },
      {
        field: "vacinados_quais",
        label: "São/eram vacinados? Quais vacinas?",
        type: "textarea",
      },
      { field: "marca_racao", label: "Qual a marca da ração eles comem/comiam?", type: "text" },
      {
        field: "castrados_motivo",
        label: "Os seus animais são/eram castrados? Caso não, por quê?",
        type: "textarea",
      },
      {
        field: "teve_filhotes",
        label:
          "Seus animais já tiveram filhotes? Se sim, quantas vezes? O que você fez com os filhotes?",
        type: "textarea",
      },
    ],
  },
  {
    id: "cuidados",
    title: "Cuidados com o futuro animalzinho",
    accent: "orange",
    items: [
      {
        field: "passeios",
        label: "Em relação aos passeios:",
        type: "radio",
        options: [
          "Ele terá acesso livre à rua quando quiser sair",
          "Ensinarei ele a passear na rua sozinho e depois voltar para casa",
          "Só passeará na rua na minha presença, porém sem guia",
          "Só passeará na rua na minha presença, e somente com a guia",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "quantia_mensal",
        label: "Qual a quantia mensal que poderá dispor aos cuidados dos animais mensalmente?",
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
        required: true,
      },
      {
        field: "tempo_sozinho",
        label: "Quanto tempo o animal ficará sozinho?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "frequencia_passeios",
        label: "Conseguem passear com o animal quantas vezes ao dia/semana?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "devolveria_se_mudar",
        label:
          "Devolveria o animal caso precise mudar de casa ou de cidade? Como faria para se organizar nessa situação?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "destino_animal",
        label: "Para qual destino seria o animal?",
        type: "radio",
        options: ["Guarda", "Companhia", "Presente"],
        fullWidth: true,
        required: true,
      },
      {
        field: "comodo_dia",
        label: "Em qual cômodo da casa o animal ficará durante o dia:",
        type: "radio",
        options: [
          "Quintal/Área/Varanda",
          "Canil",
          "Amarrado",
          "Dentro de casa",
          "Dentro de casa com acesso ao quintal",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "local_dormir",
        label: "Onde o animalzinho irá dormir:",
        type: "radio",
        options: [
          "No chão do quintal/Área/Varanda",
          "Na casinha/caminha na parte externa da casa",
          "Na casinha/caminha na parte interna da casa",
          "No meu quarto/sala",
          "No canil",
          "Amarrado",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "tempo_preso",
        label:
          "O animal ficará amarrado/preso em algum lugar? Caso sim, por quais razões? Ele passaria quantas horas amarrado/preso?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "reacao_bagunca",
        label:
          "Caso o animal faça bagunça ou destrua algo de valor, qual será sua atitude diante de tal ato?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "providencia_crescimento",
        label: "Caso o animal cresça mais que o esperado, qual serão as providências:",
        type: "radio",
        options: [
          "Irá doar para alguém com espaço maior a oferecer",
          "Irá deixar ele somente no quintal",
          "Levar para algum sítio",
          "Devolver para a ONG",
          "Continuar com ele",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "responsavel_viagem",
        label: "Em caso de viagem, quem ficará com o animal?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "pretende_mudar_5_anos",
        label: "Pretende se mudar em um espaço de 5 anos? Caso sim, como ficará o animal?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "reacao_choro_latido",
        label: "O que fará se o animalzinho chorar/latir/uivar durante o dia e noite?",
        type: "textarea",
        required: true, 
        placeholder: " ",
      },
    ],
  },
  {
    id: "veterinario",
    title: "Cuidados veterinários que o animalzinho receberá",
    accent: "red",
    items: [
      {
        field: "vacinas_que_dara",
        label: "Quais vacinas irá dar ao animal adotado?",
        type: "textarea",
        required: true,
        placeholder: "Antirrábica, Gripe canina, etc",
      },
      {
        field: "marca_racao_adotado",
        label: "Qual a marca de ração pretende dar ao adotado?",
        type: "text",
        required: true,
        placeholder: "Wiskas, Pedigree, etc",
      },
      {
        field: "criterios_alimentacao",
        label: "Quais são os seus critérios ao escolher essa alimentação?",
        type: "textarea",
        placeholder: " ",
      },
      {
        field: "filhotes_ou_castrar",
        label: "Pretende por o animalzinho para ter filhotes ou irá castrar? O que pensa a respeito?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "preparado_responsabilidade",
        label: "O seu adotado pode viver de 10 a 15 anos. Já pensou sobre essa responsabilidade e está preparado?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "disposto_adaptacao",
        label:
          "A adaptação do animal pode levar de 1 semana a 1 mês, tanto com o ambiente como com os outros moradores da casa (contando outros animais também). Está disposto a esperar esse tempo com paciência?",
        type: "text",
        required: true,
        placeholder: " ",
      },
      {
        field: "clinica_veterinario",
        label:
          "Qual clínica e veterinário levará ou leva os seus animais? Por favor, coloque nome do estabelecimento, endereço e nome do veterinário responsável.",
        type: "textarea",
        required: true,
        placeholder: "Clínica ABC, rua xxx, nº 000, Dr(a) fulano",
      },
      {
        field: "reacao_doenca",
        label:
          "O que faria se o animalzinho fosse diagnosticado com as devidas doenças: Calazar/Cinomose/Parvovirose/Erliquiose:",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "conhece_doencas",
        label: "Conhece essas doenças citadas acima? Sabe as formas de precaução e tratamento?",
        type: "textarea",
        required: true,
        placeholder: " ",
      },
      {
        field: "frequencia_remedio_verme",
        label: "Seus animais, tomam/tomavam/tomará o remédio de verme/carrapato/pulga com qual frequência?",
        type: "radio",
        options: [
          "Nunca tomaram",
          "Uma vez por ano",
          "A cada 6 meses",
          "A cada 3 meses",
          "Raramente",
          "Só quando tem necessidade",
        ],
        fullWidth: true,
        required: true,
      },
      {
        field: "frequencia_veterinario",
        label: "Com qual frequência leva/levava/levará seus animais para o veterinário?",
        type: "radio",
        options: [
          "Nunca foram",
          "Uma vez por ano",
          "A cada 6 meses",
          "A cada 3 meses",
          "Raramente",
          "Só quando tem necessidade",
        ],
        fullWidth: true,
        required: true,
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
  const [showErrors, setShowErrors] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const totalSections = sections.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitted(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxArray = (field, option) => {
    setSubmitted(false);
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

  const isFieldMissing = (item) => {
    if (!item.required) return false;
    const value = formData[item.field];
    if (Array.isArray(value)) return value.length === 0;
    return !value || (typeof value === "string" && value.trim() === "");
  };

  const isSectionValid = (sectionIndex) => {
    const section = sections[sectionIndex];
    return section.items.every((item) => !isFieldMissing(item));
  };

  const goToNextSection = () => {
    setShowErrors(true);
    if (!isSectionValid(currentSectionIndex)) return;

    setShowErrors(false);
    setCurrentSectionIndex((prev) => Math.min(prev + 1, totalSections - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousSection = () => {
    setShowErrors(false);
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);

    const hasMissing = sections.some((_, index) => !isSectionValid(index));
    if (hasMissing) return;

    setSubmitted(true);
    setShowErrors(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Integracao com backend sera adicionada na proxima etapa.
    console.log("Formulário de adoção (pre-envio):", { petId, ...formData });
  };
  const renderField = (item) => {
    const showError = (showErrors || submitted) && isFieldMissing(item);

    if (item.type === "text") {
      return (
        <div className="space-y-1">
          <input
            type="text"
            name={item.field}
            value={formData[item.field]}
            onChange={handleChange}
            required={item.required}
            placeholder={item.placeholder || `Digite ${item.label.toLowerCase()}`}
            aria-required={item.required}
            aria-invalid={showError}
            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 ${
              showError
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-200"
            }`}
          />
          {showError && (
            <p className="text-xs text-red-600">Campo obrigatório.</p>
          )}
        </div>
      );
    }

    if (item.type === "textarea") {
      return (
        <div className="space-y-1">
          <textarea
            name={item.field}
            value={formData[item.field]}
            onChange={handleChange}
            rows={2}
            required={item.required}
            aria-required={item.required}
            aria-invalid={showError}
            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 ${
              showError
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-200"
            }`}
          />
          {showError && (
            <p className="text-xs text-red-600">Campo obrigatório.</p>
          )}
        </div>
      );
    }

    if (item.type === "radio") {
      return (
        <div className="space-y-1">
          <div
            className={`grid gap-2 sm:grid-cols-2 ${
              showError ? "ring-2 ring-red-200 rounded-lg" : ""
            }`}
          >
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
                  required={item.required}
                  aria-required={item.required}
                  aria-invalid={showError}
                  className="text-sky-600"
                />
                <span className="text-sm font-medium">{option}</span>
              </label>
            ))}
          </div>
          {showError && (
            <p className="text-xs text-red-600">Campo obrigatório.</p>
          )}
        </div>
      );
    }

    if (item.type === "checkbox") {
      return (
        <div className="space-y-1">
          <div
            className={`flex flex-wrap gap-2 ${
              showError ? "ring-2 ring-red-200 rounded-lg" : ""
            }`}
          >
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
          {showError && (
            <p className="text-xs text-red-600">Campo obrigatório.</p>
          )}
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

  const currentSection = sections[currentSectionIndex];

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
            </div>
          </div>
        </div>

        {submitted && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800 shadow">
            A ONG ABRACE agradece a sua atenção em responder o questionário e em breve, no máximo em 48 hs,  daremos o feedback!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
          aria-label="Formulário de adoção"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-sky-900">
                Etapa {currentSectionIndex + 1} de {totalSections}
              </p>
              <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-300"
                  style={{
                    width: `${((currentSectionIndex + 1) / totalSections) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <section
            key={currentSection.id}
            className={`bg-white rounded-2xl shadow-lg border ${accentBorder(
              currentSection.accent
            )} p-6 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentSection.title}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSection.items.map((item) => (
                <div
                  key={item.field}
                  className={item.fullWidth ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label}
                    {item.required && <span className="text-red-600 ml-1">*</span>}
                  </label>
                  {renderField(item)}
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 justify-between pb-8">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                  setSubmitted(false);
                  setShowErrors(false);
                  setCurrentSectionIndex(0);
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:shadow-md transition"
              >
                Limpar respostas
              </button>
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={currentSectionIndex === 0}
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              {currentSectionIndex < totalSections - 1 ? (
                <button
                  type="button"
                  onClick={goToNextSection}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:from-sky-600 hover:to-sky-700 transition"
                >
                  Avançar
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg hover:from-sky-600 hover:to-sky-700 transition"
                >
                  Salvar respostas
                </button>
              )}
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
