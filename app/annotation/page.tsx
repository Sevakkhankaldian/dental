import EcosystemPortal from "../ecosystem/EcosystemPortal";
import { getSurfaceHome } from "../ecosystem/config";

export default function AnnotationPage() { return <EcosystemPortal surface="annotation" page={getSurfaceHome("annotation")} />; }
