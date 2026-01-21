import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Heading } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { AccountSidebar } from "@/components/account/account-sidebar";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your WavePoint account settings and orders.",
};

export default async function AccountLayout({
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
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <Heading
            size="8"
            className="font-display text-foreground"
          >
            Account
          </Heading>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row lg:gap-12">
          <AccountSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
