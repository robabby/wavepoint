import { Text, Card } from "@radix-ui/themes";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Text size="3" className="text-muted-foreground">
        Admin tools for managing WavePoint.
      </Text>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/invites" className="group">
          <Card className="border border-[var(--border-gold)]/30 bg-background p-6 transition-all hover:border-[var(--color-gold)]/50 hover:shadow-[0_0_20px_rgba(212,168,75,0.1)]">
            <Text size="4" weight="medium" className="mb-2 block text-foreground">
              Invites
            </Text>
            <Text size="2" className="text-muted-foreground">
              Manage beta invitations and track signups.
            </Text>
          </Card>
        </Link>
      </div>
    </div>
  );
}
