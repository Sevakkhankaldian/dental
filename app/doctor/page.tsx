import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function DoctorPage() { return <EcosystemPortal surface="doctor" page={getSurfaceHome("doctor")} />; }
