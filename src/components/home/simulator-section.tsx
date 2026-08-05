import Link from "next/link";

import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const planningFactors = [
  {
    title: "Swing freely with confidence",
    copy: "Player position, handedness, and the finished room dimensions shape the usable swing area.",
  },
  {
    title: "See a natural, immersive image",
    copy: "Screen proportions, viewing distance, and projection geometry need to work as one.",
  },
  {
    title: "Stay focused on the shot",
    copy: "Impact protection and enclosure details should feel integrated rather than added afterward.",
  },
  {
    title: "Move comfortably through the room",
    copy: "The stance area, turf transitions, doors, and circulation all affect how the space feels in use.",
  },
  {
    title: "Enjoy a finished environment",
    copy: "Lighting, trim, controlled surfaces, and concealed services help the technology recede into the room.",
  },
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
      <div className="room-diagram-footer">
        <span>PLAYER</span>
        <span>GAME</span>
        <span>SPACE</span>
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
                A room plays beautifully when its dimensions, player position,
                screen, surfaces, lighting, and technology have been considered
                together before construction begins.
              </p>
            }
            eyebrow="Room feasibility and planning"
            title="Why every great room starts with good planning."
            tone="dark"
          />
          <p className="simulator-index">PLANNING / 01</p>
        </div>

        <div className="simulator-content-grid">
          <RoomDiagram />
          <div className="simulator-capabilities">
            <p className="simulator-lead">
              Good planning makes the technical decisions feel invisible. The
              result is a room where you can step in, settle over the ball, and
              focus on the game.
            </p>
            <ul>
              {planningFactors.map((factor) => (
                <li key={factor.title}>
                  <CheckIcon />
                  <span>
                    <strong>{factor.title}</strong>
                    <small>{factor.copy}</small>
                  </span>
                </li>
              ))}
            </ul>
            <p className="simulator-qualifier">
              Equipment purchasing and licensed trade work remain separate
              unless explicitly included in the confirmed project scope.
            </p>
            <div className="simulator-section-actions">
              <Link className="simulator-detail-link" href="/simulator-construction">
                Explore how the room comes together
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
