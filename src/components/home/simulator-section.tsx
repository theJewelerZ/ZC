import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const planningFactors = [
  { title: "Support a comfortable swing", copy: "Player position, handedness, and finished room dimensions shape the usable swing area." },
  { title: "Coordinate the image with the room", copy: "Screen proportions, viewing distance, and known projection requirements need to be considered together." },
  { title: "Plan for off-center shots", copy: "Impact-screen construction, curtains, wall protection, and ceiling protection should address the anticipated use." },
  { title: "Create practical floor transitions", copy: "Stance areas, hitting surfaces, turf, doors, and adjacent flooring affect use and finished appearance." },
  { title: "Keep responsibilities visible", copy: "Equipment, qualified trades, permits, and specialty-construction responsibilities should be assigned before work proceeds." },
] as const;

function RoomDiagram() {
  return (
    <div aria-hidden="true" className="room-diagram">
      <div className="room-perspective">
        <div className="room-screen">THE GAME</div>
        <div className="room-player">YOUR POSITION</div>
        <div className="room-line room-line-one" />
        <div className="room-line room-line-two" />
        <span className="room-measure room-measure-a">SWING FREELY</span>
        <span className="room-measure room-measure-b">SEE EVERY SHOT</span>
        <span className="room-measure room-measure-c">ENJOY THE ROOM</span>
      </div>
      <div className="room-diagram-footer"><span>PLAYER</span><span>GAME</span><span>SPACE</span></div>
    </div>
  );
}

export function SimulatorSection() {
  return (
    <section className="section simulator-section" id="planning">
      <div className="site-container">
        <div className="simulator-heading-grid">
          <SectionHeading
            description={
              <p>
                A strong simulator environment depends on the room dimensions,
                player position, impact area, protection, surfaces, lighting,
                and known technology requirements being considered together.
              </p>
            }
            eyebrow="Room evaluation and planning"
            title="Why every strong simulator environment starts with careful planning."
            tone="dark"
          />
          <p className="simulator-index">PLANNING / 01</p>
        </div>

        <div className="simulator-content-grid">
          <RoomDiagram />
          <div className="simulator-capabilities">
            <p className="simulator-lead">
              Planning cannot guarantee every outcome, but it can identify
              conflicts early, clarify responsibilities, and support a
              simulator space that feels considered rather than improvised.
            </p>
            <ul>
              {planningFactors.map((factor) => (
                <li key={factor.title}>
                  <CheckIcon />
                  <span><strong>{factor.title}</strong><small>{factor.copy}</small></span>
                </li>
              ))}
            </ul>
            <p className="simulator-qualifier">
              Zarka&apos;s scope does not include equipment sales, architectural
              or engineering services, permit authority, or responsibility for
              an entire facility. Responsibilities are confirmed in writing.
            </p>
            <div className="simulator-section-actions">
              <Link className="simulator-detail-link" href="/simulator-construction">
                Explore the specialist scope <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
