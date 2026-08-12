import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function PatientPage() { return <EcosystemPortal surface="patient" page={getSurfaceHome("patient")} />; }
