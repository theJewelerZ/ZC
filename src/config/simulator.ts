export type SimulatorImageSlot = {
  id: "planning" | "construction" | "enclosure" | "finish";
  src: string | null;
  alt: string;
};

export const simulatorImageSlots = [
  {
    id: "planning",
    src: null,
    alt: "Indoor golf simulator room being measured and planned for player and equipment clearances",
  },
  {
    id: "construction",
    src: null,
    alt: "Framing and finish carpentry in progress for a custom indoor golf simulator room",
  },
  {
    id: "enclosure",
    src: null,
    alt: "Impact screen, enclosure, and protective wall systems installed in a simulator room",
  },
  {
    id: "finish",
    src: null,
    alt: "Completed indoor golf simulator room with integrated turf, lighting, and finished trim",
  },
] as const satisfies ReadonlyArray<SimulatorImageSlot>;

export const simulatorProcess = [
  {
    title: "Understand the room",
    description:
      "Review dimensions, structure, access, intended users, and the equipment plan before construction decisions are locked in.",
  },
  {
    title: "Coordinate the system",
    description:
      "Align the screen, enclosure, protection, hitting area, projection, lighting, and required trade coordination around one room plan.",
  },
  {
    title: "Build and finish",
    description:
      "Complete the approved construction and specialty-installation scope with attention to access, protection, trim, and room integration.",
  },
  {
    title: "Review the completed space",
    description:
      "Confirm the built environment supports the planned equipment, use, maintenance access, and future service needs.",
  },
] as const;

export const simulatorFaqs = [
  {
    question: "Can every room become a golf simulator?",
    answer:
      "Not every room supports every player or equipment configuration. Ceiling height, room width and depth, swing clearances, structure, access, and projector geometry should be reviewed before a build scope is established.",
  },
  {
    question: "Does Zarka Construction supply the launch monitor and projector?",
    answer:
      "Zarka Construction focuses on the room-construction and specialty-installation scope. Technology selection and purchasing responsibilities are confirmed for each project rather than assumed.",
  },
  {
    question: "Why plan for both right- and left-handed players?",
    answer:
      "The hitting position and safe swing envelope can change when player orientation changes. Planning for the people who will actually use the room helps avoid a layout that works for only one intended player position.",
  },
  {
    question: "How are electrical and technology needs handled?",
    answer:
      "Projector, lighting, power, data, and equipment locations are coordinated with the room plan. Licensed trade work is handled separately or coordinated with qualified trade partners when required by the project.",
  },
  {
    question: "Can the room be designed for future equipment changes?",
    answer:
      "Future products cannot be predicted, but accessible wiring paths, service clearances, mounting locations, and removable finish details can be considered during planning when they are relevant to the approved scope.",
  },
] as const;
