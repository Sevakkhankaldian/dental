import PortalSection, { type PortalSectionName } from "../components/PortalSection";

const allowedSections: PortalSectionName[] = [
  "inbox",
  "reviews",
  "patients",
  "messages",
  "appointments",
  "protocols",
  "analytics",
];

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const safeSection = allowedSections.includes(section as PortalSectionName)
    ? (section as PortalSectionName)
    : "inbox";

  return <PortalSection section={safeSection} />;
}
