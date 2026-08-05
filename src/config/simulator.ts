export type SimulatorImageSlot = {
  id: "planning" | "construction" | "enclosure" | "finish";
  src: string | null;
  alt: string;
};

export const simulatorImageSlots = [
  { id: "planning", src: null, alt: "Founder-owned photograph of an indoor golf simulator room being planned" },
  { id: "construction", src: null, alt: "Founder-owned photograph of a custom golf simulator room taking shape" },
  { id: "enclosure", src: null, alt: "Founder-owned photograph of an integrated impact environment in a simulator room" },
  { id: "finish", src: null, alt: "Founder-owned photograph of a finished indoor golf simulator room ready for play" },
] as const satisfies ReadonlyArray<SimulatorImageSlot>;

export const simulatorProcess = [
  { title: "Understand how you want to play", description: "Begin with the people, the space, the equipment you are considering, and the experience the finished room should create." },
  { title: "Plan the room around the game", description: "Bring the player, screen, surfaces, projection, lighting, protection, and access into one considered room plan." },
  { title: "Build with purpose", description: "Complete the approved construction and specialty work so the craft supports the room without competing with it." },
  { title: "Prepare the space for play", description: "Review the finished environment against the plan, technology requirements, access, and intended use." },
] as const;

export const simulatorFaqs = [
  {
    question: "Can every room become a golf simulator?",
    answer: "Not every room supports every player or equipment configuration. A room review considers dimensions, swing clearance, structure, access, screen and projection relationships, and how the space should feel in use before a build scope is established.",
  },
  {
    question: "Does Zarka Construction supply the launch monitor and projector?",
    answer: "Zarka Construction focuses on planning and building the room where the technology will perform. Equipment selection and purchasing responsibilities are confirmed for each project rather than assumed.",
  },
  {
    question: "Why plan for both right- and left-handed players?",
    answer: "The hitting position and comfortable swing area can change with player orientation. Planning around the people who will use the room helps create an experience that feels natural for its intended players.",
  },
  {
    question: "How are electrical and technology needs handled?",
    answer: "Projector, lighting, power, data, and equipment locations are coordinated with the room plan. Licensed trade work is handled separately or coordinated with qualified trade partners when required by the project.",
  },
  {
    question: "Can the room be designed for future equipment changes?",
    answer: "Future products cannot be predicted, but accessible wiring paths, service clearances, mounting locations, and removable finish details can be considered when relevant to the approved scope.",
  },
] as const;
