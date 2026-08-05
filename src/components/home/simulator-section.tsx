import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const planningFactors = [
  "Room width, depth, and finished ceiling height",
  "Right- and left-handed player position and swing clearance",
  "Screen size, aspect ratio, setback, and enclosure depth",
  "Projector throw path, mounting location, and obstructions",
  "Impact protection across walls, ceiling, and adjacent openings",
  "Turf, hitting-surface thickness, and finished floor transitions",
  "Lighting, power, data, ventilation, and future service access",
];

function RoomDiagram() {
  return (
    <div aria-hidden="true" className="room-diagram">
      <div className="room-perspective">
        <div className="room-screen">IMPACT PLANE</div>
        <div className="room-player">PLAYER POSITION</div>
        <div className="room-line room-line-one" />
        <div className="room-line room-line-two" />
        <span className="room-measure room-measure-a">SWING ENVELOPE</span>
        <span className="room-measure room-measure-b">PROJECTION PATH</span>
        <span className="room-measure room-measure-c">ROOM DEPTH</span>
      </div>
      <div className="room-diagram-footer">
        <span>PLAYER</span>
        <span>SCREEN</span>
        <span>ROOM</span>
      </div>
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
                Screen size cannot be selected independently from the room.
                Player position changes the swing envelope. Enclosure depth
                affects usable room depth. Construction decisions made first
                can either protect the technology plan or constrain it.
              </p>
            }
            eyebrow="Room feasibility and planning"
            title="The right simulator starts with the room geometry."
            tone="dark"
          />
          <p className="simulator-index">PLANNING / 01</p>
        </div>

        <div className="simulator-content-grid">
          <RoomDiagram />
          <div className="simulator-capabilities">
            <p className="simulator-lead">
              Zarka Construction evaluates the space before the build scope is
              locked, bringing the player, screen, technology, protection, and
              finished room into one coordinated plan.
            </p>
            <ul>
              {planningFactors.map((factor) => (
                <li key={factor}>
                  <CheckIcon />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
            <p className="simulator-qualifier">
              Equipment purchasing and licensed trade work remain separate
              unless they are explicitly included in the confirmed project scope.
            </p>
            <div className="simulator-section-actions">
              <Link className="simulator-detail-link" href="/simulator-construction">
                Explore simulator room construction
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}