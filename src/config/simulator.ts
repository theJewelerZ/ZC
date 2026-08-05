export type SimulatorImageSlot = {
  id: "planning" | "construction" | "enclosure" | "finish";
  src: string | null;
  alt: string;
};

export const simulatorImageSlots = [
  {
    id: "planning",
    src: null,
    alt: "Founder-owned photograph of Zarka evaluating player position and room conditions for a golf simulator environment",
  },
  {
    id: "construction",
    src: null,
    alt: "Founder-owned photograph of simulator-environment framing and specialty construction in progress",
  },
  {
    id: "enclosure",
    src: null,
    alt: "Founder-owned detail photograph of an impact screen, wall protection, ceiling protection, or turf system",
  },
  {
    id: "finish",
    src: null,
    alt: "Founder-owned wide photograph of a finished golf simulator environment ready for play",
  },
] as const satisfies ReadonlyArray<SimulatorImageSlot>;

export const simulatorProcess = [
  {
    title: "Understand the space and intended use",
    description:
      "Begin with the people who will play, the existing conditions, known equipment information, and the experience the environment should support.",
  },
  {
    title: "Define the simulator-environment scope",
    description:
      "Plan the player position, impact area, protection, turf, finish details, access, and any required coordination before work begins.",
  },
  {
    title: "Complete the agreed specialty work",
    description:
      "Carry out the documented Zarka scope with attention to framing, impact systems, protection, surfaces, carpentry, and finish quality as applicable.",
  },
  {
    title: "Review the completed environment",
    description:
      "Confirm the finished Zarka scope against the plan and identify any remaining equipment-provider or qualified-trade responsibilities.",
  },
] as const;

export const simulatorFaqs = [
  {
    question: "Can every room become a golf simulator space?",
    answer:
      "Not every room supports every player or equipment configuration. A room review considers dimensions, swing clearance, existing conditions, access, screen and projection relationships, and intended use before a construction scope is proposed.",
  },
  {
    question: "Does Zarka Construction sell launch monitors, projectors, or equipment packages?",
    answer:
      "Zarka Construction is not presented as an equipment dealer. The focus is the simulator environment and its defined construction scope. Equipment selection and purchasing remain separate unless a written scope expressly states otherwise.",
  },
  {
    question: "What types of settings can Zarka work within?",
    answer:
      "Simulator-environment work may be considered in homes, teaching studios, commercial golf spaces, entertainment venues, simulator businesses, country clubs, and training environments. Project fit and Zarka's exact responsibility are confirmed individually; the website does not represent Zarka as constructing an entire commercial facility.",
  },
  {
    question: "How are electrical and other licensed trades handled?",
    answer:
      "Projector, lighting, power, data, ventilation, and related requirements can be identified during simulator planning. Work requiring a qualified or licensed trade is handled separately or coordinated with an appropriate trade when included in the agreed project scope.",
  },
  {
    question: "Who is responsible for permits, architectural work, or engineering?",
    answer:
      "Those responsibilities depend on the project and are not assumed through this website. Any permit, architectural, engineering, or other professional requirement must be identified and assigned in the written project scope before work proceeds.",
  },
  {
    question: "Can the environment allow for future equipment changes?",
    answer:
      "Future products cannot be predicted, but accessible wiring paths, service clearances, mounting locations, and removable finish details can be considered when relevant to the agreed scope.",
  },
] as const;
