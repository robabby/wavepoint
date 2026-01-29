import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("personality");

export default function PersonalityPage() {
  return <PositionOverviewPage slug="personality" />;
}
