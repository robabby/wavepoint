import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("soul-urge");

export default function SoulUrgePage() {
  return <PositionOverviewPage slug="soul-urge" />;
}
