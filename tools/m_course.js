/* =====================================================================
   COURSE CONTENT — Fundamentals of Management and Organizations (BBA1, S1).
   Written from the four lectures and tutorials 1 and 2, reworded, then compacted (Oct 24):
   every definition, author, date, figure and study kept, redundant cards merged.
   Each card: title, line (the idea in one line), points, formula, example, trap, exam.
   ===================================================================== */
const COURSE = [
{ id: "org", n: 1, title: "Organizations, management and theories", short: "Organizations", c: "var(--c1)",
  intro: "What organizational behavior studies, why theories beat intuition, what makes a social arrangement an organization, and how the schools of management answered one question: how do we get controlled performance?",
  sections: [
  { title: "What the course is for", cards: [
    { id: "o-problem", title: "A people-related problem",
      line: "A problem is a gap between the desired outcome and the actual outcome. The course gives you tools to solve the ones caused by people.",
      points: ["1. Define the problem (the gap, stated precisely). 2. Identify its likely causes. 3. Generate recommendations.", "At every step, use theories and evidence, not gut feeling."],
      example: "Since a team went hybrid, output per full-time employee fell about 10%. The problem is the drop below target. \"People work from home\" is a possible cause, not the problem; others: skill gaps, low motivation, burnout, weak onboarding, meeting overload, poor leadership.",
      trap: "Stating a cause or a solution as the problem (\"the problem is remote work\") closes the diagnosis before it starts.",
      exam: "For any case question, write the three steps explicitly: problem, causes, theory-based recommendations." },
    { id: "o-ob", title: "Organizational behavior: six disciplines, three levels",
      line: "OB studies the actions, reactions and attitudes of individuals at work, in response to their environment, the rules and their social interactions.",
      points: ["It asks how people behave in organizations, and how organizations use that knowledge to reach their goals.", "Six disciplines: psychology (personality, motivation, emotions, perception), social psychology (influence, conformity, group dynamics, biases), sociology (norms, roles, power, culture), anthropology (cultures, rituals, symbols, meaning), cognitive sciences (attention, memory, information processing), philosophy and ethics (values, morality, justice).", "Three levels of analysis: individual (personality, values, perception, motivation), group or team (roles, coordination, norms, collective decisions), organization (structure, rules, culture, power, responsibility)."],
      exam: "Why managers need OB: organizations are made of people, and common sense about behavior is often wrong. A strong diagnosis names the level: individual, team or organization." }
  ]},
  { title: "Why theories?", cards: [
    { id: "o-intuition", title: "From intuition to evidence, and why several theories",
      line: "Our assumptions feel obvious but are often flawed. Theory turns an intuition into something we can test.",
      formula: "Intuition  →  Theory  →  Hypothesis  →  Evidence\n\"This seems true\" → structured explanation of how and why → testable prediction → data to judge it and refine the theory",
      points: ["Theories organize ideas, explain why things happen and generate testable hypotheses: they help understand, predict and influence behavior.", "Different theories give different diagnoses, so different solutions. Not washing hands: cleanliness not valued (values, Schwartz, 1992); never learned or modeled (social learning, Bandura, 1977); never reinforced (Skinner, 1953); they forget (attention and prospective memory, McDaniel & Einstein, 2000)."],
      example: "\"To motivate employees, give them a raise\", \"harmony is good for teams\", \"people need strong hands-on leaders\": each sounds right, each is questionable once you look at the evidence.",
      trap: "One favorite theory for everything. A good diagnosis tests several explanations against the facts of the case." },
    { id: "o-tpb", title: "Example: the Theory of Planned Behavior (Ajzen, 1991)",
      line: "Used in class on handwashing at work: behavior depends on what people think of it, what others expect, and whether they can easily do it.",
      points: ["Attitude: do employees think handwashing is important?", "Subjective norm: do they think it is expected of them?", "Perceived control: can they wash their hands easily (soap and water available)?"],
      example: "If soap is missing, a hygiene poster will not help: the barrier is control, not attitude." }
  ]},
  { title: "What is an organization?", widget: "orgtest", cards: [
    { id: "o-def", title: "Definition: controlled performance, collective goals",
      line: "An organization is a social arrangement for achieving controlled performance in pursuit of collective goals.",
      points: ["Not only companies: associations, universities, NGOs, public administrations, a family running a project. Every company is an organization; not every organization is a company.", "Different goals, different performance: financial performance, well-being, societal impact (a hospital, a start-up and an NGO perform differently).", "\"Controlled\": individuals also pursue their own goals, which can get in the way. Organizing channels individual efforts toward the common goal."],
      example: "In a student association, one member wants a CV line, another wants to party, the association wants a successful event: roles, rules and coordination keep everyone on the shared goal.",
      exam: "Quote the definition word for word: social arrangement, controlled performance, collective goals." },
    { id: "o-five", title: "Five criteria of an organization",
      line: "Common goals, coordination, roles, rules or norms, and a minimum of continuity.",
      points: ["Common goal(s): why are we gathering?", "Coordination: how is the work organized?", "Roles: who does what, who decides?", "Rules or norms: what is expected, allowed or forbidden?", "(Minimum) continuity: does it last beyond the moment and leave a mark?"],
      exam: "To decide whether something is an organization, test the five criteria one by one." },
    { id: "o-crowd", title: "Crowd, group, team, organization",
      line: "Each step adds something: co-presence, then interaction, then a common task, then stable institutionalized coordination.",
      points: ["Crowd: co-presence only. Group: interactions and a sense of belonging. Team: a common task or goal, and interdependence. Organization: common goals, coordination, roles, rules, continuity."],
      example: "People waiting for a bus: a crowd. Friends who meet every Friday: a group. Four students preparing one presentation: a team. The student association with a board, roles and statutes, running events every year: an organization.",
      trap: "A team becomes organizational only when its goals need relatively stable, institutionalized coordination. A one-off team is not yet an organization." }
  ]},
  { title: "Schools of management thought", widget: "schools", cards: [
    { id: "o-schools", title: "Six schools, one question",
      line: "Every school answers the same question in its era: how do we manage effectively, that is, get controlled performance?",
      points: ["Administrative, 1910s: Fayol. Bureaucracy, 1920s: Weber. Efficiency, 1920s: Taylor, Ford.", "Humanistic, 1930s–1960s: Mayo, Herzberg, McGregor. Contingency, 1950s–1980s: Woodward, Chandler, Lawrence & Lorsch, Mintzberg. Contemporary, 1980s–now: Drucker."],
      exam: "Four are developed in detail: bureaucracy, efficiency, humanistic, contingency. Know their key question, key idea and limits." },
    { id: "o-weber", title: "Bureaucracy approach (Weber)",
      line: "Key question: how can an organization run in a stable, predictable, continuous way? Answer: legal-rational authority and rule-based administration.",
      points: ["Three bases of legitimate authority: traditional (custom; a monarch), charismatic (devotion to the leader's qualities; a founder followers would follow anywhere), legal-rational (formal rules and the office; a tax inspector). Legal-rational is the basis of bureaucracy.", "Five traits: hierarchy of authority (it belongs to the position); division of labor and specialization; formal rules and procedures, not personal discretion; technical competence and merit; impersonality and impartiality, not favoritism."],
      exam: "Strength: predictability, continuity, less dependence on individuals. Gap: it says little about how people feel and behave." },
    { id: "o-taylor", title: "Efficiency approach: scientific management (Taylor, Ford)",
      line: "Key question: how can work be done as efficiently as possible? Answer: science finds the one best way, replacing rule-of-thumb methods.",
      points: ["Scientific analysis of work (methods, tools, conditions); scientific selection and training; managers plan, workers execute; small specialized tasks; performance-based incentives.", "Taylor developed scientific management; Ford adapted it to mass production on the assembly line."],
      trap: "Bureaucracy and efficiency both treat work as a technical system. What is missing is the human side." },
    { id: "o-human", title: "Humanistic approach and the Hawthorne experiments",
      line: "Key question: how can we improve performance by understanding the human side of work? Answer: performance is shaped by the social and psychological context.",
      points: ["Hawthorne (Mayo, 1920s, Western Electric): productivity rose when lights were brightened, and also when dimmed. Hawthorne effect: people change behavior when they know they are observed. Attention shifts to the social context of work.", "Social relationships (informal groups, peer norms), attitudes and morale (recognition, feelings about work), management and supervision (attention, support) drive effort.", "Authors: Mayo, Herzberg (two-factor theory, lecture 4), McGregor."],
      exam: "Use Hawthorne to show why the humanistic approach was born." },
    { id: "o-contingency", title: "Contingency approach",
      line: "There is no single best way to manage: an approach works when it fits the situation.",
      points: ["Situational factors: the task and nature of the work, the people, technology, strategy, the external environment.", "Authors: Woodward, Chandler, Lawrence & Lorsch, Mintzberg."],
      example: "Strict procedures suit a nuclear plant where errors are catastrophic; they would stifle a creative agency where the work changes every week.",
      exam: "Self-check: why might an approach that works in one organization fail in another? Contingency, plus one situational factor." }
  ]}
]},
{ id: "person", n: 2, title: "Personality, values and attitudes", short: "Personality", c: "var(--c2)",
  intro: "How people differ, how stable those differences are, how to measure personality and what tests can and cannot do. With tutorial 2: personality times situation gives behavior.",
  sections: [
  { title: "Values", widget: "schwartz", cards: [
    { id: "p-values", title: "Values, and how stable we are",
      line: "Values are abstract ideals that guide thinking and behavior across all situations. Personality and values are relatively stable; attitudes are more malleable.",
      points: ["Values explain attitudes, sources of motivation and behavior. Managers manage better when they understand them; employees find more meaning pursuing goals consistent with their values.", "Stable traits help predict behavior, match people to jobs, understand relationships. Attitudes can change, so managers can act on them directly."] },
    { id: "p-schwartz", title: "Schwartz's value theory, and one bonus for two",
      line: "Values are motivational: broad goals over time, on a circle where neighbors are compatible and opposites conflict.",
      points: ["Ten values: self-direction, stimulation, hedonism, achievement, power, security, conformity, tradition, benevolence, universalism. Four groups: openness to change, self-enhancement, conservation, self-transcendence.", "Adjacent values are complementary (achievement and power); bipolar values are incongruent (achievement and benevolence).", "The bonus dilemma: Andrea closed the biggest deal, Cameron spent hours onboarding colleagues. A manager who values achievement rewards Andrea; one who values benevolence rewards Cameron."],
      exam: "Value congruence makes joint decisions easier; value conflict explains disagreements between people both acting in good faith." }
  ]},
  { title: "Attitudes", cards: [
    { id: "p-att", title: "The three components of an attitude",
      line: "How we think, feel and intend to act toward a person, object or situation. Attitudes help predict behavior.",
      points: ["Cognitive: beliefs and evaluation (\"my supervisor is unfair\"). Affective: feelings (\"I feel angry with my supervisor\"). Behavioral intention (\"I am making plans to quit\")."],
      example: "Trigger: my supervisor promoted a colleague who deserved it less than I did." },
    { id: "p-four", title: "Four key workplace attitudes",
      line: "Job satisfaction, employee engagement, organizational commitment, perceived organizational support.",
      points: ["Job satisfaction: an emotional response to facets of the job, how much you like it. Linked to performance, OCB, motivation, lower turnover and stress, less CWB.", "Engagement: giving your all to the role, with urgency, focus, intensity, enthusiasm. Linked to customer loyalty, performance, well-being, financial results.", "Organizational commitment: identifying with the organization and its goals. Linked to retention and effort toward its goals.", "Perceived organizational support (POS): the belief that the organization values your contribution and cares about your well-being. Linked to commitment, satisfaction, OCB, performance, lower turnover."],
      trap: "Satisfaction = liking the job; engagement = energy put in; commitment = identifying with the organization; POS = how the organization treats you." },
    { id: "p-dissonance", title: "Cognitive dissonance",
      line: "The discomfort we feel when our beliefs, attitudes, values or behavior are inconsistent.",
      points: ["Reduce it by changing attitudes, behavior or both; by belittling the inconsistent behavior; or by adding consonant elements that outweigh it."],
      example: "An employee who values honesty joins an exaggerated sales pitch: \"lying is not that bad\" (change attitude), \"it was only once\" (belittle), \"I'm saving the project\" (consonant element)." }
  ]},
  { title: "Personality", cards: [
    { id: "p-def", title: "Personality and how to measure it",
      line: "A person's unique pattern of thoughts, feelings and behaviors, enduring across situations and time. Traits are its characteristics.",
      points: ["Determinants: genetics, environment, situation. At work, traits help predict how someone will act, what jobs they may be good at, and relationships.", "Psychometrics: standardized instruments (same questions, same conditions), so scores are testable and comparable; self-administered or given by a third party."],
      example: "Bob is achievement-oriented: the trait summarizes his behavior (diligent), predicts specific acts (on time, thorough) and explains them (hard tasks reward him)." },
    { id: "p-big5", title: "The MBTI versus the Big Five",
      line: "The MBTI sorts people into 16 types; the Big Five (Five Factor Model) scores five traits along a continuum and predicts behavior and performance well.",
      points: ["MBTI: E-I, S-N, T-F, J-P. Problems: either/or, not rooted in science, no predictive power for performance. Fine for self-reflection and talking about work preferences.", "Big Five: extraversion (social stimulation sought), emotional stability vs neuroticism (reactivity, stress resilience), openness to experience, conscientiousness (organized, disciplined, goal-oriented), agreeableness (cooperative, considerate)."],
      trap: "Never recommend the MBTI to select employees. Continuum, not types: the key contrast." },
    { id: "p-tipi", title: "The 10-item test used in class",
      line: "Rate ten pairs of traits from 1 (disagree strongly) to 7 (agree strongly). Items 2, 4, 6, 8 and 10 are reverse-scored.",
      formula: "Reverse score: R = 8 − answer\nExtraversion           = (Q1 + Q6R) / 2\nAgreeableness          = (Q2R + Q7) / 2\nConscientiousness      = (Q3 + Q8R) / 2\nEmotional stability    = (Q4R + Q9) / 2\nOpenness to experience = (Q5 + Q10R) / 2",
      example: "Take the test in Labs: the page shows each calculation with your own answers." },
    { id: "p-hilo", title: "Higher is not always better",
      line: "Each end of each trait has strengths and risks, and even helpful traits show diminishing returns.",
      points: ["Extraversion: sociable, takes the lead, may dominate / reflective, good listener, less visible. Emotional stability: calm, may be less vigilant / sensitive to threats, more anxious.", "Openness: creative, may favor novelty over practicality / practical, may resist change. Conscientiousness: reliable, may be rigid / spontaneous, may procrastinate. Agreeableness: cooperative, struggles with tough calls / assertive, more conflict.", "Too much of a good thing: conscientiousness has diminishing returns (especially in simple jobs); past a point emotional stability adds nothing; in sales, moderate \"ambiverts\" beat very low and very high extraverts (Grant, 2013)."] },
    { id: "p-predict", title: "What traits predict, and using tests to select",
      line: "Conscientiousness is the best personality predictor of job performance (Barrick & Mount, 1991). Tests are one source of evidence, never the sole basis.",
      points: ["Extraversion: better in social jobs. Openness: better in learning situations, more willing to learn a new job after downsizing. Extraversion + emotional stability + agreeableness: more likely to complete an overseas assignment.", "Limits: social desirability bias (people answer to look good, can fake); traits are tendencies, not guarantees. Add references, interviews, observation."],
      exam: "MBTI for discussion only; Big Five as one predictor among others (self-awareness, job fit, one input in selection); always add references, interviews, observation." }
  ]},
  { title: "Tutorial 2: personality at work", widget: "strength", cards: [
    { id: "p-tat", title: "Trait Activation Theory and situation strength",
      line: "Personality × situation → behavior (Tett & Burnett, 2003). Traits are tendencies; situational cues decide which ones show.",
      points: ["The situation makes some traits relevant, and can facilitate, constrain or channel how they are expressed.", "Situation strength: how far task, social and organizational cues dictate behavior. Weak (unclear rules, several acceptable ways, e.g. open brainstorming): personality has room. Strong (clear rules, narrow range, e.g. strict exam rules): people behave alike.", "Strong situations have the four Cs: clarity, consistency, constraints, consequences."],
      example: "A highly agreeable analyst rarely shows it in solo reporting, but it becomes visible (and useful) when she mediates a client conflict.",
      exam: "Personality predicts without determining behavior: traits show only when the situation activates them, and strong situations leave little room." }
  ]}
]},
{ id: "decide", n: 3, title: "Decision-making and biases", short: "Decisions", c: "var(--c3)",
  intro: "How we process information, when intuition can be trusted, the biases that distort judgment, how we perceive and explain others, how groups bend our judgment, and the rational and bounded models.",
  sections: [
  { title: "What a decision is", cards: [
    { id: "d-def", title: "Decision-making",
      line: "Choosing a course of action to deal with a problem or an opportunity: a truly distinctive part of a manager's job.",
      points: ["Drucker: a decision is a judgment, rarely between right and wrong, at best between \"almost right\" and \"probably wrong\".", "More complex when multidimensional (tasty, healthy and cheap) and when there are many choices."] }
  ]},
  { title: "System 1 and System 2", widget: "puzzles", cards: [
    { id: "d-sys", title: "Two ways of thinking",
      line: "System 1: automatic, fast, effortless, feels involuntary. System 2: attentional, slow, effortful, feels like a choice.",
      points: ["Under time pressure and cognitive depletion (suppressing emotions, impressing people, acting against your personality, stress, multitasking), System 2 is harder to activate.", "Why we rely on System 1: evolution (speed helped survival), efficiency (the brain saves energy), socialization (norms absorbed from family, school, culture, media)."],
      example: "Bat and ball cost $1.10, the bat costs $1.00 more. System 1 says 10 cents; System 2 checks: 0.10 + 1.10 = 1.20. The ball costs 5 cents (0.05 + 1.05 = 1.10)." },
    { id: "d-intuition", title: "When intuition works (Dane et al., 2012)",
      line: "When BOTH hold: the task is non-decomposable, and the decision maker has high domain expertise.",
      points: ["Non-decomposable: hard to break into steps, you need the whole pattern. Expertise: long experience has built meaningful patterns.", "Expert intuition grows through extensive experience, repeated exposure to patterns, deliberate practice, frequent informative feedback."],
      example: "An experienced surgeon diagnosing a torn ligament after ten seconds of bending a knee.",
      trap: "\"Does intuition work?\" It depends on the two conditions. A novice's gut feeling on a task that can be broken into steps is not reliable." }
  ]},
  { title: "Decision biases", widget: "framing", cards: [
    { id: "d-bias", title: "Cognitive biases, and how to reduce them",
      line: "A systematic, often unconscious tendency in thinking that distorts judgments and decisions.",
      points: ["Systematic means predictable: managers can design processes against them.", "Remedies: be aware of your biases, get more eyes on the problem, use System 2 for important decisions."],
      exam: "For a biased decision in a case: name the bias, explain the mechanism, give a remedy applied to the case." },
    { id: "d-confirm", title: "Confirmation and overconfidence",
      line: "Confirmation bias: seeking, interpreting and remembering information that confirms what we already believe, discounting contrary evidence. Overconfidence: overestimating the accuracy of our judgments, knowledge or abilities.",
      points: ["Fewer than 5% of MBA students expect to be below the median; 94% of professors think they are better than average; small-business owners give small businesses a 50% success rate, and themselves 90%."],
      example: "A manager convinced a new hire is weak notices every mistake and forgets every success (confirmation)." },
    { id: "d-anchor", title: "Anchoring and availability",
      line: "Anchoring: relying too heavily on a first piece of information and adjusting too little, even when it is arbitrary. Availability: judging likelihood or importance by how easily examples come to mind.",
      points: ["Recent, vivid or emotional events come to mind easily: we overestimate them and underestimate common, forgettable ones."],
      example: "Told about a 300 km river, students estimated the Mississippi shorter than those told about a 3,000 km river (anchoring). Motor-vehicle accident or opioid overdose? People answer with what comes to mind first; a manager rates the year on last week's mistake (availability)." },
    { id: "d-frame", title: "Loss aversion and framing",
      line: "A loss weighs about twice as much as an equal gain. Framing: the same information leads to different decisions depending on how it is presented.",
      points: ["Gain frame (\"saves 200 lives\"): risk-averse, 72% chose the sure treatment.", "Loss frame (\"400 people will die\"): risk-seeking, 78% chose the gamble. Same outcomes, different frame: loss aversion at work."],
      exam: "Rule: people take more risk when information is framed as losses." },
    { id: "d-sunk", title: "Sunk cost, escalation, action bias",
      line: "Sunk cost fallacy: letting past, unrecoverable investments drive a current decision, which can lead to escalation of commitment to a failing course of action.",
      points: ["Action bias: favoring action over inaction, even when doing nothing would be better."],
      example: "\"We've already spent €2 million on this software, we can't stop now\", though every new test shows it will not work." }
  ]},
  { title: "Social perception", cards: [
    { id: "d-perc", title: "Social perception and its biases",
      line: "Perception: how we interpret our surroundings. Social perception: how we form impressions and judge others from what we observe. It differs from reality, which creates biases.",
      points: ["Hiring: first impressions and stereotypes (\"similar background, must be a good fit\").", "Halo effect: one overall impression colors specific ratings (\"she communicates confidently, so her work must be excellent\"). Contrast effect: after an outstanding employee, a solid one looks poor.", "Leadership stereotypes: the same firm instructions are \"decisive\" from a man and \"bossy\" from a woman."] }
  ]},
  { title: "Attribution theory", widget: "kelley", cards: [
    { id: "d-attr", title: "Three causal dimensions",
      line: "Explaining behavior, we judge whether its cause is internal or external, stable or unstable, controllable or not.",
      points: ["Internal (dispositional, the person) vs external (the situation); stable (enduring) vs unstable (varies); controllable vs uncontrollable."] },
    { id: "d-fae", title: "Self-serving bias and the fundamental attribution error",
      line: "Self-serving bias: our successes are internal, our failures external. Fundamental attribution error: we overestimate internal causes of others' failures (and put their successes down to luck).",
      points: ["\"I passed because I'm smart; I failed because the test was hard.\" Others: \"they are lazy\", \"they were lucky\".", "Wrong attribution, wrong action: underperformance read as lack of effort → punishment, lack of ability → demotion; read as task difficulty → training, new competitors → new strategy."] },
    { id: "d-kelley", title: "Kelley's model: person or situation?",
      line: "Three questions decide between an internal and an external attribution: distinctiveness, consensus, consistency.",
      formula: "Distinctiveness: does the person behave differently in other situations?\nConsensus:       do other people behave the same way in this situation?\nConsistency:     does the person always act this way in this situation?\n\nHigh distinctiveness + high consensus + low consistency  →  EXTERNAL\nLow distinctiveness  + low consensus  + high consistency →  INTERNAL",
      example: "Peter, a top sales rep for three years, has a bad quarter: reports still excellent (high distinctiveness), most reps' sales also fell (high consensus), past performance high (low consistency). External.",
      trap: "Distinctiveness: same person, other situations. Consensus: other people, same situation. Students often swap them." }
  ]},
  { title: "Groups and social influence", cards: [
    { id: "d-teams", title: "Team decisions: assets, liabilities, protections",
      line: "Teams do better on complex tasks and bring more ideas, information and creativity; they do worse on simple tasks and cost time.",
      points: ["Liabilities: time, conflict, social influence that hinders the decision. Diverse groups bring more information, perspectives and alternatives.", "Protections: be aware of social influence, collect independent judgments before discussion, assign a devil's advocate or external expert, encourage dissent, leaders do not signal a preference early, generate multiple alternatives."] },
    { id: "d-asch", title: "Asch (conformity) and Milgram (obedience)",
      line: "Asch: asked which line matches a reference, many gave the obviously wrong answer after a unanimous group did. Milgram: told to keep going, participants gave what they believed were painful shocks to an actor.",
      points: ["Conformity: adjusting your judgment to the group, even against clear evidence.", "Obedience: following an authority figure's orders against your own conscience."],
      trap: "Asch = pressure from peers (conformity); Milgram = pressure from an authority (obedience)." },
    { id: "d-groupthink", title: "Groupthink",
      line: "The pressure for consensus discourages dissent and critical evaluation: keeping agreement matters more than evaluating alternatives.",
      points: ["Relevant information and alternatives are overlooked, and members find it hard to disagree."] }
  ]},
  { title: "Decision models", cards: [
    { id: "d-simon", title: "The rational model, and Simon's bounded rationality",
      line: "Rational model, four stages: identify the problem or opportunity, generate alternatives, evaluate and select, implement and evaluate.",
      points: ["Simon: limited time, information and cognitive capacity, so decision makers consider a manageable set of options and stop once one is good enough (satisficing)."],
      exam: "\"Can we always decide rationally?\" No: bounded rationality. Satisfice, and keep System 2 effort for important decisions." }
  ]}
]},
{ id: "motiv", n: 4, title: "Motivation and engagement", short: "Motivation", c: "var(--c4)",
  intro: "What motivation is, the theories that explain it (needs, self-determination, two factors, job design, goals, fairness) and what managers can do with each.",
  sections: [
  { title: "What motivation is", cards: [
    { id: "m-def", title: "Three dimensions; intrinsic and extrinsic",
      line: "Motivation has a direction (what you try to achieve), an intensity (how hard) and a persistence (how long). Extrinsic: driven by outcomes separate from the activity. Intrinsic: by the activity itself.",
      points: ["Extrinsic: less stable effort, rewards lose power, attention on the reward (and shortcuts); effective for short-term compliance.", "Intrinsic: self-sustaining effort, deeper engagement, learning, well-being, persistence. Most real motivation mixes both."],
      example: "Going to class for the grade (extrinsic) or out of curiosity (intrinsic)." }
  ]},
  { title: "Maslow", cards: [
    { id: "m-maslow", title: "Maslow's hierarchy of needs (1954), 70 years on",
      line: "Five needs in a set order: physiological, safety, belonging and love, esteem, self-actualization.",
      points: ["Basic: physiological (food, water, warmth, rest), safety. Psychological: belonging, esteem (prestige, accomplishment). Self-fulfillment: self-actualization.", "Research confirms each need contributes independently to well-being, across cultures; it does not confirm the hierarchy: people pursue higher goals with basic needs unmet."],
      example: "A student short of money and sleep who still pours energy into a project they believe in.",
      exam: "Main criticism: the order. The needs matter; the strict hierarchy does not hold." }
  ]},
  { title: "Self-Determination Theory", widget: "continuum", cards: [
    { id: "m-sdt", title: "Three basic psychological needs",
      line: "Competence, autonomy and relatedness. When work satisfies them, motivation, performance and well-being follow (Deci, Olafsen & Ryan, 2017).",
      points: ["Competence: feeling capable and effective. Autonomy: freedom and discretion over what and how. Relatedness: feeling connected, part of a group."] },
    { id: "m-cont", title: "The internalization continuum (Ryan & Deci, 2000)",
      line: "Extrinsic motivation runs from controlled to autonomous.",
      points: ["Amotivation: no driver (\"I don't see why I'm doing this\").", "External regulation: rewards, punishments, being forced (external). Introjection: guilt, shame, ego, approval (somewhat external).", "Identification: personal value and usefulness (somewhat internal). Integration: full fit with values and identity (internal).", "Intrinsic motivation: the activity itself is interesting or enjoyable (internal)."],
      example: "\"I answer calls because I'm paid and monitored\": controlled. \"Because helping callers matters to me\": autonomous (identified or integrated).",
      exam: "Can extrinsic motivation be autonomous? Yes: identification and integration." },
    { id: "m-sdt-mgr", title: "What managers can do",
      line: "Build a context that supports each need. Autonomy is the bridge from guilt-driven to autonomous commitment.",
      points: ["Competence: resources, time, contacts, coaching. Relatedness: fun and camaraderie. Autonomy: empower, delegate meaningful tasks.", "Autonomy-supportive supervision: meaningful choice, acknowledging the person's view, minimal control. Controlling supervision undermines autonomy.", "Informational feedback (\"I liked how you structured the argument\") supports competence and autonomy; no feedback gives little; controlling feedback (\"do it exactly this way\") undermines autonomy."],
      example: "Gmail came out of Google's freedom for side projects: competence, autonomy, relatedness → intrinsic or integrated motivation, creativity, persistence." }
  ]},
  { title: "Designing motivating jobs", widget: "jcm", cards: [
    { id: "m-herz", title: "Herzberg's two-factor theory",
      line: "Better hygiene factors reduce dissatisfaction but do not create motivation. Motivators do.",
      points: ["Motivators: achievement, recognition, the work itself, advancement, growth.", "Hygiene factors: relations with peers, company policies, workspace, working conditions, salary, status, security, supervision."],
      trap: "Salary is a hygiene factor: a raise can remove dissatisfaction without motivating anyone." },
    { id: "m-jcm", title: "The Job Characteristics Model (Hackman & Oldham)",
      line: "Five core job dimensions create three psychological states, which lead to motivation, satisfaction and effectiveness.",
      points: ["Skill variety, task identity (a whole piece of work), task significance (affects others) → experienced meaningfulness. Autonomy → responsibility for outcomes. Feedback (from the work itself) → knowledge of results.", "Outcomes: intrinsic motivation, growth satisfaction, job satisfaction, work effectiveness.", "Moderators (not everyone wants all five): knowledge and skill, growth need strength, context satisfactions (pay, colleagues, supervision)."],
      exam: "Job enrichment: let a warehouse picker handle a client's whole order (task identity) and see the client's rating (feedback)." }
  ]},
  { title: "Goal setting", cards: [
    { id: "m-goal", title: "Goal-setting theory (Locke & Latham)",
      line: "Specific, difficult goals beat vague, easy or \"do your best\" goals. Asked to do their best, people do not.",
      points: ["Mediators (why): direction of attention, effort, persistence, strategies. Moderators (when): ability, resources, goal commitment, feedback.", "Performance goals target a result (secure 3 new clients this month); learning goals target skills (handle objections confidently). The choice depends on task complexity and experience.", "SMART: Specific, Measurable, Achievable, Relevant, Timely."],
      example: "\"I'll study very hard\" becomes: \"By Sunday 6 pm, I will answer all lecture 3 self-check questions in writing and score at least 80% on the decisions quiz.\"" }
  ]},
  { title: "Fairness", widget: "equity", cards: [
    { id: "m-equity", title: "Equity theory",
      line: "People compare their outcomes-to-inputs ratio with a referent's. A gap creates tension they are motivated to reduce.",
      formula: "My outcomes / My inputs   vs   Other's outcomes / Other's inputs\nOutcomes: pay, promotion, recognition, flexibility\nInputs:   effort, skill, experience, time",
      points: ["Six ways to reduce inequity: change inputs, change outcomes (ask for a raise), distort perceptions of self, distort perceptions of others, change referent, leave the field."],
      example: "The team earns $62–65k: offering the favorite candidate $70k may be fair to them and still trigger inequity among current analysts." },
    { id: "m-justice", title: "Organizational justice",
      line: "The overall perception of fairness at work has three parts.",
      points: ["Distributive: fair outcomes (pay, promotion, recognition, workload). \"I got the raise I deserved.\"", "Procedural: fair process (voice, consistency, unbiased decisions, accurate information). \"I had input and a good explanation.\"", "Interactional: respect, dignity, adequate explanations. \"My supervisor was kind when telling me.\""] }
  ]}
]}
];
/* cards merged on Oct 24: a merged card counts as known if every card it replaced was known */
const LEARN_MERGED = {
  "o-ob": ["o-ob", "o-disc", "o-levels"], "o-intuition": ["o-intuition", "o-many"], "o-def": ["o-def", "o-goals", "o-control"],
  "o-weber": ["o-weber-auth", "o-weber"], "o-human": ["o-hawthorne", "o-human"],
  "p-values": ["p-stable", "p-values"], "p-schwartz": ["p-schwartz", "p-bonus"], "p-def": ["p-def", "p-psycho"], "p-big5": ["p-mbti", "p-big5"],
  "p-hilo": ["p-hilo", "p-toomuch"], "p-predict": ["p-predict", "p-select"], "p-tat": ["p-tat", "p-strength"],
  "d-sys": ["d-sys", "d-when1"], "d-bias": ["d-bias", "d-fix"], "d-confirm": ["d-confirm", "d-over"], "d-anchor": ["d-anchor", "d-avail"],
  "d-frame": ["d-loss", "d-frame"], "d-sunk": ["d-sunk", "d-action"], "d-perc": ["d-perc", "d-person"], "d-fae": ["d-ssb", "d-fae"],
  "d-teams": ["d-teams", "d-prevent"], "d-asch": ["d-asch", "d-milgram"], "d-simon": ["d-rational", "d-simon"],
  "m-def": ["m-def", "m-ie"], "m-maslow": ["m-maslow", "m-maslow2"], "m-jcm": ["m-jcm", "m-mod"], "m-goal": ["m-goal", "m-goal2", "m-smart"]
};
