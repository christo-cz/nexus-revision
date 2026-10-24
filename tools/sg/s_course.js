/* =====================================================================
   COURSE CONTENT — Societal and Global Challenges (BBA1, S1).
   Written from the slides of sessions 1 to 6 and the session 7 tutorial, reworded.
   Each card: title, line (the idea in one line), points, formula, example, trap, exam.
   ===================================================================== */
const COURSE = [
{ id: "systems", n: 1, title: "Systems thinking and causal diagrams", short: "Systems thinking", c: "var(--c4)",
  intro: "Heatwaves as a complex challenge: many causes and consequences that act on each other. The tool of the course to see them: the causal diagram, with its feedback loops and unintended consequences.",
  sections: [
  { title: "The course and the exam", cards: [
    { id: "s-course", title: "What the course is for",
      line: "Understand the main environmental and social challenges, how they influence each other, and how the economy affects them and is affected by them.",
      points: ["Nine two-hour sessions (18 hours), one of them the \"2tonnes workshop\".", "Key concepts (sustainable development) and frameworks (Doughnut Economics) to see the challenges as a whole.", "Two tools a 21st-century manager needs: systems thinking, and critical analysis of sources and data."] },
    { id: "s-exam", title: "How you are graded",
      line: "Group work in class counts for 20%. An individual exam organized by the Hub counts for 80%.",
      points: ["The exam covers all the slides of sessions 1 to 8.", "You must be able to define the key concepts.", "You must understand the lessons drawn from the empirical research shown in class (figures, studies, reports).", "A causal diagram is very likely to be asked: practise drawing one in the Causal studio."],
      exam: "Learn each definition word for word in its logic (what it is, what it is not, one example). Most questions ask you to define, explain or apply a notion." }
  ] },
  { title: "Heatwaves: a complex challenge", cards: [
    { id: "s-heatterms", title: "Heat spike, heatwave, severe heatwave",
      line: "Météo-France distinguishes three \"heat events\" by intensity and duration.",
      points: ["Heat spike: 24 to 48 hours with temperatures well above seasonal norms, locally or nationwide.", "Heatwave: a prolonged period of abnormally high temperatures nationwide. National thermal indicator ≥ 25.3°C for 1 day, or ≥ 23.4°C for at least 3 days.", "Severe heatwave (canicule): at least 3 consecutive days of very high temperatures, day and night. Thresholds vary by department: Lille max > 33°C and min > 18°C; Toulouse max > 36°C and min > 21°C."],
      example: "June 24, 2026 was the hottest day recorded in France since 1947: national thermal indicator of 30°C.",
      trap: "The national thermal indicator is the average of daily minimum and maximum temperatures over 30 stations, not the hottest temperature measured." },
    { id: "s-heattrend", title: "More frequent, earlier, longer, more severe",
      line: "Heatwaves are becoming more frequent and intense, and climatologists expect the trend to grow.",
      points: ["Of the 54 heatwaves recorded in France since 1947, two-thirds happened in the 21st century and more than half since 2010.", "Since 2000, a heatwave almost every year (sometimes several), against one summer in five before 1989.", "By 2050, the number of heatwave days should be multiplied by five; heatwaves will start earlier and be more severe."] },
    { id: "s-warming", title: "Global warming and climate change",
      line: "Global warming is the rise in the planet's average temperature, caused by rising concentrations of greenhouse gases (GHG) such as CO₂.",
      points: ["Climate change is broader: all transformations of the climate, not only temperature but humidity, precipitation and the frequency of extreme events.", "It is the cause of more frequent and severe heatwaves."],
      trap: "Do not use the two terms as synonyms: global warming is one part of climate change." },
    { id: "s-conseq", title: "Consequences of more frequent heatwaves",
      line: "The consequences are numerous and of three kinds: environmental, social and economic.",
      points: ["Environmental: marine heatwaves, soil drying, water scarcity, forest fires, vegetation stress (stomata close), biodiversity loss, worse air quality.", "Social: disrupted daily life, physical and mental health, higher mortality, some forms of poverty worsen, pressure on health services, worse working conditions.", "Economic: lower agricultural yields, lower productivity at work, higher prices (food, energy, water, insurance), disrupted tourism and new destinations, transport disruption."],
      exam: "Many consequences are linked: soil drying feeds forest fires, which emit CO₂, which feeds warming. Showing these links is the point of a causal diagram." }
  ] },
  { title: "The causal diagram", widget: "sign", cards: [
    { id: "s-system", title: "System",
      line: "A set of interacting elements. The causes and consequences of a phenomenon such as heatwaves can be seen as one system.",
      exam: "Systems thinking is a holistic approach: it looks at the phenomenon as a whole, with its many causes and effects." },
    { id: "s-cld", title: "Causal diagram (causal loop diagram)",
      line: "A visual representation of the variables of a system and of the cause-and-effect relationships between them.",
      points: ["Variables are things that can go up or down (a rate, a level, a quantity).", "Arrows show influences; each arrow carries a sign.", "It can be expanded with more factors, or detailed with intermediate variables."],
      example: "Attention in class → (+) mastery of the course → (+) grades. Study intensity → (+) mastery. Exam difficulty → (−) grades.",
      trap: "A variable is a quantity, not an event or an actor: \"air-conditioning use\", not \"air conditioners\"; \"electricity price\", not \"EDF\"." },
    { id: "s-link", title: "A causal link and its sign",
      line: "An arrow from A to B means A influences B. The sign says whether they move in the same direction (+) or in opposite directions (−).",
      formula: "A —(+)→ B : A rises → B rises (A falls → B falls)\nA —(−)→ B : A rises → B falls (A falls → B rises)",
      points: ["Each link is read \"all else being equal\": the other variables that may influence B are held constant.", "In this course the sign does not change with the values of the variables (no bell-shaped relationships)."],
      example: "\"All else being equal, the more attentive a student is in class, the higher their grades\": attention —(+)→ grades.",
      trap: "+ does not mean \"good\" and − does not mean \"bad\". Electricity price —(−)→ electricity consumption is a perfectly normal link." }
  ] },
  { title: "Feedback loops and unintended consequences", widget: "loop", cards: [
    { id: "s-feedback", title: "Feedback loop",
      line: "A mechanism through which the consequences of a phenomenon act on its cause: A changes B, which in turn changes A.",
      example: "Motivation → (+) attention in class → … → grades → (−) parental reprimands → (−) motivation." },
    { id: "s-reinforce", title: "Positive (reinforcing) loop",
      line: "Tends to amplify the change in the initial variable.",
      example: "Global average temperature → (+) soil drying → (+) global average temperature: warming dries soils, and dry soils amplify warming.",
      trap: "\"Positive\" says nothing about being desirable: a reinforcing loop can amplify a disaster." },
    { id: "s-balance", title: "Negative (balancing) loop",
      line: "Tends to attenuate the change in the initial variable, pulling it back.",
      example: "Electricity consumption → (+) electricity price → (−) electricity consumption: when consumption rises, the price rises and dampens consumption." },
    { id: "s-polarity", title: "The loop polarity rule",
      line: "Count the minus signs around the loop.",
      formula: "Only + signs → positive (reinforcing) loop\nEven number of − → positive (reinforcing) loop\nOdd number of − → negative (balancing) loop",
      example: "Indoor temperature → (+) air-conditioning use → (−) indoor temperature: one minus, so a balancing loop.",
      exam: "Always state the rule when you name a loop: \"two minus signs, an even number, so the loop is reinforcing\"." },
    { id: "s-unintended", title: "Unintended consequence (effet pervers)",
      line: "An undesirable, problematic or even counterproductive effect of a behavior or measure adopted to adapt to a problem or to solve it.",
      example: "Heat raises indoor temperatures, so people use air conditioning (desired effect: indoor temperature falls). But AC uses electricity and emits CO₂, which raises the global average temperature: the problem is fed by its own fix.",
      exam: "To show an unintended consequence on a diagram, mark the desired effect (a balancing loop) and the unwanted path that brings the problem back (a reinforcing loop)." }
  ] },
  { title: "The heatwave system", widget: "heatmap", cards: [
    { id: "s-heatcld", title: "The heatwave causal diagram (non-exhaustive)",
      line: "GHG concentration → (+) global average temperature → (+) heatwave frequency and severity, which spreads to soils, forests, homes, energy and health.",
      points: ["Heatwaves → (+) soil drying → (+) vegetation stress → (−) CO₂ absorption → (−) GHG concentration.", "Soil drying → (+) forest fires → (+) CO₂ emissions → (+) GHG concentration.", "Heatwaves → (+) indoor temperatures → (+) AC use → (−) indoor temperatures.", "AC use → (+) electricity consumption → (+) CO₂ emissions; consumption → (+) electricity price → (−) consumption.", "Indoor temperatures → (+) health problems and (+) energy poverty; electricity price → (+) energy poverty; monetary poverty → (+) energy poverty."],
      exam: "Colour or label each variable as environmental, social or economic, as the slides do." },
    { id: "s-measures", title: "Measures against heatwaves, and their drawbacks",
      line: "A causal diagram helps imagine measures, and their side effects.",
      points: ["Subsidize air conditioners to limit health risks, but it reinforces the unintended rise in CO₂ emissions.", "Guidance on AC use (\"cool to 26°C at most\").", "Lower-emission alternatives to AC: insulation, urban greening, solar shading.", "Help low-income households with energy bills (energy vouchers, chèques énergie) against energy poverty.", "Prevent and fight forest fires.", "Keep decarbonizing electricity (comparatively low-carbon in France, much less elsewhere)."],
      exam: "These are macro measures (society, governments). Measures also exist at the meso level (organizations) and the micro level (individuals)." },
    { id: "s-linear", title: "Systems thinking versus linear thinking",
      line: "We tend to look for one main cause and one fix. That is reassuring and fast, but inadequate, even counterproductive, for complex challenges.",
      points: ["The complexity comes from the variety of environmental, social and economic causes and consequences, and from their interactions.", "Systems thinking accounts for this complexity, so we can design measures, or combinations of measures, that fit.", "The causal diagram is its essential tool."] }
  ] }
  ] },

{ id: "sd", n: 2, title: "Sustainable development and why it is hard", short: "Sustainable development", c: "var(--c2)",
  intro: "Where sustainability comes from (a forest in 18th-century Saxony), the Meadows report and its simulations, the Brundtland definition, and why our societies still struggle to be sustainable.",
  sections: [
  { title: "An overused word", cards: [
    { id: "d-overused", title: "\"Sustainable\": an overused term",
      line: "The word is now used widely and often uncritically as a positive label for anything that looks green, which dilutes its meaning.",
      points: ["This use hides the fact that sustainability comes from a rigorous tradition of thought.", "Feix, Gruban and de Fauconberg (2026) call actions that do not lead to their purported impact \"Type II greenwashing\", a barrier to sustainability."],
      example: "Dropping clothes at a collection point, recyclable packaging, banning old cars in a city centre: each sounds sustainable, but the answer is \"not that simple\" once you follow the consequences." }
  ] },
  { title: "Origins: a forest in Saxony", widget: "msy", cards: [
    { id: "d-carlowitz", title: "Von Carlowitz and Sylvicultura oeconomica (1713)",
      line: "The father of modern forestry and of the idea of sustainability: harvest no more wood than the forest can regrow.",
      points: ["After the Thirty Years' War (1618–1648), logging in Saxony grew to supply the silver mines.", "Early 18th century: a timber shortage, a problem for the mining industry (prices rose) and for the population (wood was essential).", "Hans Carl von Carlowitz (1645–1714) recommended keeping logging below a threshold so timber stays available over the long term: \"sustainable yield\" (nachhaltige Nutzung)."] },
    { id: "d-msy", title: "Maximum sustainable yield (MSY)",
      line: "The largest quantity of a specific renewable natural resource that can be extracted from an ecosystem on a lasting basis.",
      points: ["Beyond the MSY, the resource is overexploited: a forest above its MSY shrinks.", "MSY is a key concept in every sector that harvests living resources: forestry, hunting, fishing, aquaculture."],
      example: "Von Carlowitz in a causal diagram: quantity of timber harvested → (−) timber available → (−) timber price → (−) profitability of the industry and (−) the population's ability to meet essential needs. But this dynamic only appears beyond the MSY threshold.",
      trap: "MSY concerns renewable resources. For a non-renewable resource (oil, ore), there is no regrowth and no lasting yield." },
    { id: "d-principles", title: "The three principles of sustainability-oriented thinking",
      line: "Since Sylvicultura oeconomica, sustainability thinking rests on three ideas.",
      points: ["A long-term perspective.", "A systems approach integrating environmental, social and economic factors.", "The existence of limits that must not be exceeded to preserve an ecosystem's capacity to regenerate."],
      exam: "Use these three principles to judge whether a practice is truly sustainable." }
  ] },
  { title: "The Meadows report (1972)", widget: "popul", cards: [
    { id: "d-meadows", title: "The Limits to Growth (the Meadows report)",
      line: "A 1972 study commissioned by the Club of Rome and run by four MIT scientists, warning of a risk of collapse if demographic and economic growth continue unchanged.",
      points: ["Authors: Dennis and Donella Meadows, Jørgen Randers, William Behrens.", "The first study to project global conditions with simulations built on a causal diagram.", "A major impact: millions of copies, new editions in 1992, 2004 and 2022, awareness of what we now call planetary boundaries, and the debate on whether infinite growth is possible."] },
    { id: "d-five", title: "Five interdependent variables",
      line: "The study evaluates the long-term global evolution of population, agricultural production, industrial production, non-renewable resources and pollution." },
    { id: "d-carrying", title: "Carrying capacity",
      line: "The maximum number of individuals of a species that an ecosystem can sustain over time.",
      points: ["For the MIT team: the species is humankind, the ecosystem is the whole Earth system (the biosphere).", "A population can approach its carrying capacity smoothly, oscillate around it, or overshoot it and collapse."] },
    { id: "d-poploops", title: "The two loops that drive population",
      line: "Population depends on a positive loop (births) and a negative loop (deaths).",
      formula: "Population → (+) births per year → (+) population      positive loop\nPopulation → (+) deaths per year → (−) population      negative loop",
      points: ["If (+) >> (−): the population grows exponentially.", "If (+) ≈ (−): it stays stable.", "If (−) >> (+): it declines.", "Average fertility drives births; average mortality drives deaths."] },
    { id: "d-method", title: "The Meadows method: diagram, parameters, simulation",
      line: "First a causal loop diagram (World3), then parameterization with historical data, then simulations of the five variables.",
      points: ["Parameterization sets the form of each relationship (linear or not, with or without thresholds), its strength, and causal delays (the time a cause takes to produce its effect).", "Under the \"standard\" scenario, resources fall, population and industrial output peak, then collapse in the 21st century."] },
    { id: "d-recos", title: "The report's recommendations, and their reception",
      line: "Stabilize the world population (births = deaths) and halt economic growth (investment = capital depreciation).",
      points: ["Ideally with services rather than goods and more environmentally responsible agriculture.", "Criticisms: some assumptions proved wrong (non-renewable resource depletion overestimated, climate change barely anticipated); some found the recommendations too radical.", "Legacy: it opened increasingly fine modelling of human impact; its method (diagram → parameters → simulation) and premises (feedback loops, delays, carrying capacity) still guide research; its collapse scenario is still considered plausible."] }
  ] },
  { title: "Sustainable development", widget: "venn", cards: [
    { id: "d-sd", title: "Sustainable development (Brundtland, 1987)",
      line: "\"Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.\"",
      points: ["First documented use: 1980 (World Conservation Strategy by IUCN, UNEP, WWF, FAO, UNESCO).", "Popularized in 1987 by the World Commission on Environment and Development in \"Our Common Future\", the Brundtland Report.", "A shift from Meadows: instead of ending growth, development that respects the environment and ensures intra- and intergenerational social justice."],
      exam: "Quote the definition, then say what it changed compared with the Meadows report." },
    { id: "d-pillars", title: "The three pillars",
      line: "Sustainable development rests on an environmental, a social and an economic pillar, drawn as three overlapping circles.",
      points: ["Environment and social: bearable.", "Environment and economic: viable.", "Social and economic: equitable.", "All three: sustainable."],
      trap: "Viable is environment + economic, equitable is social + economic. Students often swap them." },
    { id: "d-milestones", title: "How sustainable development was institutionalized",
      line: "From the 1980s, the term entered conferences, agreements, school programmes and everyday language.",
      points: ["1980 first use · 1987 Brundtland Report · 1988 IPCC created.", "1992 Rio conference (Agenda 21) · 1999 Global Compact speech · 2000 Millennium Development Goals.", "2002 Johannesburg summit (Rio+10) · 2005 Kyoto Protocol in force · 2006 Stern Review.", "2007 Nobel Peace Prize to the IPCC and Al Gore · 2012 Rio+20 · 2015 Paris Agreement and the SDGs (Agenda 2030)."] },
    { id: "d-sdgs", title: "The Sustainable Development Goals (SDGs)",
      line: "17 goals and 169 targets at the heart of the 2030 Agenda, adopted by the 193 UN member states.",
      example: "Target 1.1: by 2030, eradicate extreme poverty, measured as living on less than $2.15 a day (now $3.00)." }
  ] },
  { title: "Why it has not happened yet", cards: [
    { id: "d-offtrack", title: "Far off track",
      line: "Of the 139 SDG targets with enough data, only 15% appear on track for 2030 (UN, 2026)." },
    { id: "d-obstacles", title: "Obstacles at three levels",
      line: "Macro (states and their cooperation), meso (businesses), micro (individuals).",
      points: ["Macro: international competition (a country with strict environmental standards becomes less attractive); weak international commitments without enforcement.", "Meso: business models that depend on sales volumes; choosing communication over action (greenwashing).", "Micro: budget and social constraints; no accessible alternative (e.g. transport)."],
      exam: "When asked why sustainability is hard, organize your answer by level, with one example per obstacle." }
  ] }
  ] },

{ id: "ecology", n: 3, title: "Introduction to ecology", short: "Ecology", c: "var(--c5)",
  intro: "The vocabulary of scientific ecology, the two mechanisms that explain how systems hold or break (resilience and tipping points), and the Great Acceleration that may have opened the Anthropocene.",
  sections: [
  { title: "Basic concepts", cards: [
    { id: "e-ecology", title: "Ecology",
      line: "The branch of biology that studies the interactions among living beings, and between living beings and their environment.",
      points: ["From the Greek oikos (house, habitat) and logos (science).", "Coined by the zoologist Ernst Haeckel in 1866.", "Scientific ecology (the focus of the course) is not political ecology."] },
    { id: "e-biosphere", title: "Biosphere",
      line: "The thin envelope around the Earth (about 20 km thick) where all life has developed: the set of all ecosystems on Earth.",
      points: ["It includes the upper lithosphere, the hydrosphere and cryosphere, and the lower atmosphere.", "Term coined in 1875 by the geologist Eduard Suess."] },
    { id: "e-ecosystem", title: "Ecosystem",
      line: "Living organisms (plants, animals, bacteria) and non-living elements (air, water, rocks, weather, sunlight) that interact: a biocenosis plus its biotope.",
      points: ["Biocenosis: living beings in reciprocal dependence, complex and balanced enough to be somewhat autonomous.", "Biotope: an area with relatively homogeneous conditions (pressure, light, rainfall, humidity, temperature, soil, relief) and enough resources for life.", "Contraction of \"ecological system\", coined in 1935 by the botanist Arthur George Tansley.", "Examples: a forest, a river, a meadow."],
      exam: "One sentence that links them: ecology studies interactions within ecosystems (biocenosis + biotope), and the biosphere is the set of all ecosystems on Earth." },
    { id: "e-global", title: "Global ecology and Vernadsky",
      line: "The concept of ecosystem works at every scale, so the biosphere itself is an ecosystem. Global ecology studies its functioning at planetary scale.",
      points: ["Vladimir Vernadsky laid its foundations in \"The Biosphere\" (1926): the father of global ecology and biogeochemistry."] },
    { id: "e-vernadsky", title: "The Vernadskian revolution",
      line: "Living matter is not just embedded in the non-living world: it is a geological force, comparable to natural forces.",
      points: ["Example: the Great Oxidation Event, a change of the atmosphere caused by life.", "Biogeochemical cycles: chemical elements circulate and transform between the living (bio) and the non-living (geo).", "Some of these cycles are now strongly disrupted by humanity, which has become a major geological force."] }
  ] },
  { title: "Resilience and tipping points", widget: "basin", cards: [
    { id: "e-resilience", title: "Resilience",
      line: "The capacity of an (eco)system to absorb a pressure or disturbance without a major change in its structure, and to return to its initial state once the disturbance has gone.",
      points: ["It depends on feedback loops that stabilize the system's key variables (balancing loops)."] },
    { id: "e-tipping", title: "Tipping point",
      line: "A level of pressure beyond which the (eco)system reorganizes, often fast and non-linearly, and does not return to its initial state even if the pressure is reduced.",
      points: ["Beyond a critical threshold, the balance between amplifying and regulating loops breaks (some loops may even disappear).", "The system shifts quickly to a new equilibrium state."],
      trap: "A tipping point is not just \"a lot of damage\": the defining feature is that removing the pressure does not bring the system back." },
    { id: "e-climate", title: "The climate system and its tipping elements",
      line: "Atmosphere, hydrosphere and cryosphere, lithosphere and biosphere, and their interactions, determine the climate. It is resilient to warming, but only up to climate tipping points.",
      points: ["Tipping elements can be ecosystems (Greenland ice sheet, Amazon rainforest) or climate phenomena (thermohaline circulation in the Atlantic, Indian summer monsoon).", "Identified by Lenton et al. (2008)."] },
    { id: "e-cascade", title: "Tipping cascades",
      line: "Tipping points are hard to locate precisely, and a domino effect cannot be ruled out from 1.5 to 2.0°C of warming.",
      example: "Greenland ice sheet melts → massive freshwater inflow into the North Atlantic → slowdown of the Atlantic thermohaline circulation (Wunderling et al., 2024).",
      exam: "The more warming, the higher the risk of several tipping events in quick succession." }
  ] },
  { title: "The Great Acceleration and the Anthropocene", widget: "accel", cards: [
    { id: "e-acceleration", title: "The Great Acceleration",
      line: "The sharp amplification of human-driven processes causing global environmental change in the industrial age, especially since the mid-20th century.",
      points: ["Socio-economic trends shoot up together after 1950: population, real GDP, energy use, fertilizers, water use, dams, transport, telecommunications, tourism…", "Earth system trends follow: CO₂, methane and nitrous oxide concentrations, surface temperature, ocean acidification, fish capture, tropical forest loss, domesticated land…"] },
    { id: "e-anthropocene", title: "The Anthropocene",
      line: "A proposed new geological epoch in which the processes and conditions of life on Earth are profoundly changed by human activities.",
      points: ["Coined in the 1980s by the biologist Eugene Stoermer, popularized in 2000 by the chemist Paul Crutzen.", "Not formally recognized as an official stratigraphic unit by the International Commission on Stratigraphy, but widely accepted and used by climate scientists and geologists."] },
    { id: "e-holocene", title: "The Holocene",
      line: "The geological epoch of relative climatic stability of the last ~11,700 years, which the Anthropocene would follow.",
      points: ["Without human disturbance it would have lasted several thousand more years.", "It allowed agriculture and great civilizations to develop: environmental stability is a key factor of human development.", "Hence the question: what level of human-driven change could take us out of a Holocene-like state? Answer: the planetary boundaries."] }
  ] }
  ] },

{ id: "bounds", n: 4, title: "Planetary boundaries, warming and biodiversity", short: "Planetary boundaries", c: "var(--pri)",
  intro: "The nine planetary boundaries and how many are crossed, the two core ones (global warming and biodiversity loss), and what warming means for a business, with the case of cocoa.",
  sections: [
  { title: "The planetary boundaries", widget: "pb", cards: [
    { id: "b-question", title: "Which limits keep the Earth Holocene-like?",
      line: "Limits are inherent to ecology. The Holocene is the only state we know for sure is favourable to humanity, so which limits must we not exceed?",
      points: ["Meadows (1972) already said we do not know the precise limits, but we know there is an upper limit.", "In 2009, a team linked to the Stockholm Resilience Centre set out to quantify them (Rockström et al., 2009)."] },
    { id: "b-pb", title: "Planetary boundaries",
      line: "Nine quantified boundaries linked to Earth-system processes. Below them, humanity stays in a \"safe operating space\"; the further a boundary is crossed, the higher the risk of lasting damage to living conditions.",
      points: ["1 Biodiversity loss (biosphere integrity).", "2 Global warming (climate change).", "3 Biogeochemical cycles disrupted by fertilizers (nitrogen, phosphorus).", "4 Ocean acidification.", "5 Ozone layer depletion.", "6 Freshwater cycle.", "7 Land-use change.", "8 Aerosols in the atmosphere.", "9 Release of novel entities (e.g. plastics, chemicals)."],
      trap: "The exact wording of the nine boundaries varies between reports. Learn the processes, not one exact phrasing." },
    { id: "b-upstream", title: "Boundaries are set before the tipping points",
      line: "A boundary is not the tipping point itself: it is placed upstream of it, leaving a buffer.",
      points: ["Green zone: the safe operating space. Yellow: a zone of uncertainty with increasing risk. Red: high risk of serious impacts.", "The buffer accounts for uncertainty about where the threshold lies, and gives society time to react to early warning signs (Steffen et al., 2015)."] },
    { id: "b-core", title: "Core boundaries",
      line: "The boundaries are linked, so crossing one can threaten the others. Two are connected to all the others: global warming and biodiversity loss.",
      points: ["Scientists call them \"core boundaries\" (Steffen et al., 2015)."] },
    { id: "b-status", title: "Seven of nine boundaries are crossed",
      line: "2009: three crossed (biodiversity, climate, nitrogen cycle). 2015: land-use change. 2022: novel entities. 2023: freshwater. 2025: ocean acidification.",
      points: ["Still within: ozone layer depletion and atmospheric aerosols.", "We are close to a \"high-risk line\".", "Living conditions will almost certainly change profoundly in the coming decades, but the scale depends on our pressures: \"every degree, even every tenth of a degree, counts\"."],
      exam: "Learn the order of the crossings with their years: it is typical of the empirical facts the exam asks for." }
  ] },
  { title: "Global warming", cards: [
    { id: "b-weather", title: "Weather and climate",
      line: "Weather is the state of the atmosphere at a given moment; climate is its average state over a long period (e.g. 30 years).",
      example: "A 5°C drop during the day is nothing. A 5°C drop in the average temperature would mean a very different world.",
      trap: "A cold winter does not disprove global warming: one moment of weather says nothing about the climate." },
    { id: "b-figures", title: "How much warmer",
      line: "Over 2018–2022, the global average temperature was 1.17 ± 0.13°C above the pre-industrial era (1850–1900), and it rises about +0.26°C per decade." },
    { id: "b-process", title: "Where warming comes from",
      line: "Human economic activity emits GHG (fossil fuels, industry, land use) → concentrations of CO₂, methane and nitrous oxide rise → the greenhouse effect strengthens → temperatures rise.",
      points: ["The consequences are many and depend on the extent of warming (IPCC, 6th report)."] }
  ] },
  { title: "Biodiversity loss", widget: "drivers", cards: [
    { id: "b-bio3", title: "Three types of biodiversity",
      line: "Genetic diversity (genes within a species), species diversity, and ecosystem diversity (living environments). All three are falling because of human activity." },
    { id: "b-sixth", title: "A sixth mass extinction",
      line: "The global extinction rate is at least tens to hundreds of times higher than the average of the last 10 million years, and it is accelerating.",
      points: ["Consequences: less resilient ecosystems, disrupted pollination, fewer food resources, spread of diseases."] },
    { id: "b-drivers", title: "The five direct drivers (IPBES)",
      line: "Land- and sea-use change, direct exploitation of organisms, climate change, pollution, invasive alien species.",
      points: ["Behind them, indirect drivers: demographic and sociocultural, economic and technological, institutions and governance, conflicts and epidemics.", "IPBES examples of decline: natural ecosystems down 47% on average; about 25% of species threatened with extinction; wild mammal biomass down 82%."] }
  ] },
  { title: "Warming and business: cocoa", widget: "cocoa", cards: [
    { id: "b-cocoa", title: "How warming hits the chocolate industry",
      line: "About 60% of the world's cocoa comes from Côte d'Ivoire and Ghana, where extreme weather spreads diseases and cuts harvests.",
      formula: "Global average temperature → (+) extreme weather (torrential rains, droughts) → (+) viral diseases and fungi → (−) cocoa production → (−) cocoa price → (+) chocolate price → (−) chocolate consumption",
      points: ["Age of cocoa trees → (−) cocoa production.", "Global average temperature → (+) summer temperatures in chocolate-consuming countries → (−) chocolate consumption."] },
    { id: "b-lindt", title: "What a company can do: Lindt & Sprüngli",
      line: "\"Climate change is a strategic risk that requires action across our business\" (Climate Transition Plan, 2025).",
      points: ["Reduce the company's carbon footprint.", "Hedge, where possible, against sudden rises in cocoa purchase prices.", "Develop agroforestry.", "Innovate in products."],
      exam: "For any company, split measures into mitigation (cut its own emissions) and adaptation (protect supply, prices, products)." }
  ] }
  ] },

{ id: "social", n: 5, title: "The Doughnut, poverty and inequality", short: "Social challenges", c: "var(--c3)",
  intro: "The Doughnut adds a social floor to the planetary boundaries. Then the two social challenges of the course: poverty, absolute and relative, and inequality, with the ways they are measured.",
  sections: [
  { title: "The Doughnut model", widget: "doughnut", cards: [
    { id: "o-doughnut", title: "The Doughnut (Kate Raworth, 2012)",
      line: "A framework that combines the planetary boundaries with social justice: an ecological ceiling not to exceed, and a social foundation not to fall below.",
      points: ["Between the two lies the ring-shaped \"safe and just space for humanity\".", "The social foundation had 11, then 12 dimensions, inspired by the social priorities of Rio+20.", "Published as an Oxfam paper: \"A safe and just space for humanity: can we live within the doughnut?\""] },
    { id: "o-dims", title: "The two boundaries of the Doughnut",
      line: "Social foundation (12): food, health, education, income and work, peace and justice, political voice, social equity, gender equality, housing, networks, energy, water.",
      points: ["Ecological ceiling (9): climate change, ocean acidification, chemical pollution, nitrogen and phosphorus loading, freshwater withdrawals, land conversion, biodiversity loss, air pollution, ozone layer depletion.", "Inside the ring: shortfall (below the foundation). Outside: overshoot (beyond the ceiling)."] },
    { id: "o-2025", title: "The Doughnut in 2025 (Doughnut 3.0)",
      line: "Seven of nine planetary boundaries crossed, and shortfalls, sometimes large, on every dimension of the social foundation. Progress exists but is \"modest\".",
      points: ["No country operates within the safe and just space.", "The richest 20% of countries (15% of the world population) cause over 40% of ecological overshoot.", "The poorest 40% of countries (42% of the population) bear over 60% of social shortfalls (Fanning and Raworth, 2025)."],
      exam: "Use these figures against the claim \"our economy has at least solved the main social problems\"." }
  ] },
  { title: "Poverty", widget: "living", cards: [
    { id: "o-poverty", title: "Poverty",
      line: "A state of deprivation in which a person lacks the resources needed to live adequately.",
      points: ["The two most common definitions: absolute monetary poverty (the World Bank's extreme poverty) and relative monetary poverty (France, EU).", "Others exist: multidimensional poverty (Amartya Sen), poverty as dependence on assistance (Georg Simmel), and indicators such as poverty intensity."] },
    { id: "o-absolute", title: "Absolute monetary poverty: extreme poverty",
      line: "Living on less than the international poverty line of US$3.00 a day in PPP terms (raised in May 2024 from $2.15): the estimated income needed for vital goods.",
      points: ["Two more thresholds: $4.20 and $8.30 a day.", "2025: 10.1% of the world, about 831 million people.", "Since 1950 it has fallen sharply almost everywhere, but it stays very high in Sub-Saharan Africa (about 44%)."],
      trap: "Absolute poverty ignores context: the same $3.00 line applies everywhere, whatever the cost of a decent life in that society." },
    { id: "o-relative", title: "Relative monetary poverty",
      line: "A person is poor if their standard of living is below the country's poverty line, usually 60% of the median standard of living.",
      points: ["It measures the inability to buy the goods needed for a normal life in that context.", "Used by Eurostat and most European countries.", "France, 2024: poverty line €1,337 a month; poverty rate 15.4%."],
      example: "Absolute = vital goods, regardless of context. Relative = essential goods for a decent life in a given society." },
    { id: "o-living", title: "Standard of living and consumption units",
      line: "Standard of living = household disposable income ÷ number of consumption units (CU). Everyone in the household has the same standard of living.",
      formula: "Disposable income = income − mandatory payments (income tax, CSG, CRDS…)\nCU: 1 for the first adult, 0.5 per other person aged 14+, 0.3 per child under 14\nStandard of living = disposable income ÷ CU",
      points: ["Income counts earnings, asset income (interest, dividends, rents), pensions and unemployment benefits, and social benefits."],
      example: "2 adults and a 9-year-old: €3,000 − €300 = €2,700; CU = 1 + 0.5 + 0.3 = 1.8; standard of living = €1,500 a month, above the €1,337 line." },
    { id: "o-line", title: "The poverty line",
      line: "60% of the median standard of living: the level that splits the population in two halves.",
      points: ["France: median €2,228 a month, so the line is about €1,337.", "Poverty in France is lower than in the early 1970s; it fell sharply in the 1970s, then stabilized (Insee changed its method in 1996)."] },
    { id: "o-drivers", title: "Who is poor? Drivers of poverty",
      line: "In Centre-Val de Loire (Insee, 2021), the drivers are largely the same in rural and urban areas.",
      points: ["Single-parent families are the most affected.", "The chart compares household types: single-parent families, people living alone, tenants and owners, large households, young and old households.", "Older people and homeowners are less affected."] }
  ] },
  { title: "Inequality", widget: "lorenz", cards: [
    { id: "o-ineq", title: "Poverty is not inequality",
      line: "Poverty is about the situation of the people at the bottom. Inequality is about the gaps across the whole distribution.",
      example: "Everyone can get richer while inequality rises; poverty can fall while the top captures most of the growth." },
    { id: "o-palma", title: "Palma index",
      line: "The income of the richest 10% divided by the income of the poorest 40%.",
      formula: "Palma = income share of the top decile ÷ income share of the bottom 40%",
      example: "France 1.08 (2019); United States 1.63 (2021)." },
    { id: "o-gini", title: "Gini coefficient",
      line: "From 0 (perfect equality) to 1 (perfect inequality).",
      points: ["It measures how far the Lorenz curve (cumulative share of income held by the cumulative share of people) is from the line of perfect equality."],
      example: "France 0.292 (2019); United States 0.375 (2021)." },
    { id: "o-paygap", title: "Gaps between groups: the gender pay gap",
      line: "In France's private sector (2022), women earn 24% less across all working hours, 15% less for the same working hours, and 4% less for comparable hours and jobs.",
      exam: "Read the three figures as a decomposition: working time explains part of the gap, differences in jobs another part, and about 4% remains at equal hours and jobs." },
    { id: "o-trend", title: "Inequality since 1980",
      line: "The income share of the top 10% has risen in most major regions since 1980.",
      points: ["Around 2018: India about 55%, United States and Russia about 46–48%, China about 41%, Europe about 34% (the lowest)."] },
    { id: "o-why", title: "Why care about inequality, not only poverty?",
      line: "Across rich countries, more unequal societies have worse health and social problems.",
      points: ["The index combines life expectancy, numeracy and literacy, infant mortality, homicides, imprisonment, teenage births, trust, obesity, mental health and addiction, and social mobility.", "The USA and Portugal are at the unequal, worse end; Japan and the Nordic countries at the equal, better end."],
      trap: "This is a correlation across countries. It corroborates a link, it does not prove that inequality causes every problem." }
  ] }
  ] },

{ id: "economy", n: 6, title: "Our economic model", short: "Economic model", c: "var(--c1)",
  intro: "The third pillar: what an economy, a market, capitalism and a market economy are, why growth divides sustainability thinkers, and four scenarios for France in 2050.",
  sections: [
  { title: "Four words not to confuse", widget: "words", cards: [
    { id: "c-economy", title: "Economy",
      line: "From the Greek oikos (house, property) and nomos (law, rule): household management. All human activities that produce, store and distribute goods and services.",
      points: ["Several economic models exist: traditional economy, feudal economy, capitalism… Capitalism is one model among others.", "By extension, \"economics\" studies how economies work (e.g. the law of supply and demand), with several schools of thought."] },
    { id: "c-market", title: "Market",
      line: "A place, physical or virtual, where actors exchange goods, capital or labour for money.",
      points: ["Different from the abstract \"Market\" (capital M): the idea that prices and quantities emerge from competitive supply and demand, the Market as an institution (Gomez, 2022).", "Market exchanges are older than capitalism.", "They are one way among others to obtain goods: production for one's own use, or the gift economy (give, receive, return)."] },
    { id: "c-capitalism", title: "Capitalism",
      line: "An economic system in which market exchanges coexist with the possibility of investing money in the hope of making more money (Fulcher, 2015).",
      points: ["Merchant capitalism from the 17th century: the English East India Company, joint-stock companies, stock exchanges.", "Industrial capitalism from the early 19th century, with cotton mills in England: a bourgeoisie owning the means of production, and a proletariat.", "Its rise goes with economic growth, measured by GDP. Some argue growth is inherent to it: a \"growth imperative\"."],
      trap: "Markets alone are not capitalism: the defining addition is investing money to make more money." },
    { id: "c-marketeco", title: "Market, mixed and planned economies",
      line: "In a market economy, the supply of goods and their prices are set by free market forces, not by the state.",
      points: ["Planned economy: the state decides what to produce, plans volumes and sets prices.", "Mixed economy: elements of both."] }
  ] },
  { title: "The growth debate", widget: "growth", cards: [
    { id: "c-gdp", title: "Growth and its pressure",
      line: "World GDP was almost flat for 2,000 years, then exploded, above all after 1950.",
      points: ["This growth went with the Great Acceleration: seven of nine boundaries crossed, while shortfalls remain on all social dimensions of the Doughnut.", "Some actors must already adapt (the chocolate industry), governments reform (decarbonizing energy), but changes must scale up a lot."] },
    { id: "c-meadowsvbrund", title: "Meadows versus Brundtland on growth",
      line: "Meadows (1972) proposed a non-growing state of constant population and capital, called \"equilibrium\". Brundtland (1987) called for a new era of growth, socially and environmentally sustainable, seen as essential to relieve poverty." },
    { id: "c-four", title: "Four positions on growth",
      line: "Brown growth, green growth, selective growth, degrowth.",
      points: ["Brown growth: growth continues as now, on fossil fuels and a linear economy. Foundations: climate scepticism, economic libertarianism, techno-solutionism (\"Drill, baby, drill\").", "Green growth: growth decoupled from environmental pressure enough to stay within the boundaries. Techno-optimism, economic liberalism, weak sustainability (OECD, 2011).", "Selective growth: growth differentiated by countries' wealth and by sectors. Techno-scepticism, reformist environmentalism, strong sustainability (Jackson, 2009).", "Degrowth: abandon growth as a primary goal, or deliberately reduce production and consumption where needed. Techno-criticism, anti-capitalism, strong sustainability (Latouche, 2024)."],
      exam: "Weak sustainability assumes natural capital can be replaced by produced capital; strong sustainability holds that critical natural capital cannot be replaced. (These two terms are named on the slides; this gloss is ours.)" }
  ] },
  { title: "Four scenarios for 2050 (ADEME)", widget: "ademe", cards: [
    { id: "c-ademe", title: "ADEME's Transition(s) 2050",
      line: "The French Agency for Ecological Transition built four contrasting paths to carbon neutrality, from sobriety to technology.",
      points: ["S1 Frugal generation: frugality chosen but also imposed, local, low-tech, meat ÷3, mobility −⅓, little international cooperation, new prosperity indicators.", "S2 Regional cooperation: sharing economy, fairness, meat halved, managed mobility (−17%), environmental taxation, qualitative growth.", "S3 Green technologies: new technologies rather than less consumption, meat −30%, demolition and rebuilding, data centres ×10, targeted carbon tax, green growth.", "S4 Restoration gamble: mass consumption kept, nature a resource, bet on repairing damage (carbon capture and storage), mobility +28%, carbon-based growth."],
      exam: "One way to use them in an answer (our reading, not the slides'): S1 is closest to degrowth, S2 to selective growth, S3 to green growth, and S4 bets on technology to keep a carbon-based growth." },
    { id: "c-friction", title: "Changing behaviours",
      line: "Even a good scenario needs people to change behaviour: find the barriers (cost, habits, no alternative) and reduce the friction (infrastructure, price signals, rules, norms)." }
  ] }
  ] },

{ id: "method", n: 7, title: "Building a cause tree (tutorial)", short: "Cause tree", c: "var(--c4)",
  intro: "The graded group exercise: explain a social fact (the gender pay gap) with a causal diagram, present it clearly, then corroborate or refute each link with reliable sources.",
  sections: [
  { title: "The gender pay gap", cards: [
    { id: "m-facts", title: "The facts",
      line: "Insee (2026): in 2024, women's average net wage income in the private sector was 21.8% lower than men's.",
      points: ["It is a gap between two averages: it does not mean every woman earns less than every man.", "It only covers people in employment. The gender overall earnings gap (GOEG), which includes those without a job, is higher: about 29.6% in France in 2023, over 40% in some countries."] },
    { id: "m-tree", title: "Cause tree",
      line: "A causal diagram that explains a social phenomenon or an empirical observation: it maps the causes, not the consequences.",
      points: ["Start from the phenomenon (on the right) and go back to the variables that influence it directly, then indirectly.", "Each arrow carries a sign; each variable is a quantity that can rise or fall."] },
    { id: "m-steps", title: "The three steps of the assignment",
      line: "Build (20 min), present (45 min), test with evidence (20 min).",
      points: ["Build: think alone (~5 min), share ideas (~5 min), turn them into a causal diagram (~10 min).", "Present: ~5 minutes per group, then questions.", "Evidence: revise, then corroborate or refute the hypotheses; share one finding and one uncertainty with the class."] }
  ] },
  { title: "An example: homicides in the United States", widget: "homicide", cards: [
    { id: "m-homicide", title: "Explaining the US homicide rate",
      line: "In 2021 the US homicide rate was 6.8 per 100,000, six times France's. The illustrative cause tree maps direct and indirect causes.",
      points: ["Unemployment → (+) poverty; share of low-paid jobs → (+) poverty; development of the welfare system → (−) poverty.", "Poverty → (+) organised crime, (+) drug addiction, (+) homicides directly.", "Drug addiction → (+) organised crime and (+) homicides; organised crime → (+) homicides.", "Permissiveness of gun legislation → (+) gun ownership → (+) homicides."] }
  ] },
  { title: "Presenting it well", cards: [
    { id: "m-present", title: "What makes a good presentation",
      line: "Summarize first, stay understandable without the visual, explain each link, refer to other groups, answer briefly.",
      points: ["Overview first: \"we think the gap depends on four main mechanisms…\".", "Independence from the visual: people at the back cannot read your sheet.", "For each link, say why it is plausible: naming the link is not enough.", "Refer to other presentations: \"like groups 2 and 4, but our reasoning differs…\".", "Answer questions clearly and concisely."] }
  ] },
  { title: "Corroborate or refute", cards: [
    { id: "m-corroborate", title: "Corroborating a causal link",
      line: "A causal link is rarely proved with certainty, but evidence can make it more or less plausible: corroborate (support) or refute it.",
      example: "Studies on the disinhibiting effects of some drugs, or a correlation between drug use and crime (Martel-Perron; Poullot et al., 2008), do not prove drug addiction causes homicides, but they corroborate it.",
      points: ["Mark each link: corroborated, refuted, or uncertain."] },
    { id: "m-sources", title: "Reliable sources",
      line: "Evidence must be credible: trace each piece of information back to its primary source and check that source.",
      points: ["Reliable: statistics and polling institutes (Insee, ONS, Gallup), academic articles (Google Scholar), books by recognized authors or publishers, established media (The New York Times, The Guardian, Le Monde), government websites (.gov, .gouv.fr).", "Unreliable: social media posts, personal blogs, conspiracy websites or channels, pseudoscientific books and magazines."] }
  ] }
  ] }
];
