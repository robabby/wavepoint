import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("expression");

export default function ExpressionPage() {
  return <PositionOverviewPage slug="expression" />;
}
