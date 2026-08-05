import Image from "next/image";

import type { SimulatorImageSlot } from "@/config/simulator";

type SimulatorMediaProps = {
  slot: SimulatorImageSlot;
  label: string;
};

export function SimulatorMedia({ slot, label }: SimulatorMediaProps) {
  if (slot.src) {
    return (
      <figure className="simulator-media simulator-media-image">
        <Image
          alt={slot.alt}
          fill
          sizes="(max-width: 800px) calc(100vw - 40px), 46vw"
          src={slot.src}
        />
      </figure>
    );
  }

  return (
    <div aria-hidden="true" className="simulator-media simulator-media-schematic">
      <div className="simulator-media-grid" />
      <div className="simulator-media-plane" />
      <div className="simulator-media-path" />
      <span>{label}</span>
      <small>ROOM / SYSTEM / FINISH</small>
    </div>
  );
}
