import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Return 404 for non-admins to hide admin routes
  if (!isAdmin(session)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Admin header */}
        <div className="mb-8 border-b border-[var(--border-gold)]/20 pb-6 lg:mb-12">
          <Text size="1" className="mb-2 block uppercase tracking-widest text-[var(--color-gold)]">
            Admin
          </Text>
          <Heading
            size="8"
            className="font-display text-foreground"
          >
            Dashboard
          </Heading>
        </div>

        {/* Main content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
