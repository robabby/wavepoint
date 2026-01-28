import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Heading } from "@radix-ui/themes";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your WavePoint settings.",
};

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/?auth=sign-in");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <Heading
            size="8"
            className="font-display text-foreground"
          >
            Settings
          </Heading>
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}
