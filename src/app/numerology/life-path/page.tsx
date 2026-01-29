import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("life-path");

export default function LifePathPage() {
  return <PositionOverviewPage slug="life-path" />;
}
