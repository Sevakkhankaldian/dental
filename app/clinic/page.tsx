import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function ClinicPage() { return <EcosystemPortal surface="clinic" page={getSurfaceHome("clinic")} />; }
