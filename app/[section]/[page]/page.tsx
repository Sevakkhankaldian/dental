import { notFound } from "next/navigation";
import EcosystemPortal from "../../ecosystem/EcosystemPortal";
import { findPortalPage, isSurfaceId } from "../../ecosystem/config";

export default async function EcosystemPage({ params }: { params: Promise<{ section: string; page: string }> }) {
  const { section, page } = await params;
  if (!isSurfaceId(section)) notFound();
  const config = findPortalPage(section, page);
  if (!config) notFound();
  return <EcosystemPortal surface={section} page={config} />;
}
