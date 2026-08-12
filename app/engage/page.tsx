import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function EngagePage() { return <EcosystemPortal surface="engage" page={getSurfaceHome("engage")} />; }
