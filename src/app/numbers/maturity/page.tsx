import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("maturity");

export default function MaturityPage() {
  return <PositionOverviewPage slug="maturity" />;
}
