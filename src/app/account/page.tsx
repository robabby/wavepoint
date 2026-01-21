import { redirect } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountActions } from "@/components/account/account-actions";

export default async function AccountOverviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return (
    <div className="space-y-8">
      {/* User info card */}
      <Card className="border-[var(--border-gold)]/30 bg-background">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
              <User className="h-7 w-7 text-[var(--color-gold)]" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">
                Welcome back
              </CardTitle>
              <Text className="text-muted-foreground">
                {session.user.email}
              </Text>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Actions section */}
      <div>
        <Heading
          as="h2"
          size="5"
          className="mb-4 font-heading text-foreground"
        >
          Manage Account
        </Heading>
        <AccountActions />
      </div>
    </div>
  );
}
