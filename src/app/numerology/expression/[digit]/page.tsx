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
  return generatePositionDigitMetadata("expression", digit);
}

export default async function ExpressionDigitPage({
  params,
}: {
  params: Promise<{ digit: string }>;
}) {
  const { digit } = await params;
  return <PositionDigitPage positionSlug="expression" digitParam={digit} />;
}
