
const subcategoryFields = {
    "Hemograma Completo": ["Hemoglobina", "Hematócrito", "Contagem de glóbulos vermelhos", "Contagem de leucócitos", "Contagem de plaquetas", "Índices hematimétricos (VCM, HCM, CHCM)"],
    "Coagulação": ["Fatores de coagulação", "Tempo de coagulação"],
    "Velocidade de Hemossedimentação (VHS)": ["Indica inflamações ou infecções"],
    "Contagem de Plaquetas": ["Quantidade de plaquetas no sangue"],
    "Contagem de Leucócitos": ["Quantidade de glóbulos brancos no sangue"],
    "Contagem de Reticulócitos": ["Produção de glóbulos vermelhos na medula óssea"],
    "Hemoglobina Glicada (HbA1c)": ["Mede os níveis médios de glicose no sangue nos últimos meses"],
    "Tempo de Protrombina (TP)": ["Tempo que o sangue leva para coagular"],
    "Tempo de Tromboplastina Parcial (TTP)": ["Avalia possíveis distúrbios de coagulação"],
    "Dímero-D": ["Indicador de coagulação excessiva e tromboses"],
    "Ultrassonografia Abdominal": ["Avaliação de órgãos abdominais como fígado, rins, pâncreas"],
    "Ultrassonografia Pélvica": ["Avaliação de órgãos pélvicos como útero, ovários, próstata"],
    "Ultrassonografia Obstétrica": ["Monitoramento do desenvolvimento fetal"],
    "Ultrassonografia de Mama": ["Detecção de nódulos ou anomalias mamárias"],
    "Ultrassonografia de Tireoide": ["Avaliação da glândula tireoide"],
    "Ultrassonografia Doppler": ["Avaliação do fluxo sanguíneo em vasos"],
    "Ultrassonografia Transvaginal": ["Avaliação detalhada de órgãos pélvicos femininos"],
    "Ultrassonografia de Próstata": ["Avaliação da próstata"],
    "Ultrassonografia de Articulações": ["Avaliação de articulações e tecidos circundantes"],
    "Ultrassonografia Renal": ["Avaliação dos rins e vias urinárias"],
    "Raio-X Torácico": ["Avaliação de pulmões e coração"],
    "Raio-X Ósseo": ["Avaliação de fraturas ou deformidades ósseas"],
    "Raio-X de Abdômen": ["Avaliação de órgãos abdominais"],
    "Raio-X de Coluna": ["Avaliação da coluna vertebral"],
    "Raio-X de Crânio": ["Avaliação de estruturas cranianas"],
    "Raio-X Dentário": ["Avaliação de dentes e mandíbula"],
    "Raio-X de Articulações": ["Avaliação de articulações"],
    "Raio-X de Tórax": ["Avaliação de pulmões e coração"],
    "Raio-X de Sinuses": ["Avaliação de seios paranasais"],
    "Raio-X de Mãos e Pés": ["Avaliação de estruturas ósseas e articulações"],
    "Tomografia Computadorizada (TC)": ["Imagens detalhadas de estruturas internas"],
    "Tomografia por Emissão de Pósitrons (PET)": ["Avaliação de atividade metabólica"],
    "Tomografia de Crânio": ["Avaliação de estruturas cranianas"],
    "Tomografia de Tórax": ["Avaliação de pulmões e mediastino"],
    "Tomografia de Abdômen": ["Avaliação de órgãos abdominais"],
    "Tomografia de Coluna": ["Avaliação da coluna vertebral"],
    "Tomografia de Articulações": ["Avaliação de articulações"],
    "Tomografia de Coração": ["Avaliação de estruturas cardíacas"],
    "Tomografia de Pulmão": ["Avaliação de pulmões"],
    "Tomografia de Pelve": ["Avaliação de órgãos pélvicos"],
    "Eletrocardiograma de Repouso": ["Avaliação da atividade elétrica do coração em repouso"],
    "Eletrocardiograma de Esforço": ["Avaliação da atividade elétrica do coração durante esforço"],
    "Holter 24h": ["Monitoramento contínuo da atividade cardíaca por 24 horas"],
    "Monitoramento Cardíaco Contínuo": ["Monitoramento prolongado da atividade cardíaca"],
    "Teste de Inclinação (Tilt Test)": ["Avaliação de síncope e tonturas"],
    "Mapa (Monitorização Ambulatorial da Pressão Arterial)": ["Monitoramento da pressão arterial por 24 horas"],
    "Teste Ergométrico": ["Avaliação da resposta cardiovascular ao esforço"],
    "Eletrocardiograma com Vetorcardiograma": ["Avaliação detalhada da atividade elétrica do coração"],
    "Ressonância Magnética de Crânio": ["Avaliação detalhada do cérebro e estruturas cranianas"],
    "Ressonância Magnética de Coluna": ["Avaliação da coluna vertebral e medula espinhal"],
    "Ressonância Magnética de Articulações": ["Avaliação de articulações e tecidos circundantes"],
    "Ressonância Magnética de Abdômen": ["Avaliação de órgãos abdominais"],
    "Ressonância Magnética Cardíaca": ["Avaliação de estruturas e função cardíaca"],
    "Ressonância Magnética Funcional": ["Avaliação da atividade cerebral"],
    "Ressonância Magnética de Mama": ["Avaliação de tecido mamário"],
    "Ressonância Magnética de Próstata": ["Avaliação da próstata"],
    "Ressonância Magnética de Fígado": ["Avaliação do fígado"],
    "Ressonância Magnética de Pelve": ["Avaliação de órgãos pélvicos"],
    "Endoscopia Digestiva Alta": ["Avaliação do esôfago, estômago e duodeno"],
    "Colonoscopia": ["Avaliação do cólon e reto"],
    "Broncoscopia": ["Avaliação das vias aéreas e pulmões"],
    "Cistoscopia": ["Avaliação da bexiga e uretra"],
    "Histeroscopia": ["Avaliação do útero"],
    "Artroscopia": ["Avaliação de articulações"],
    "Laringoscopia": ["Avaliação da laringe"],
    "Retossigmoidoscopia": ["Avaliação do reto e sigmoide"],
    "Enteroscopia": ["Avaliação do intestino delgado"],
    "Colangiopancreatografia Retrógrada Endoscópica (CPRE)": ["Avaliação de vias biliares e pancreáticas"],
    "Glicemia": ["Níveis de glicose no sangue"],
    "Colesterol Total": ["Níveis de colesterol total"],
    "Triglicerídeos": ["Níveis de triglicerídeos"],
    "TGO/AST": ["Enzima hepática"],
    "TGP/ALT": ["Enzima hepática"],
    "TSH e T4 Livre": ["Função tireoidiana"],
    "Ácido Úrico": ["Níveis de ácido úrico"],
    "Creatinina": ["Função renal"],
    "Ureia": ["Função renal"],
    "Eletrólitos (Sódio, Potássio, Cálcio)": ["Equilíbrio eletrolítico"],
    "Ferritina": ["Reservas de ferro"],
    "Transferrina": ["Transporte de ferro"],
    "Vitamina D": ["Níveis de vitamina D"],
    "Vitamina B12": ["Níveis de vitamina B12"],
    "Ácido Fólico": ["Níveis de ácido fólico"],
    "Proteína C Reativa (PCR)": ["Indicador de inflamação"],
    "Fator Reumatoide": ["Indicador de doenças reumáticas"],
    "Anticorpos Antinucleares (FAN)": ["Indicador de doenças autoimunes"],
    "Sorologia para HIV": ["Detecção de infecção por HIV"],
    "Sorologia para Hepatites": ["Detecção de infecções por hepatite"],
    "Urina Tipo I (EAS)": ["Análise física, química e microscópica da urina"],
    "Urina de 24 Horas": ["Avaliação de proteínas, eletrólitos e outros componentes"],
    "Cultura de Urina": ["Detecção de infecções urinárias"],
    "Urocultura": ["Identificação de bactérias na urina"],
    "Teste de Gravidez na Urina": ["Detecção de gravidez"],
    "Proteinúria de 24 Horas": ["Quantificação de proteínas na urina"],
    "Eletrólitos na Urina": ["Avaliação do equilíbrio eletrolítico"],
    "Clearance de Creatinina": ["Avaliação da função renal"],
    "Pesquisa de Células Neoplásicas na Urina": ["Detecção de células cancerígenas"],
    "Parasitológico de Fezes": ["Detecção de parasitas intestinais"],
    "Sangue Oculto nas Fezes": ["Detecção de sangramento gastrointestinal"],
    "Cultura de Fezes": ["Identificação de bactérias patogênicas"],
    "Teste de Gordura nas Fezes": ["Avaliação da absorção de gordura"],
    "Pesquisa de Rotavírus": ["Detecção de infecção por rotavírus"],
    "Pesquisa de Helicobacter pylori": ["Detecção de infecção por H. pylori"],
    "Cariótipo": ["Análise de cromossomos"],
    "Teste de DNA": ["Análise de material genético"],
    "Sequenciamento Genômico": ["Análise completa do genoma"],
    "Teste de Paternidade": ["Determinação de paternidade"],
    "Teste de Predisposição Genética": ["Avaliação de risco para doenças genéticas"],
    "Teste de Portador Genético": ["Detecção de genes associados a doenças hereditárias"],
    "Teste de Diagnóstico Pré-Implantacional": ["Análise genética de embriões"],
    "Teste de Microarray Cromossômico": ["Detecção de alterações cromossômicas"],
    "Teste de Mutação BRCA": ["Detecção de mutações no gene BRCA"],
    "Teste de Síndrome de Down": ["Detecção de trissomia do cromossomo 21"],
    "Cortisol": ["Níveis de cortisol"],
    "Prolactina": ["Níveis de prolactina"],
    "Testosterona": ["Níveis de testosterona"],
    "Estradiol": ["Níveis de estradiol"],
    "Progesterona": ["Níveis de progesterona"],
    "Hormônio do Crescimento (GH)": ["Níveis de hormônio do crescimento"],
    "LH (Hormônio Luteinizante)": ["Níveis de LH"],
    "FSH (Hormônio Folículo-Estimulante)": ["Níveis de FSH"],
    "T3 e T4 Livre": ["Função tireoidiana"],
    "Insulina": ["Níveis de insulina"],
    "Glucagon": ["Níveis de glucagon"],
    "Paratormônio (PTH)": ["Níveis de PTH"],
    "Calcitonina": ["Níveis de calcitonina"],
    "Mamografia": ["Avaliação de tecido mamário"],
    "Densitometria Óssea": ["Avaliação da densidade óssea"],
    "Cintilografia": ["Imagens funcionais de órgãos"],
    "Angiografia": ["Avaliação de vasos sanguíneos"],
    "Mielografia": ["Avaliação da medula espinhal"],
    "Linfocintilografia": ["Avaliação do sistema linfático"],
    "Cintilografia Miocárdica": ["Avaliação do músculo cardíaco"],
    "Cintilografia Renal": ["Avaliação da função renal"],
    "Cintilografia Óssea": ["Avaliação de ossos"],
    "Cintilografia da Tireoide": ["Avaliação da glândula tireoide"],
    "Cultura de Secreções": ["Identificação de microrganismos em secreções"],
    "Antibiograma": ["Teste de sensibilidade a antibióticos"],
    "Teste de Sensibilidade": ["Avaliação da resposta a antimicrobianos"],
    "Teste de Tuberculose (PPD)": ["Detecção de infecção por tuberculose"],
    "Teste de Fungos": ["Identificação de fungos"],
    "Pesquisa de Bactérias": ["Identificação de bactérias"],
    "Pesquisa de Vírus": ["Identificação de vírus"],
    "Pesquisa de Parasitas": ["Identificação de parasitas"],
    "Teste de Ziehl-Neelsen": ["Detecção de micobactérias"],
    "Teste de Gram": ["Classificação de bactérias"],
    "Eletroencefalograma (EEG)": ["Avaliação da atividade elétrica cerebral"],
    "Eletromiografia (EMG)": ["Avaliação da atividade muscular"],
    "Potenciais Evocados": ["Avaliação de vias nervosas"],
    "Punção Lombar": ["Coleta de líquido cefalorraquidiano"],
    "Teste de Condução Nervosa": ["Avaliação da função nervosa"],
    "Tomografia por Emissão de Fóton Único (SPECT)": ["Imagens funcionais do cérebro"],
    "Teste de Líquido Cefalorraquidiano (LCR)": ["Análise do líquido cefalorraquidiano"],
    "Teste de Função Autonômica": ["Avaliação do sistema nervoso autônomo"],
    "Teste de Reflexos": ["Avaliação de reflexos neurológicos"],
    "Teste de Marcha": ["Avaliação da marcha e equilíbrio"],
    "PSA (Antígeno Prostático Específico)": ["Marcador de câncer de próstata"],
    "CA-125 (Marcador de Câncer de Ovário)": ["Marcador de câncer de ovário"],
    "CEA (Antígeno Carcinoembrionário)": ["Marcador de câncer colorretal"],
    "Biomarcadores Tumorais": ["Indicadores de câncer"],
    "Biópsia de Tecidos": ["Análise de tecidos para detecção de câncer"],
    "Imunohistoquímica": ["Identificação de proteínas em tecidos"],
    "Citometria de Fluxo": ["Análise de células"],
    "Teste de Mutação Genética": ["Detecção de mutações associadas ao câncer"],
    "Teste de Microsatélites": ["Avaliação de instabilidade genética"],
    "Teste de Expressão Gênica": ["Análise de expressão de genes"],
    "Amniocentese": ["Análise do líquido amniótico"],
    "Teste de Coombs Indireto": ["Detecção de anticorpos contra o feto"],
    "Teste de Translucência Nucal": ["Avaliação de risco para síndromes genéticas"],
    "NIPT (Teste Pré-Natal Não Invasivo)": ["Detecção de anomalias cromossômicas"],
    "Perfil Bioquímico Fetal": ["Avaliação de marcadores bioquímicos"],
    "Teste de Triagem Combinada": ["Avaliação de risco para síndromes genéticas"],
    "Teste de Quadruplo Marcador": ["Avaliação de risco para síndromes genéticas"],
    "Teste de Vilosidades Coriônicas": ["Análise genética fetal"],
    "Teste de Cordocentese": ["Análise de sangue fetal"],
    "Biópsia de Pele": ["Análise de tecido cutâneo"],
    "Teste de Contato": ["Detecção de alergias de contato"],
    "Exame de Fungos na Pele": ["Identificação de infecções fúngicas"],
    "Dermatoscopia": ["Avaliação de lesões cutâneas"],
    "Teste de Alergia Cutânea": ["Detecção de alergias"],
    "Teste de PATCH": ["Detecção de alergias de contato"],
    "Teste de Fotossensibilidade": ["Avaliação de reações à luz"],
    "Teste de Acantose Nigricans": ["Avaliação de lesões cutâneas"],
    "Teste de Índice de Severidade de Psoríase": ["Avaliação da gravidade da psoríase"],
    "Teste de Melanoma": ["Detecção de melanoma"],
    "Espirometria": ["Avaliação da função pulmonar"],
    "Pletismografia": ["Avaliação de volumes pulmonares"],
    "Teste de Difusão de CO": ["Avaliação da capacidade de difusão pulmonar"],
    "Gasometria Arterial": ["Avaliação de oxigênio e dióxido de carbono no sangue"],
    "Oximetria de Pulso": ["Medição de saturação de oxigênio"],
    "Teste de Broncoprovocação": ["Avaliação de hiperreatividade brônquica"],
    "Teste de Capacidade Pulmonar": ["Avaliação da capacidade pulmonar total"],
    "Teste de Volume Residual": ["Avaliação do volume de ar residual nos pulmões"],
    "Teste de Fluxo Expiratório": ["Avaliação do fluxo de ar expirado"],
    "Teste de Ventilação-Perfusão": ["Avaliação de fluxo sanguíneo e ventilação pulmonar"],
    "TSH": ["Função tireoidiana"],
    "T4 Livre": ["Função tireoidiana"],
    "T3 Total": ["Função tireoidiana"],
    "Anticorpos Anti-Tireoidianos": ["Detecção de doenças autoimunes da tireoide"],
    "Ultrassonografia da Tireoide": ["Avaliação da glândula tireoide"],
    "Teste de Captação de Iodo": ["Avaliação da função tireoidiana"],
    "Teste de Tireoglobulina": ["Marcador de câncer de tireoide"],
    "Teste de Calcitonina": ["Marcador de câncer medular de tireoide"],
    "Teste de Anticorpos Anti-TPO": ["Detecção de doenças autoimunes da tireoide"],
    "Ecocardiograma": ["Avaliação da estrutura e função cardíaca"],
    "Cateterismo Cardíaco": ["Avaliação de pressões e fluxo sanguíneo no coração"],
    "Angiografia Coronária": ["Avaliação de artérias coronárias"],
    "Teste de Esforço": ["Avaliação da resposta cardiovascular ao esforço"],
    "Monitoramento de Pressão Arterial (MAPA)": ["Monitoramento da pressão arterial por 24 horas"],
    "Monitoramento de ECG (Holter)": ["Monitoramento contínuo da atividade cardíaca"],
    "Tomografia de Artérias Coronárias": ["Avaliação de artérias coronárias"],
    "Teste Cutâneo de Alergia": ["Detecção de alergias"],
    "Teste de IgE Específica": ["Detecção de anticorpos IgE específicos"],
    "Teste de Prick": ["Detecção de alergias"],
    "Teste de Provocação Oral": ["Avaliação de alergias alimentares"],
    "Teste de Alergia Alimentar": ["Detecção de alergias alimentares"],
    "Teste de Alergia Respiratória": ["Detecção de alergias respiratórias"],
    "Teste de Alergia a Medicamentos": ["Detecção de alergias a medicamentos"],
    "Teste de Alergia a Insetos": ["Detecção de alergias a picadas de insetos"],
    "Teste de Alergia a Látex": ["Detecção de alergia ao látex"],
    "Teste de Sífilis (VDRL)": ["Detecção de infecção por sífilis"],
    "Teste de Dengue": ["Detecção de infecção por dengue"],
    "Teste de Zika Vírus": ["Detecção de infecção por Zika vírus"],
    "Teste de Chikungunya": ["Detecção de infecção por Chikungunya"],
    "Teste de COVID-19 (PCR e Sorologia)": ["Detecção de infecção por COVID-19"],
    "Teste de Mononucleose": ["Detecção de infecção por mononucleose"],
    "Teste de Toxoplasmose": ["Detecção de infecção por toxoplasmose"],
    "Anticorpos Anti-DNA": ["Indicador de lúpus eritematoso sistêmico"],
    "Anticorpos Anti-Sm": ["Indicador de lúpus eritematoso sistêmico"],
    "Anticorpos Anti-Ro/SSA": ["Indicador de síndrome de Sjögren"],
    "Anticorpos Anti-La/SSB": ["Indicador de síndrome de Sjögren"],
    "Anticorpos Antifosfolípides": ["Indicador de síndrome antifosfolípide"],
    "Anticorpos Anticitoplasma de Neutrófilos (ANCA)": ["Indicador de vasculites"],
    "Anticorpos Anti-Músculo Liso": ["Indicador de hepatite autoimune"]
};


function loadSubcategories() {
    var category = document.getElementById("category").value;
    var subcategorySelect = document.getElementById("subcategory");

    
    subcategorySelect.innerHTML = '<option value="" disabled selected>Selecione a subcategoria</option>';

    
    if (category && examSubcategories[category]) {
        examSubcategories[category].forEach(function(subcat) {
            var option = document.createElement("option");
            option.value = subcat;
            option.text = subcat;
            subcategorySelect.appendChild(option);
        });
    }
}


function showFields() {
    var subcategory = document.getElementById("subcategory").value;
    var fieldsContainer = document.getElementById("fields-container");

    
    fieldsContainer.innerHTML = "";

    
    if (subcategory && subcategoryFields[subcategory]) {
        subcategoryFields[subcategory].forEach(function(field, index) {
            var detailNumber = index + 1;  

            var label = document.createElement("label");
            label.textContent = field + ":";
            label.setAttribute("for", `detail_key_${detailNumber}`);

            var inputKey = document.createElement("input");
            inputKey.type = "text";
            inputKey.id = `detail_key_${detailNumber}`;
            inputKey.name = `detail_key_${detailNumber}`;
            inputKey.placeholder = "Chave";
            inputKey.value = field;  

            var inputValue = document.createElement("input");
            inputValue.id = `detail_value_${detailNumber}`;
            inputValue.name = `detail_value_${detailNumber}`;
            inputValue.placeholder = "Valor";

            fieldsContainer.appendChild(label);
            fieldsContainer.appendChild(inputKey);
            fieldsContainer.appendChild(inputValue);
            fieldsContainer.appendChild(document.createElement("br"));
        });
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function fetchPatientDetails(patientName) {
    fetch(`/get_patient_details?patient_name=${patientName}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('cpf').textContent = data.cpf;
                document.getElementById('phone').textContent = data.phone;
                document.getElementById('address').textContent = data.address;
            } else {
                document.getElementById('patient_details').style.display = 'none';
                alert('Paciente não encontrado. Por favor, cadastre o paciente primeiro.');
            }
        });
}

function loadSubcategories() {
    var category = document.getElementById("category").value;
    var subcategorySelect = document.getElementById("subcategory");
            
        subcategorySelect.innerHTML = '<option value="" disabled selected>Selecione a subcategoria</option>';
            
        if (category) {
            examSubcategories[category].forEach(function(subcat) {
            var option = document.createElement("option");
            option.value = subcat;
            option.text = subcat;
            subcategorySelect.appendChild(option);
        });
    }
}
   
function goBack() {
    window.history.back();
}
