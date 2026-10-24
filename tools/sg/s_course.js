/* =====================================================================
   COURSE CONTENT — Societal and Global Challenges (BBA1, S1).
   Written from the slides of sessions 1 to 6 and the session 7 tutorial, reworded, then compacted (Oct 24):
   every definition, author, date, figure and causal link kept, redundant cards merged.
   Each card: title, line (the idea in one line), points, formula, example, trap, exam.
   ===================================================================== */
const COURSE = [
{ id: "systems", n: 1, title: "Systems thinking and causal diagrams", short: "Systems thinking", c: "var(--c4)",
  intro: "Heatwaves as a complex challenge, and the tool to see it whole: the causal diagram, with its feedback loops and unintended consequences.",
  sections: [
  { title: "The course and the exam", cards: [
    { id: "s-course", title: "The course and the exam",
      line: "How environmental and social challenges influence each other, and how the economy affects them and is affected by them.",
      points: ["Nine two-hour sessions, one of them the \"2tonnes workshop\". Tools: systems thinking, critical analysis of sources and data.", "Grading: group work in class 20%, individual exam organized by the Hub 80%, on all the slides of sessions 1 to 8.", "Expect to define the key concepts and explain the lessons of the empirical research shown in class (figures, studies, reports).", "A causal diagram is very likely: practise in the Causal studio."],
      exam: "For each definition, learn its logic: what it is, what it is not, one example." }
  ] },
  { title: "Heatwaves: a complex challenge", cards: [
    { id: "s-heatterms", title: "Heat spike, heatwave, severe heatwave",
      line: "Météo-France distinguishes three \"heat events\" by intensity and duration.",
      points: ["Heat spike: 24 to 48 hours well above seasonal norms, locally or nationwide.", "Heatwave: prolonged abnormal heat nationwide. National thermal indicator ≥ 25.3°C for 1 day, or ≥ 23.4°C for at least 3 days.", "Severe heatwave (canicule): at least 3 consecutive very hot days and nights. Thresholds by department: Lille max > 33°C and min > 18°C; Toulouse max > 36°C and min > 21°C."],
      example: "June 24, 2026: hottest day recorded in France since 1947, national thermal indicator of 30°C.",
      trap: "The national thermal indicator is the average of daily minimum and maximum temperatures over 30 stations, not the hottest temperature measured." },
    { id: "s-heattrend", title: "Heatwaves and climate change",
      line: "Heatwaves are becoming more frequent, earlier, longer and more severe, because of climate change.",
      points: ["54 heatwaves in France since 1947: two-thirds in the 21st century, more than half since 2010.", "Since 2000, a heatwave almost every year, against one summer in five before 1989. By 2050, five times more heatwave days.", "Global warming: the rise in the planet's average temperature, caused by rising greenhouse gas (GHG) concentrations such as CO₂.", "Climate change is broader: temperature, humidity, precipitation and the frequency of extreme events."],
      trap: "Not synonyms: global warming is one part of climate change." },
    { id: "s-conseq", title: "Consequences of more frequent heatwaves",
      line: "Three kinds of consequences: environmental, social and economic.",
      points: ["Environmental: marine heatwaves, soil drying, water scarcity, forest fires, vegetation stress (stomata close), biodiversity loss, worse air quality.", "Social: disrupted daily life, physical and mental health, higher mortality, worse poverty, pressure on health services, worse working conditions.", "Economic: lower crop yields and labour productivity, higher prices (food, energy, water, insurance), tourism and transport disrupted."],
      exam: "The consequences are linked (soil drying → fires → CO₂ → warming): showing these links is the point of a causal diagram." }
  ] },
  { title: "The causal diagram", widget: "sign", cards: [
    { id: "s-system", title: "System and causal diagram",
      line: "A system is a set of interacting elements. A causal (loop) diagram shows its variables and the cause-and-effect links between them.",
      points: ["Systems thinking is holistic: the phenomenon as a whole, with its many causes and effects.", "Variables can go up or down (a rate, a level, a quantity). Each arrow is an influence and carries a sign.", "A diagram can be expanded with more factors or detailed with intermediate variables."],
      example: "Attention in class → (+) mastery of the course → (+) grades. Study intensity → (+) mastery. Exam difficulty → (−) grades.",
      trap: "A variable is a quantity, not an event or an actor: \"air-conditioning use\", not \"air conditioners\"; \"electricity price\", not \"EDF\"." },
    { id: "s-link", title: "A causal link and its sign",
      line: "An arrow from A to B means A influences B. + : same direction. − : opposite directions.",
      formula: "A —(+)→ B : A rises → B rises (A falls → B falls)\nA —(−)→ B : A rises → B falls (A falls → B rises)",
      points: ["Each link is read \"all else being equal\": the other influences on B are held constant.", "In this course a sign never changes with the values (no bell-shaped relationships)."],
      trap: "+ does not mean \"good\", − does not mean \"bad\": electricity price —(−)→ electricity consumption is a normal link." }
  ] },
  { title: "Feedback loops and unintended consequences", widget: "loop", cards: [
    { id: "s-feedback", title: "Feedback loops: reinforcing and balancing",
      line: "A feedback loop: the consequences of a phenomenon act on its cause (A changes B, which changes A).",
      points: ["Positive (reinforcing) loop: amplifies the initial change. Global average temperature → (+) soil drying → (+) global average temperature.", "Negative (balancing) loop: attenuates it. Electricity consumption → (+) electricity price → (−) electricity consumption."],
      example: "Motivation → (+) attention in class → … → grades → (−) parental reprimands → (−) motivation.",
      trap: "\"Positive\" says nothing about being desirable: a reinforcing loop can amplify a disaster." },
    { id: "s-polarity", title: "The loop polarity rule",
      line: "Count the minus signs around the loop.",
      formula: "Only + signs → positive (reinforcing) loop\nEven number of − → positive (reinforcing) loop\nOdd number of − → negative (balancing) loop",
      example: "Indoor temperature → (+) air-conditioning use → (−) indoor temperature: one minus, a balancing loop.",
      exam: "State the rule when you name a loop: \"two minus signs, an even number, so the loop is reinforcing\"." },
    { id: "s-unintended", title: "Unintended consequence (effet pervers)",
      line: "An undesirable, even counterproductive effect of a behaviour or measure adopted to adapt to a problem or solve it.",
      example: "Heat → people use air conditioning (indoor temperature falls, as wanted). But AC uses electricity and emits CO₂, which raises the global average temperature: the fix feeds the problem.",
      exam: "On a diagram: the desired effect (a balancing loop) and the unwanted path that brings the problem back (a reinforcing loop)." }
  ] },
  { title: "The heatwave system", widget: "heatmap", cards: [
    { id: "s-heatcld", title: "The heatwave causal diagram (non-exhaustive)",
      line: "GHG concentration → (+) global average temperature → (+) heatwave frequency and severity, which spreads to soils, forests, homes, energy and health.",
      points: ["Heatwaves → (+) soil drying → (+) vegetation stress → (−) CO₂ absorption → (−) GHG concentration.", "Soil drying → (+) forest fires → (+) CO₂ emissions → (+) GHG concentration.", "Heatwaves → (+) indoor temperatures → (+) AC use → (−) indoor temperatures.", "AC use → (+) electricity consumption → (+) CO₂ emissions; consumption → (+) electricity price → (−) consumption.", "Indoor temperatures → (+) health problems and (+) energy poverty; electricity price → (+) energy poverty; monetary poverty → (+) energy poverty."],
      exam: "Colour or label each variable as environmental, social or economic, as the slides do." },
    { id: "s-measures", title: "Measures, and systems versus linear thinking",
      line: "A causal diagram helps imagine measures, and their side effects. Looking for one cause and one fix is reassuring but inadequate, even counterproductive.",
      points: ["Subsidize air conditioners (health), but it feeds the unintended rise in CO₂. Guidance on AC use (\"cool to 26°C at most\").", "Low-emission alternatives: insulation, urban greening, solar shading. Energy vouchers (chèques énergie) against energy poverty.", "Prevent forest fires; keep decarbonizing electricity (fairly low-carbon in France, much less elsewhere).", "Complexity comes from the variety of environmental, social and economic causes and consequences and their interactions: systems thinking designs combinations of measures that fit."],
      exam: "These are macro measures (governments). Measures also exist at meso (organizations) and micro (individuals) levels." }
  ] }
  ] },

{ id: "sd", n: 2, title: "Sustainable development and why it is hard", short: "Sustainable development", c: "var(--c2)",
  intro: "Where sustainability comes from, the Meadows report and its simulations, the Brundtland definition, and why our societies still struggle to be sustainable.",
  sections: [
  { title: "Origins: a forest in Saxony", widget: "msy", cards: [
    { id: "d-carlowitz", title: "Von Carlowitz (1713) and maximum sustainable yield",
      line: "Hans Carl von Carlowitz (1645–1714), Sylvicultura oeconomica (1713): harvest no more wood than the forest regrows. The father of modern forestry and of sustainability.",
      points: ["After the Thirty Years' War (1618–1648), logging for the Saxon silver mines caused a timber shortage: higher prices for the mines, hardship for the population.", "He recommended keeping logging below a threshold: \"sustainable yield\" (nachhaltige Nutzung).", "Maximum sustainable yield (MSY): the largest quantity of a renewable resource that can be extracted from an ecosystem on a lasting basis. Beyond it, overexploitation. Used in forestry, hunting, fishing, aquaculture."],
      example: "Timber harvested → (−) timber available → (−) timber price → (−) industry profitability and (−) the population's ability to meet essential needs. This dynamic only appears beyond the MSY.",
      trap: "MSY concerns renewable resources: a non-renewable resource (oil, ore) has no regrowth and no lasting yield." },
    { id: "d-principles", title: "Is it really sustainable? The three principles",
      line: "Since Sylvicultura oeconomica: a long-term perspective, a systems approach (environmental, social, economic), and limits not to exceed so an ecosystem can regenerate.",
      points: ["\"Sustainable\" is now an overused positive label for anything that looks green, which dilutes its rigorous meaning.", "Actions that do not lead to their purported impact: \"Type II greenwashing\" (Feix, Gruban and de Fauconberg, 2026)."],
      exam: "Use the three principles to judge whether a practice is truly sustainable." }
  ] },
  { title: "The Meadows report (1972)", widget: "popul", cards: [
    { id: "d-meadows", title: "The Limits to Growth (Meadows report, 1972)",
      line: "Commissioned by the Club of Rome, run by four MIT scientists: a risk of collapse if demographic and economic growth continue unchanged.",
      points: ["Dennis and Donella Meadows, Jørgen Randers, William Behrens. First global projections by simulation built on a causal diagram.", "Five interdependent variables: population, agricultural production, industrial production, non-renewable resources, pollution.", "Carrying capacity: the maximum number of individuals of a species an ecosystem can sustain over time (here humankind and the whole Earth system). A population can approach it smoothly, oscillate, or overshoot and collapse.", "Millions of copies, new editions 1992, 2004, 2022; it raised awareness of what we now call planetary boundaries and the debate on infinite growth."] },
    { id: "d-poploops", title: "The two loops that drive population",
      line: "Population depends on a positive loop (births) and a negative loop (deaths).",
      formula: "Population → (+) births per year → (+) population      positive loop\nPopulation → (+) deaths per year → (−) population      negative loop",
      points: ["(+) >> (−): exponential growth. (+) ≈ (−): stable. (−) >> (+): decline.", "Average fertility drives births; average mortality drives deaths."] },
    { id: "d-method", title: "Meadows: method, recommendations, criticisms",
      line: "Method: a causal loop diagram (World3), then parameterization with historical data, then simulations of the five variables.",
      points: ["Parameters: the form of each relationship (linear or not, thresholds), its strength, and causal delays.", "\"Standard\" scenario: resources fall, population and industrial output peak, then collapse in the 21st century.", "Recommendations: stabilize population (births = deaths) and halt growth (investment = capital depreciation), favouring services and greener agriculture.", "Criticisms: resource depletion overestimated, climate change barely anticipated, recommendations too radical for some.", "Legacy: the method and premises (loops, delays, carrying capacity) still guide research; the collapse scenario is still considered plausible."] }
  ] },
  { title: "Sustainable development", widget: "venn", cards: [
    { id: "d-sd", title: "Sustainable development (Brundtland, 1987)",
      line: "\"Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.\"",
      points: ["First used in 1980 (World Conservation Strategy: IUCN, UNEP, WWF, FAO, UNESCO).", "Popularized in 1987 by the World Commission on Environment and Development, \"Our Common Future\" (the Brundtland Report).", "Shift from Meadows: not ending growth, but development that respects the environment and ensures intra- and intergenerational social justice."],
      exam: "Quote the definition, then say what it changed compared with the Meadows report." },
    { id: "d-pillars", title: "The three pillars",
      line: "Environmental, social and economic pillars, drawn as three overlapping circles.",
      points: ["Environment + social: bearable. Environment + economic: viable. Social + economic: equitable. All three: sustainable."],
      trap: "Viable is environment + economic, equitable is social + economic. Students often swap them." },
    { id: "d-milestones", title: "From Brundtland to the SDGs",
      line: "From the 1980s, the term entered conferences, agreements, schools and everyday language.",
      points: ["1980 first use · 1987 Brundtland · 1988 IPCC · 1992 Rio (Agenda 21) · 1999 Global Compact · 2000 Millennium Development Goals · 2002 Johannesburg (Rio+10) · 2005 Kyoto in force · 2006 Stern Review · 2007 Nobel to the IPCC and Al Gore · 2012 Rio+20 · 2015 Paris Agreement and SDGs.", "SDGs: 17 goals and 169 targets, the 2030 Agenda, adopted by the 193 UN member states. Target 1.1: end extreme poverty (under $2.15 a day, now $3.00).", "Far off track: of 139 targets with enough data, only 15% are on track for 2030 (UN, 2026)."] }
  ] },
  { title: "Why it has not happened yet", cards: [
    { id: "d-obstacles", title: "Obstacles at three levels",
      line: "Macro (states and their cooperation), meso (businesses), micro (individuals).",
      points: ["Macro: international competition (strict standards make a country less attractive); weak commitments without enforcement.", "Meso: business models that depend on sales volumes; communication instead of action (greenwashing).", "Micro: budget and social constraints; no accessible alternative (e.g. transport)."],
      exam: "Organize the answer by level, with one example per obstacle." }
  ] }
  ] },

{ id: "ecology", n: 3, title: "Introduction to ecology", short: "Ecology", c: "var(--c5)",
  intro: "The vocabulary of scientific ecology, resilience and tipping points, and the Great Acceleration that may have opened the Anthropocene.",
  sections: [
  { title: "Basic concepts", cards: [
    { id: "e-ecology", title: "Ecology, ecosystem, biosphere",
      line: "Ecology studies interactions within ecosystems (biocenosis + biotope); the biosphere is the set of all ecosystems on Earth.",
      points: ["Ecology: the branch of biology that studies interactions among living beings and with their environment. Greek oikos (house) + logos (science); Ernst Haeckel, 1866. Scientific ecology, not political ecology.", "Ecosystem: living organisms and non-living elements (air, water, rocks, weather, sunlight) that interact. Arthur George Tansley, 1935. Examples: a forest, a river, a meadow.", "Biocenosis: the living beings in reciprocal dependence. Biotope: an area with fairly homogeneous conditions (light, rainfall, temperature, soil…) and enough resources for life.", "Biosphere: the thin envelope (~20 km) where life developed: upper lithosphere, hydrosphere and cryosphere, lower atmosphere. Eduard Suess, 1875."] },
    { id: "e-global", title: "Global ecology: Vernadsky (1926)",
      line: "The ecosystem concept works at every scale, so the biosphere is itself an ecosystem. Vladimir Vernadsky, \"The Biosphere\" (1926): father of global ecology and biogeochemistry.",
      points: ["The Vernadskian revolution: living matter is a geological force, comparable to natural forces (e.g. the Great Oxidation Event).", "Biogeochemical cycles: elements circulate between the living (bio) and the non-living (geo). Humanity now strongly disrupts some of them: it has become a major geological force."] }
  ] },
  { title: "Resilience and tipping points", widget: "basin", cards: [
    { id: "e-resilience", title: "Resilience versus tipping point",
      line: "Resilience: the capacity of an (eco)system to absorb a disturbance without a major change in structure, and to return to its initial state once it has gone.",
      points: ["Resilience depends on balancing loops that stabilize the key variables.", "Tipping point: a level of pressure beyond which the system reorganizes, often fast and non-linearly, and does not return even if the pressure is reduced.", "Beyond the threshold, the balance between amplifying and regulating loops breaks; the system shifts to a new equilibrium."],
      trap: "A tipping point is not just \"a lot of damage\": removing the pressure does not bring the system back." },
    { id: "e-climate", title: "Climate tipping elements and cascades",
      line: "The climate system (atmosphere, hydrosphere, cryosphere, lithosphere, biosphere) is resilient to warming, but only up to tipping points.",
      points: ["Tipping elements (Lenton et al., 2008): ecosystems (Greenland ice sheet, Amazon rainforest) or phenomena (Atlantic thermohaline circulation, Indian summer monsoon).", "Cascades: thresholds are hard to locate, and a domino effect cannot be ruled out from 1.5 to 2.0°C."],
      example: "Greenland melts → freshwater into the North Atlantic → slower thermohaline circulation (Wunderling et al., 2024).",
      exam: "The more warming, the higher the risk of several tipping events in quick succession." }
  ] },
  { title: "The Great Acceleration and the Anthropocene", widget: "accel", cards: [
    { id: "e-acceleration", title: "The Great Acceleration",
      line: "The sharp amplification of human-driven processes causing global environmental change in the industrial age, especially since 1950.",
      points: ["Socio-economic trends: population, real GDP, energy use, fertilizers, water use, dams, transport, telecommunications, tourism…", "Earth system trends: CO₂, methane and nitrous oxide, surface temperature, ocean acidification, fish capture, tropical forest loss, domesticated land…"] },
    { id: "e-anthropocene", title: "Holocene and Anthropocene",
      line: "Holocene: ~11,700 years of relative climatic stability. Anthropocene: a proposed new epoch in which human activities profoundly change the conditions of life on Earth.",
      points: ["The Holocene allowed agriculture and civilizations: environmental stability is a key factor of human development. Undisturbed, it would have lasted thousands more years.", "Anthropocene: coined in the 1980s by Eugene Stoermer, popularized in 2000 by Paul Crutzen. Not an official stratigraphic unit, but widely used by scientists.", "Hence the question: what level of change takes us out of a Holocene-like state? The planetary boundaries."] }
  ] }
  ] },

{ id: "bounds", n: 4, title: "Planetary boundaries, warming and biodiversity", short: "Planetary boundaries", c: "var(--pri)",
  intro: "The nine planetary boundaries and how many are crossed, the two core ones (warming and biodiversity), and what warming means for a business: cocoa.",
  sections: [
  { title: "The planetary boundaries", widget: "pb", cards: [
    { id: "b-question", title: "Planetary boundaries (Rockström et al., 2009)",
      line: "Nine quantified boundaries linked to Earth-system processes. Below them, a \"safe operating space\"; the further one is crossed, the higher the risk of lasting damage.",
      points: ["Why: the Holocene is the only state known to suit humanity. Meadows (1972) said the precise limits are unknown but exist; the Stockholm Resilience Centre team quantified them in 2009.", "1 Biodiversity loss (biosphere integrity) · 2 Global warming · 3 Biogeochemical cycles (nitrogen, phosphorus) · 4 Ocean acidification · 5 Ozone depletion · 6 Freshwater · 7 Land-use change · 8 Aerosols · 9 Novel entities (plastics, chemicals)."],
      trap: "The wording of the nine boundaries varies between reports: learn the processes, not one phrasing." },
    { id: "b-upstream", title: "Buffer zone and core boundaries",
      line: "A boundary is placed upstream of the tipping point, leaving a buffer (Steffen et al., 2015).",
      points: ["Green: safe operating space. Yellow: uncertainty, increasing risk. Red: high risk of serious impacts.", "The buffer covers uncertainty about the threshold and gives society time to react to early warnings.", "Core boundaries: global warming and biodiversity loss, connected to all the others (Steffen et al., 2015)."] },
    { id: "b-status", title: "Seven of nine boundaries are crossed",
      line: "2009: biodiversity, climate, nitrogen cycle. 2015: land-use change. 2022: novel entities. 2023: freshwater. 2025: ocean acidification.",
      points: ["Still within: ozone depletion and aerosols. We are close to a \"high-risk line\".", "Living conditions will change profoundly; the scale depends on our pressures: \"every tenth of a degree counts\"."],
      exam: "Learn the order of the crossings with their years: typical of the empirical facts the exam asks for." }
  ] },
  { title: "Global warming", cards: [
    { id: "b-weather", title: "Global warming: weather, figures, mechanism",
      line: "Weather is the state of the atmosphere at a moment; climate is its average over a long period (e.g. 30 years).",
      points: ["2018–2022: 1.17 ± 0.13°C above pre-industrial (1850–1900), rising about +0.26°C per decade.", "Economic activity emits GHG (fossil fuels, industry, land use) → more CO₂, methane, nitrous oxide → stronger greenhouse effect → higher temperatures. Consequences depend on the extent of warming (IPCC, 6th report)."],
      trap: "A cold winter does not disprove warming: a 5°C drop in a day is nothing, a 5°C drop in the average would be another world." }
  ] },
  { title: "Biodiversity loss", widget: "drivers", cards: [
    { id: "b-bio3", title: "Biodiversity: three types, a sixth extinction",
      line: "Genetic, species and ecosystem diversity are all falling because of human activity.",
      points: ["Extinction rate at least tens to hundreds of times the average of the last 10 million years, and accelerating: a sixth mass extinction.", "Consequences: less resilient ecosystems, disrupted pollination, fewer food resources, spread of diseases."] },
    { id: "b-drivers", title: "The five direct drivers (IPBES)",
      line: "Land- and sea-use change, direct exploitation of organisms, climate change, pollution, invasive alien species.",
      points: ["Indirect drivers behind them: demographic and sociocultural, economic and technological, institutions and governance, conflicts and epidemics.", "IPBES: natural ecosystems down 47% on average; about 25% of species threatened; wild mammal biomass down 82%."] }
  ] },
  { title: "Warming and business: cocoa", widget: "cocoa", cards: [
    { id: "b-cocoa", title: "Cocoa and Lindt & Sprüngli",
      line: "About 60% of the world's cocoa comes from Côte d'Ivoire and Ghana, where extreme weather spreads diseases and cuts harvests.",
      formula: "Global average temperature → (+) extreme weather → (+) viral diseases and fungi → (−) cocoa production → (−) cocoa price → (+) chocolate price → (−) chocolate consumption",
      points: ["Age of cocoa trees → (−) cocoa production. Temperature → (+) summer heat in consuming countries → (−) chocolate consumption.", "Lindt: \"Climate change is a strategic risk that requires action across our business\" (Climate Transition Plan, 2025). Cut its carbon footprint, hedge against cocoa price spikes, agroforestry, product innovation."],
      exam: "For any company, split measures into mitigation (cut its own emissions) and adaptation (protect supply, prices, products)." }
  ] }
  ] },

{ id: "social", n: 5, title: "The Doughnut, poverty and inequality", short: "Social challenges", c: "var(--c3)",
  intro: "The Doughnut adds a social floor to the planetary boundaries. Then poverty, absolute and relative, and inequality, with the ways they are measured.",
  sections: [
  { title: "The Doughnut model", widget: "doughnut", cards: [
    { id: "o-doughnut", title: "The Doughnut (Kate Raworth, 2012)",
      line: "Planetary boundaries plus social justice: an ecological ceiling not to exceed and a social foundation not to fall below. Between them, the \"safe and just space for humanity\".",
      points: ["Oxfam paper: \"A safe and just space for humanity: can we live within the doughnut?\"", "Social foundation (11, then 12, from Rio+20 priorities): food, health, education, income and work, peace and justice, political voice, social equity, gender equality, housing, networks, energy, water.", "Ecological ceiling (9): climate change, ocean acidification, chemical pollution, nitrogen and phosphorus loading, freshwater withdrawals, land conversion, biodiversity loss, air pollution, ozone depletion.", "Below the foundation: shortfall. Beyond the ceiling: overshoot."] },
    { id: "o-2025", title: "The Doughnut in 2025 (Doughnut 3.0)",
      line: "Seven of nine boundaries crossed, and shortfalls on every social dimension. Progress is \"modest\".",
      points: ["No country operates within the safe and just space.", "The richest 20% of countries (15% of people) cause over 40% of overshoot; the poorest 40% (42% of people) bear over 60% of shortfalls (Fanning and Raworth, 2025)."],
      exam: "Use these figures against the claim \"our economy has at least solved the main social problems\"." }
  ] },
  { title: "Poverty", widget: "living", cards: [
    { id: "o-poverty", title: "Poverty and absolute poverty",
      line: "Poverty: lacking the resources needed to live adequately. Absolute monetary poverty (extreme poverty): under US$3.00 a day in PPP (since May 2024, from $2.15).",
      points: ["Other thresholds: $4.20 and $8.30 a day. 2025: 10.1% of the world, about 831 million people; sharply down since 1950, still about 44% in Sub-Saharan Africa.", "Other definitions: multidimensional poverty (Amartya Sen), dependence on assistance (Georg Simmel), poverty intensity."],
      trap: "Absolute poverty ignores context: the same line everywhere, whatever a decent life costs there." },
    { id: "o-relative", title: "Relative poverty and the poverty line",
      line: "Poor if your standard of living is below 60% of the country's median: unable to buy what a normal life requires in that society (Eurostat, most of Europe).",
      points: ["France, 2024: median €2,228 a month, line €1,337, poverty rate 15.4%. Lower than in the early 1970s; fell sharply, then stabilized (Insee method changed in 1996).", "Most affected: single-parent families; least: older people and homeowners (Insee, Centre-Val de Loire, 2021, same in rural and urban areas)."],
      example: "Absolute = vital goods, whatever the context. Relative = essential goods for a decent life in a given society." },
    { id: "o-living", title: "Standard of living and consumption units",
      line: "Standard of living = household disposable income ÷ consumption units (CU). Everyone in the household has the same.",
      formula: "Disposable income = income − mandatory payments (income tax, CSG, CRDS…)\nCU: 1 for the first adult, 0.5 per other person aged 14+, 0.3 per child under 14\nStandard of living = disposable income ÷ CU",
      points: ["Income: earnings, asset income (interest, dividends, rents), pensions, unemployment and social benefits."],
      example: "2 adults and a 9-year-old: €3,000 − €300 = €2,700; CU = 1.8; standard of living €1,500, above the €1,337 line." }
  ] },
  { title: "Inequality", widget: "lorenz", cards: [
    { id: "o-ineq", title: "Inequality and its measures",
      line: "Poverty is about the bottom; inequality is about gaps across the whole distribution. Everyone can get richer while inequality rises.",
      formula: "Palma = income share of the top 10% ÷ income share of the bottom 40%\nGini: 0 = perfect equality, 1 = perfect inequality",
      points: ["Palma: France 1.08 (2019), United States 1.63 (2021).", "Gini: how far the Lorenz curve (cumulative income share by cumulative share of people) is from equality. France 0.292 (2019), United States 0.375 (2021)."] },
    { id: "o-paygap", title: "Gaps between groups: the gender pay gap",
      line: "France's private sector (2022): women earn 24% less across all hours, 15% less at equal hours, 4% less at equal hours and comparable jobs.",
      exam: "A decomposition: working time explains part, job differences another part, about 4% remains at equal hours and jobs." },
    { id: "o-why", title: "Inequality since 1980, and why it matters",
      line: "The top 10% income share has risen in most regions since 1980. Across rich countries, more unequal societies have worse health and social problems.",
      points: ["Around 2018: India ~55%, United States and Russia ~46–48%, China ~41%, Europe ~34% (lowest).", "Index: life expectancy, literacy, infant mortality, homicides, imprisonment, teenage births, trust, obesity, mental health, social mobility. USA and Portugal worst; Japan and the Nordics best."],
      trap: "A correlation across countries: it corroborates a link, it does not prove inequality causes every problem." }
  ] }
  ] },

{ id: "economy", n: 6, title: "Our economic model", short: "Economic model", c: "var(--c1)",
  intro: "What an economy, a market, capitalism and a market economy are, why growth divides sustainability thinkers, and four scenarios for France in 2050.",
  sections: [
  { title: "Four words not to confuse", widget: "words", cards: [
    { id: "c-economy", title: "Economy",
      line: "Greek oikos (house) + nomos (rule): household management. All activities that produce, store and distribute goods and services.",
      points: ["Several models exist (traditional, feudal, capitalism…): capitalism is one among others.", "\"Economics\" studies how economies work, with several schools of thought."] },
    { id: "c-market", title: "Market, market economy, planned and mixed economies",
      line: "A market: a place, physical or virtual, where actors exchange goods, capital or labour for money.",
      points: ["The abstract \"Market\": prices and quantities emerge from competitive supply and demand, the Market as an institution (Gomez, 2022).", "Market exchange is older than capitalism, and one way among others to get goods (own production, gift economy: give, receive, return).", "Market economy: supply and prices set by free market forces, not the state. Planned economy: the state decides output and prices. Mixed: both."] },
    { id: "c-capitalism", title: "Capitalism",
      line: "Market exchanges plus the possibility of investing money in the hope of making more money (Fulcher, 2015).",
      points: ["Merchant capitalism (17th century): English East India Company, joint-stock companies, stock exchanges.", "Industrial capitalism (early 19th century, English cotton mills): a bourgeoisie owning the means of production, and a proletariat.", "Its rise goes with GDP growth; some see a \"growth imperative\" inherent to it."],
      trap: "Markets alone are not capitalism: the defining addition is investing money to make more money." }
  ] },
  { title: "The growth debate", widget: "growth", cards: [
    { id: "c-gdp", title: "Growth: the pressure, and Meadows versus Brundtland",
      line: "World GDP was almost flat for 2,000 years, then exploded, above all after 1950, with the Great Acceleration.",
      points: ["Result: seven of nine boundaries crossed, shortfalls on every social dimension. Some actors adapt (chocolate), governments reform (energy), but change must scale up.", "Meadows (1972): a non-growing \"equilibrium\" of constant population and capital. Brundtland (1987): a new era of sustainable growth, seen as essential against poverty."] },
    { id: "c-four", title: "Four positions on growth",
      line: "Brown growth, green growth, selective growth, degrowth.",
      points: ["Brown: growth as now, fossil fuels, linear economy. Climate scepticism, economic libertarianism, techno-solutionism (\"Drill, baby, drill\").", "Green: growth decoupled from environmental pressure enough to stay within boundaries. Techno-optimism, economic liberalism, weak sustainability (OECD, 2011).", "Selective: growth differentiated by countries' wealth and by sectors. Techno-scepticism, reformist environmentalism, strong sustainability (Jackson, 2009).", "Degrowth: drop growth as a primary goal, or deliberately cut production and consumption where needed. Techno-criticism, anti-capitalism, strong sustainability (Latouche, 2024)."],
      exam: "Weak sustainability: natural capital can be replaced by produced capital; strong: critical natural capital cannot. (Terms on the slides; this gloss is ours.)" }
  ] },
  { title: "Four scenarios for 2050 (ADEME)", widget: "ademe", cards: [
    { id: "c-ademe", title: "ADEME's Transition(s) 2050",
      line: "Four contrasting paths to carbon neutrality for France, from sobriety to technology.",
      points: ["S1 Frugal generation: frugality chosen and imposed, local, low-tech, meat ÷3, mobility −⅓, little international cooperation, new prosperity indicators.", "S2 Regional cooperation: sharing economy, fairness, meat halved, mobility −17%, environmental taxation, qualitative growth.", "S3 Green technologies: technology rather than less consumption, meat −30%, demolish and rebuild, data centres ×10, targeted carbon tax, green growth.", "S4 Restoration gamble: mass consumption kept, nature a resource, bet on repair (carbon capture and storage), mobility +28%, carbon-based growth.", "Any scenario needs behaviour change: find the barriers (cost, habits, no alternative), reduce the friction (infrastructure, prices, rules, norms)."],
      exam: "Our reading, not the slides': S1 is closest to degrowth, S2 to selective growth, S3 to green growth, S4 bets on technology to keep carbon-based growth." }
  ] }
  ] },

{ id: "method", n: 7, title: "Building a cause tree (tutorial)", short: "Cause tree", c: "var(--c4)",
  intro: "The graded group exercise: explain the gender pay gap with a causal diagram, present it clearly, then corroborate or refute each link with reliable sources.",
  sections: [
  { title: "The gender pay gap", cards: [
    { id: "m-facts", title: "The facts",
      line: "Insee (2026): in 2024, women's average net wage income in the private sector was 21.8% lower than men's.",
      points: ["A gap between two averages: not every woman earns less than every man.", "It covers only people in employment. The gender overall earnings gap (GOEG), including those without a job, is higher: about 29.6% in France in 2023, over 40% in some countries."] },
    { id: "m-tree", title: "Cause tree",
      line: "A causal diagram that explains a social phenomenon or an observation: it maps the causes, not the consequences.",
      points: ["Start from the phenomenon (on the right), go back to its direct, then indirect causes.", "Each arrow carries a sign; each variable is a quantity that can rise or fall."] },
    { id: "m-steps", title: "The assignment, and presenting well",
      line: "Build (20 min: alone ~5, share ~5, diagram ~10), present (45 min, ~5 per group), test with evidence (20 min).",
      points: ["Evidence step: corroborate or refute the hypotheses; share one finding and one uncertainty.", "Presenting: overview first (\"the gap depends on four mechanisms…\"), understandable without the visual, say why each link is plausible, refer to other groups, answer briefly."] }
  ] },
  { title: "An example: homicides in the United States", widget: "homicide", cards: [
    { id: "m-homicide", title: "Explaining the US homicide rate",
      line: "2021: 6.8 homicides per 100,000 in the US, six times France's. The illustrative cause tree maps direct and indirect causes.",
      points: ["Unemployment → (+) poverty; share of low-paid jobs → (+) poverty; welfare system → (−) poverty.", "Poverty → (+) organised crime, (+) drug addiction, (+) homicides.", "Drug addiction → (+) organised crime and (+) homicides; organised crime → (+) homicides.", "Permissive gun legislation → (+) gun ownership → (+) homicides."] }
  ] },
  { title: "Corroborate or refute", cards: [
    { id: "m-corroborate", title: "Corroborate with reliable sources",
      line: "A causal link is rarely proved, but evidence makes it more or less plausible: corroborate or refute it, and mark each link corroborated, refuted or uncertain.",
      points: ["Trace each piece of information back to its primary source and check it.", "Reliable: statistics and polling institutes (Insee, ONS, Gallup), academic articles (Google Scholar), recognized books and publishers, established media (NYT, The Guardian, Le Monde), government sites (.gov, .gouv.fr).", "Unreliable: social media posts, personal blogs, conspiracy sites, pseudoscientific books and magazines."],
      example: "Studies on disinhibiting drugs, or a drug–crime correlation (Martel-Perron; Poullot et al., 2008), do not prove addiction causes homicides, but corroborate it." }
  ] }
  ] }
];
/* cards merged on Oct 24: a merged card counts as known if every card it replaced was known */
const LEARN_MERGED = {
  "s-course": ["s-course", "s-exam"], "s-heattrend": ["s-heattrend", "s-warming"], "s-system": ["s-system", "s-cld"],
  "s-feedback": ["s-feedback", "s-reinforce", "s-balance"], "s-measures": ["s-measures", "s-linear"],
  "d-carlowitz": ["d-carlowitz", "d-msy"], "d-principles": ["d-principles", "d-overused"], "d-meadows": ["d-meadows", "d-five", "d-carrying"],
  "d-method": ["d-method", "d-recos"], "d-milestones": ["d-milestones", "d-sdgs", "d-offtrack"],
  "e-ecology": ["e-ecology", "e-biosphere", "e-ecosystem"], "e-global": ["e-global", "e-vernadsky"], "e-resilience": ["e-resilience", "e-tipping"],
  "e-climate": ["e-climate", "e-cascade"], "e-anthropocene": ["e-anthropocene", "e-holocene"],
  "b-question": ["b-question", "b-pb"], "b-upstream": ["b-upstream", "b-core"], "b-weather": ["b-weather", "b-figures", "b-process"],
  "b-bio3": ["b-bio3", "b-sixth"], "b-cocoa": ["b-cocoa", "b-lindt"],
  "o-doughnut": ["o-doughnut", "o-dims"], "o-poverty": ["o-poverty", "o-absolute"], "o-relative": ["o-relative", "o-line", "o-drivers"],
  "o-ineq": ["o-ineq", "o-palma", "o-gini"], "o-why": ["o-trend", "o-why"],
  "c-market": ["c-market", "c-marketeco"], "c-gdp": ["c-gdp", "c-meadowsvbrund"], "c-ademe": ["c-ademe", "c-friction"],
  "m-steps": ["m-steps", "m-present"], "m-corroborate": ["m-corroborate", "m-sources"]
};
