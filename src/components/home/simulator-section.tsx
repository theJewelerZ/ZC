import Link from "next/link";

import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { TrackedLink } from "@/components/tracked-link";

const simulatorCapabilities = [
  "Room feasibility and spatial planning",
  "Right- and left-handed clearance considerations",
  "Framing, finish work, and enclosure environments",
  "Impact-screen, blackout fabric, and netting planning",
  "Protective wall and ceiling treatments",
  "Turf, hitting-area, lighting, and technology coordination",
  "Custom trim and finished-room integration",
  "Installation support",
];

function RoomDiagram() {
  return (
    <div aria-hidden="true" className="room-diagram">
      <div className="room-perspective">
        <div className="room-screen">IMPACT PLANE</div>
        <div className="room-player">PLAYER ZONE</div>
        <div className="room-line room-line-one" />
        <div className="room-line room-line-two" />
        <span className="room-measure room-measure-a">CLEARANCE</span>
        <span className="room-measure room-measure-b">PROJECTION</span>
        <span className="room-measure room-measure-c">FINISH ENVELOPE</span>
      </div>
      <div className="room-diagram-footer">
        <span>ROOM</span>
        <span>SCREEN</span>
        <span>FINISH</span>
      </div>
    </div>
  );
}

export function SimulatorSection() {
  return (
    <section
      className="section simulator-section"
      id="simulator-construction"
    >
      <div className="site-container">
        <div className="simulator-heading-grid">
          <SectionHeading
            description={
              <p>
                Player clearance, screen geometry, protection, lighting,
                projection, turf, and finish details all affect how the space
                performs. The room has to work as one system.
              </p>
            }
            eyebrow="Indoor golf simulator construction"
            title="A simulator room is more than the equipment."
            tone="dark"
          />
          <p className="simulator-index">SPECIALTY / 01</p>
        </div>

        <div className="simulator-content-grid">
          <RoomDiagram />
          <div className="simulator-capabilities">
            <p className="simulator-lead">
              Zarka Construction helps bring the construction, protection, and
              finished-room decisions together around the space and the way it
              will actually be used.
            </p>
            <ul>
              {simulatorCapabilities.map((capability) => (
                <li key={capability}>
                  <CheckIcon />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
            <p className="simulator-qualifier">
              Equipment selection and licensed trade work are coordinated
              separately when required by the project.
            </p>
            <div className="simulator-section-actions">
              <Link
                className="simulator-detail-link"
                href="/simulator-construction"
              >
                Explore simulator construction
                <ArrowRightIcon />
              </Link>
              <TrackedLink
                className="simulator-external-link"
                eventName="ecosystem_link_click"
                eventProperties={{
                  project: "precision-impact-screens",
                  placement: "simulator_section",
                }}
                href="https://precisionimpactscreens.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Precision Impact Screens
                <ArrowUpRightIcon />
                <span className="sr-only"> (opens another website)</span>
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

