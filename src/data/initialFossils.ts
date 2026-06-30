/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fossil, EraGeologica, TipoFossil } from "../types";

export const initialFossils: Fossil[] = [
  {
    id: "megalodonte",
    name: "Dente de Megalodonte",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Megalodon_tooth_adult.jpg",
    era: EraGeologica.CENOZOICO,
    period: "Miocénico ao Pliocénico",
    type: TipoFossil.MINERALIZACAO,
    organism: "Tubarão pré-histórico gigante (Otodus megalodon)",
    age: "Cerca de 23 a 3.6 milhões de anos (M.a.)",
    environment: "Oceanos temperados e quentes de todo o mundo",
    location: "Arredores de Lisboa, bacia sedimentar do Tejo e falésias da Adiça",
    description: "O Megalodonte foi o maior tubarão que alguma vez habitou os oceanos da Terra, atingindo comprimentos estimados de até 15 a 18 metros. Como os tubarões têm um esqueleto cartilagíneo que raramente fossiliza, a esmagadora maioria dos registos fósseis deste predador consiste em dentes gigantes mineralizados de forma triangular, que podem ultrapassar os 15 centímetros de comprimento.",
    curiosities: [
      "O nome Megalodonte significa literalmente 'dente gigante'.",
      "Um único indivíduo podia ter até 276 dentes distribuídos por 5 fileiras nas suas mandíbulas avassaladoras.",
      "A sua força de mordida era estimada como 10 vezes superior à do grande tubarão-branco atual!"
    ],
    importance: "A distribuição destes dentes permite estudar as antigas cadeias alimentares marinas (paleoecologia) do Cenozoico e as alterações climáticas que levaram ao seu desaparecimento com o arrefecimento global.",
    glossary: [
      { term: "Mineralização", definition: "Processo de fossilização em que os tecidos porosos (como ossos ou dentes) são preenchidos ou substituídos por minerais transportados pela água subterrânea." },
      { term: "Cartilagíneo", definition: "Composto por cartilagem, um tecido elástico mas resistente, menos duro que o osso e que se decompõe muito rapidamente sem fossilizar." },
      { term: "Paleoecologia", definition: "Ramo da paleontologia que estuda a relação entre os organismos fósseis e os ambientes em que estes viviam." }
    ],
    quiz: [
      {
        id: "meg_q1",
        type: "multiple",
        questionText: "Por que razão quase só encontramos dentes como fósseis de Megalodonte?",
        options: [
          "Porque os dinossauros comiam o resto do corpo.",
          "Porque o esqueleto de cartilagem decompunha-se antes de fossilizar, enquanto os dentes eram duros e mineralizavam.",
          "Porque os megalodontes perdiam os dentes e nasciam de novo na rocha.",
          "Porque os dentes eram feitos de metal inoxidável."
        ],
        correctAnswer: "Porque o esqueleto de cartilagem decompunha-se antes de fossilizar, enquanto os dentes eram duros e mineralizavam.",
        explanation: "Os dentes contêm esmalte e fosfato de cálcio muito resistentes, ao passo que o esqueleto dos tubarões é cartilagíneo, o que dificulta extremamente a sua preservação."
      },
      {
        id: "meg_q2",
        type: "boolean",
        questionText: "O Megalodonte viveu ao mesmo tempo que as trilobites.",
        correctAnswer: "False",
        explanation: "Não. As trilobites extinguiram-se há 252 M.a., enquanto o Megalodonte viveu muito depois, na Era Cenozoica (entre 23 e 3.6 M.a.)."
      },
      {
        id: "meg_q3",
        type: "multiple",
        questionText: "O que significa o termo científico 'Megalodonte'?",
        options: [
          "Tubarão das profundezas",
          "Caçador de baleias",
          "Dente gigante",
          "Peixe pré-histórico"
        ],
        correctAnswer: "Dente gigante",
        explanation: "Provém do grego antigo 'megas' (grande) e 'odont' (dente), referindo-se ao aspeto impressionante dos seus fósseis."
      }
    ]
  },
  {
    id: "pegada_dino",
    name: "Pegada de Dinossauro",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Theropod_dinosaur_footprint.JPG",
    era: EraGeologica.MESOZOICO,
    period: "Jurássico",
    type: TipoFossil.VESTIGIO,
    organism: "Dinossauros Saurópodes e Terópodes",
    age: "Cerca de 175 a 145 milhões de anos (M.a.)",
    environment: "Zonas lagunares, pântanos ou margens de lagos lamacentos",
    location: "Serra de Aire (Pedreira do Galinha), Cabo Espichel e Lourinhã",
    description: "As pegadas de dinossauro são icnofósseis (fósseis de atividade ou vestígio). Elas registam a passagem, o comportamento, a velocidade e o peso destes répteis gigantescos nas margens de antigas lagoas tropicais. Ao longo do tempo, a lama mole onde pisaram secou, foi coberta por novas camadas de sedimentos e transformou-se em rocha (calcário), preservando os trilhos de pegadas até hoje.",
    curiosities: [
      "O Monumento Natural das Pegadas de Dinossauro da Serra de Aire contém o trilho de pegadas de saurópodes mais longo do mundo, com 147 metros de comprimento!",
      "Através da distância entre as pegadas e do seu tamanho, os cientistas conseguem calcular a velocidade a que o dinossauro caminhava ou corria.",
      "As pegadas com três dedos pontiagudos pertenciam geralmente a carnívoros (terópodes), enquanto as pegadas arredondadas eram de herbívoros gigantes (saurópodes)."
    ],
    importance: "São fundamentais como fósseis de fácies, pois indicam com precisão o ambiente antigo (paleoambiente): zonas costeiras lodosas e clima tropical húmido do período Jurássico.",
    glossary: [
      { term: "Icnofóssil", definition: "Fóssil que regista indícios da atividade de um organismo, como pegadas, pistas de locomoção, túneis de habitação ou fezes (coprólitos)." },
      { term: "Fóssil de fácies", definition: "Fóssil que permite identificar as condições do ambiente em que a rocha se formou (paleoambiente), pois o organismo dependia fortemente desse meio para viver." },
      { term: "Saurópodes", definition: "Dinossauros herbívoros de grande porte, pescoço e cauda longos, que se deslocavam sobre quatro patas pesadas." }
    ],
    quiz: [
      {
        id: "dino_q1",
        type: "multiple",
        questionText: "A que categoria de fósseis pertencem as pegadas petrificadas?",
        options: [
          "Fósseis corporais",
          "Mofos ou resinas",
          "Icnofósseis (fósseis de vestígio/atividade)",
          "Moldes internos"
        ],
        correctAnswer: "Icnofósseis (fósseis de vestígio/atividade)",
        explanation: "Os icnofósseis não contêm partes físicas do corpo do ser vivo, mas sim marcas da sua atividade biológica, comportamento ou presença."
      },
      {
        id: "dino_q2",
        type: "boolean",
        questionText: "As pegadas arredondadas e largas pertencem geralmente a dinossauros carnívoros ágeis.",
        correctAnswer: "False",
        explanation: "Falso. As pegadas arredondadas pertencem aos pesados dinossauros herbívoros saurópodes. Os carnívoros terópodes deixavam marcas com três dedos e garras pontiagudas."
      },
      {
        id: "dino_q3",
        type: "multiple",
        questionText: "Que tipo de informação um 'fóssil de fácies' como uma pegada nos fornece principalmente?",
        options: [
          "A idade exata da Terra",
          "A cor da pele do dinossauro",
          "O ambiente e as condições climáticas antigas (paleoambiente)",
          "O tipo de alimentos digeridos pelo animal"
        ],
        correctAnswer: "O ambiente e as condições climáticas antigas (paleoambiente)",
        explanation: "Os fósseis de fácies são excelentes indicadores ecológicos e ambientais, mostrando que aquela rocha se formou numa planície lamacenta costeira ou lagoa."
      }
    ]
  },
  {
    id: "folha_fossil",
    name: "Folha Fossilizada",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fossil_fern_leaf.jpg",
    era: EraGeologica.CENOZOICO,
    period: "Paleogénico ao Neogénico",
    type: TipoFossil.IMPRESSAO,
    organism: "Plantas vasculares decíduas e fetos",
    age: "Cerca de 20 milhões de anos (M.a.)",
    environment: "Florestas continentais húmidas ou margens de rios",
    location: "Depósitos carboníferos e sedimentares do Centro de Portugal (e.g., Mortágua)",
    description: "As folhas fossilizadas preservam-se geralmente sob a forma de impressões ou películas finas de carbono (carbonização). Quando as folhas caíam em lagos ou pântanos calmos, eram rapidamente cobertas por argila fina. Sob alta pressão e sem oxigénio, a matéria orgânica sofria uma destilação química, deixando uma marca bidimensional escura que revela os contornos e as nervuras das folhas detalhadamente.",
    curiosities: [
      "As impressões são tão perfeitas que, por vezes, os paleobotânicos conseguem estudar as células da epiderme da folha ao microscópio!",
      "As folhas dão pistas fantásticas sobre o clima do passado: folhas grandes e com pontas gotejantes indicam climas tropicais super húmidos.",
      "Algumas destas folhas pertencem a géneros botânicos que ainda existem hoje, chamados 'fósseis vivos'."
    ],
    importance: "São cruciais para a reconstituição da flora terrestre do passado (paleoflora) e ajudam a determinar flutuações de temperatura e humidade ao longo das eras geológicas.",
    glossary: [
      { term: "Impressão", definition: "Fóssil bidimensional plano formado pela compressão de um corpo mole (como folhas ou asas de insetos) contra um sedimento muito fino." },
      { term: "Carbonização", definition: "Processo em que compostos de hidrogénio, oxigénio e azoto são eliminados de uma planta, restando apenas uma película preta de carbono estável." },
      { term: "Paleobotânica", definition: "Ramo da ciência que estuda os fósseis de plantas e algas antigas." }
    ],
    quiz: [
      {
        id: "folha_q1",
        type: "multiple",
        questionText: "Que processo químico explica a cor escura e a película das folhas fósseis?",
        options: [
          "Cristalização por sal",
          "Carbonização (destilação de compostos orgânicos, restando carbono)",
          "Âmbarização",
          "Fusão por magma vulcânico"
        ],
        correctAnswer: "Carbonização (destilação de compostos orgânicos, restando carbono)",
        explanation: "A carbonização elimina gases voláteis de plantas enterradas e deixa um resíduo rico em carbono que desenha a silhueta da folha na rocha."
      },
      {
        id: "folha_q2",
        type: "boolean",
        questionText: "As folhas fósseis ajudam a reconstruir os climas antigos (paleoclimas).",
        correctAnswer: "True",
        explanation: "Verdadeiro. O formato das folhas (presença de espinhos, tamanho, recortes) correlaciona-se diretamente com a temperatura e a pluviosidade médias do antigo ambiente."
      },
      {
        id: "folha_q3",
        type: "multiple",
        questionText: "Quem estuda cientificamente os fósseis vegetais?",
        options: [
          "Paleontólogo de dinossauros",
          "Paleobotânico",
          "Arqueólogo",
          "Mineralogista"
        ],
        correctAnswer: "Paleobotânico",
        explanation: "A paleobotânica é a especialidade científica dentro da paleontologia dedicada à evolução, diversidade e ecologia do reino vegetal fossilizado."
      }
    ]
  },
  {
    id: "inseto_ambar",
    name: "Âmbar com Inseto",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Amber_with_insect.jpg",
    era: EraGeologica.MESOZOICO,
    period: "Cretácico",
    type: TipoFossil.AMBAR,
    organism: "Mosquito ou formiga pré-histórica presa em resina de pinheiro",
    age: "Cerca de 100 milhões de anos (M.a.)",
    environment: "Florestas densas de resinosas tropicais",
    location: "Oeste de Portugal (região de Cantanhede e Figueira da Foz)",
    description: "O âmbar é uma resina fóssil produzida por árvores antigas (principalmente coníferas) como mecanismo de defesa contra pragas. Quando um inseto pousava na árvore, podia ficar preso na resina fresca e viscosa. Com o tempo, mais resina cobria o organismo. Esta resina endureceu e fossilizou através da polimerização, selando e preservando perfeitamente os tecidos moles do inseto de forma tridimensional, livre de bactérias e oxigénio.",
    curiosities: [
      "O âmbar preserva detalhes anatómicos tão perfeitos que é possível ver até os minúsculos pelos nas pernas dos insetos e as suas asas transparentes.",
      "A eletricidade estática foi descoberta ao esfregar o âmbar (chamado 'elektron' em grego antigo, origem da palavra 'eletricidade').",
      "Embora o filme Jurassic Park popularizasse a extração de ADN de dinossauros a partir de mosquitos em âmbar, na realidade o ADN degrada-se ao fim de poucos milhões de anos, impossibilitando a clonagem."
    ],
    importance: "Oferece um vislumbre incomparável da biodiversidade de pequenos insetos e artrópodes terrestres que raramente fossilizavam nas rochas tradicionais devido à fragilidade dos seus corpos.",
    glossary: [
      { term: "Resina", definition: "Substância líquida e pegajosa segregada por plantas para selar feridas e proteger a madeira contra insetos e fungos." },
      { term: "Polimerização", definition: "Reação química em que pequenas moléculas se unem para formar longas cadeias, transformando a resina líquida em âmbar sólido." },
      { term: "Preservação Total", definition: "Tipo raro de fossilização onde o organismo original é preservado quase intacto, sem sofrer grandes alterações químicas na sua matéria original." }
    ],
    quiz: [
      {
        id: "ambar_q1",
        type: "multiple",
        questionText: "O que é, na sua origem biológica, o âmbar?",
        options: [
          "Uma rocha vulcânica vítrea",
          "Seiva mineralizada da raiz de plantas aquáticas",
          "Resina fóssil e pegajosa produzida por coníferas antigas",
          "Sal gema evaporado do fundo do oceano"
        ],
        correctAnswer: "Resina fóssil e pegajosa produzida por coníferas antigas",
        explanation: "O âmbar provém da resina pegajosa que as árvores gotejavam para se protegerem. Não se deve confundir resina (defesa exterior) com seiva (nutrição interna)."
      },
      {
        id: "ambar_q2",
        type: "boolean",
        questionText: "Os cientistas já conseguiram clonar dinossauros reais a partir de ADN intacto encontrado em mosquitos conservados em âmbar.",
        correctAnswer: "False",
        explanation: "Falso! O ADN é uma molécula frágil que se decompõe completamente num período muito inferior a 100 milhões de anos. Não é possível extrair ADN viável de fósseis tão antigos."
      },
      {
        id: "ambar_q3",
        type: "multiple",
        questionText: "Que tipo de preservação o âmbar proporciona aos pequenos insetos?",
        options: [
          "Preservação bidimensional escura",
          "Preservação tridimensional quase intacta de tecidos moles e rígidos",
          "Transformação completa em ouro e prata marinhos",
          "Apenas uma pegada da pata do inseto"
        ],
        correctAnswer: "Preservação tridimensional quase intacta de tecidos moles e rígidos",
        explanation: "O âmbar veda hermeticamente o inseto, impedindo a oxigenação e a entrada de bactérias decompõedoras, o que conserva o animal com detalhe tridimensional incrível."
      }
    ]
  }
];
