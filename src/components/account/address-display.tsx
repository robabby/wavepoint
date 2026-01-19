"use client";

import { useState } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressForm } from "./address-form";
import { US_STATES, type AddressFormData } from "@/lib/address/schemas";

interface AddressDisplayProps {
  address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
}

/**
 * Client component that handles display/edit toggle for address.
 * Shows read-only view with Edit button when address exists.
 * Shows form directly when no address exists.
 */
export function AddressDisplay({ address }: AddressDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);

  // If no address, show form directly
  if (!address) {
    return (
      <div>
        <Heading
          as="h1"
          size="6"
          className="mb-6 font-heading text-[var(--color-cream)]"
        >
          Shipping Address
        </Heading>
        <Card className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--color-cream)]">
              Add your shipping address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get state label from value
  const stateLabel =
    US_STATES.find((s) => s.value === address.state)?.label ?? address.state;

  // If editing, show form with current values
  if (isEditing) {
    const formValues: AddressFormData = {
      name: address.name,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    };

    return (
      <div>
        <Heading
          as="h1"
          size="6"
          className="mb-6 font-heading text-[var(--color-cream)]"
        >
          Edit Address
        </Heading>
        <Card className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]">
          <CardContent className="pt-6">
            <AddressForm
              defaultValues={formValues}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show read-only display
  return (
    <div>
      <Heading
        as="h1"
        size="6"
        className="mb-6 font-heading text-[var(--color-cream)]"
      >
        Shipping Address
      </Heading>
      <Card className="border-[var(--border-gold)]/30 bg-[var(--color-obsidian)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
                <MapPin className="h-5 w-5 text-[var(--color-gold)]" />
              </div>
              <CardTitle className="text-lg text-[var(--color-cream)]">
                {address.name}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-[var(--border-gold)]/30 text-[var(--color-warm-gray)] hover:border-[var(--border-gold)] hover:text-[var(--color-cream)]"
            >
              <Pencil className="mr-2 h-3 w-3" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-[var(--color-warm-gray)]">
            <Text as="p">{address.line1}</Text>
            {address.line2 && <Text as="p">{address.line2}</Text>}
            <Text as="p">
              {address.city}, {stateLabel} {address.postalCode}
            </Text>
            <Text as="p">{address.country}</Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
