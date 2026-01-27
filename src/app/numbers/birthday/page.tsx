import type { Metadata } from "next";
import {
  PositionOverviewPage,
  generatePositionMetadata,
} from "../_components/PositionOverviewPage";

export const metadata: Metadata = generatePositionMetadata("birthday");

export default function BirthdayPage() {
  return <PositionOverviewPage slug="birthday" />;
}
