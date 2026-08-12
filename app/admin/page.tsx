import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function AdminPage() { return <EcosystemPortal surface="admin" page={getSurfaceHome("admin")} />; }
