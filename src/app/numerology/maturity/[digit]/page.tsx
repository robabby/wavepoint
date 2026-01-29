import type { Metadata } from "next";
import {
  PositionDigitPage,
  generateDigitStaticParams,
  generatePositionDigitMetadata,
} from "../../_components/PositionDigitPage";

export const generateStaticParams = generateDigitStaticParams;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ digit: string }>;
}): Promise<Metadata> {
  const { digit } = await params;
  return generatePositionDigitMetadata("maturity", digit);
}

export default async function MaturityDigitPage({
  params,
}: {
  params: Promise<{ digit: string }>;
}) {
  const { digit } = await params;
  return <PositionDigitPage positionSlug="maturity" digitParam={digit} />;
}
