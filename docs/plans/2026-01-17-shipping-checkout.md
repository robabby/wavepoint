# Plan: Integrate Printful Shipping Rates into Checkout

## Summary

Add a pre-checkout shipping address dialog that calculates shipping costs via Printful's API, then passes the shipping cost to Stripe as a line item. Uses STANDARD (cheapest) shipping only.

## Linear Issues

- **Parent:** [SG-258: Add Shipping Costs to Checkout](https://linear.app/sherpagg/issue/SG-258/add-shipping-costs-to-checkout)
- [SG-259](https://linear.app/sherpagg/issue/SG-259): Add ShippingAddress and ShippingRate types
- [SG-260](https://linear.app/sherpagg/issue/SG-260): Add Printful shipping rates API function
- [SG-261](https://linear.app/sherpagg/issue/SG-261): Create shipping rates API route
- [SG-262](https://linear.app/sherpagg/issue/SG-262): Add Label and Select shadcn components
- [SG-263](https://linear.app/sherpagg/issue/SG-263): Create shipping address dialog component
- [SG-264](https://linear.app/sherpagg/issue/SG-264): Update checkout API to accept shipping data
- [SG-265](https://linear.app/sherpagg/issue/SG-265): Add shipping line item to Stripe checkout session
- [SG-266](https://linear.app/sherpagg/issue/SG-266): Integrate shipping dialog into cart drawer

## New Checkout Flow

```
Cart Drawer → "Proceed to Checkout" → Shipping Address Dialog → Calculate Rate → Stripe Checkout (with shipping line item)
```

## Implementation Steps

### 1. Add Types (`src/lib/shop/types.ts`)

Add `ShippingAddress` and `ShippingRate` interfaces.

### 2. Add Printful Shipping Function (`src/lib/shop/printful.ts`)

New `calculateShippingRates()` function calling `POST /shipping/rates`.

**Key detail:** The Printful API accepts `external_variant_id` (our sync variant ID) so no mapping needed.

### 3. Create Shipping Rates API Route (`src/app/api/shipping/rates/route.ts`)

New endpoint that:
- Validates address with Zod schema
- Calls Printful `/shipping/rates` API
- Returns only STANDARD rate (cheapest option)

### 4. Add UI Components

```bash
npx shadcn@latest add label select
```

### 5. Create Shipping Address Dialog (`src/components/shop/shipping-address-dialog.tsx`)

Modal dialog with:
- Address form fields (name, email, address1, address2, city, state, zip, country)
- Country dropdown (9 allowed countries matching Stripe config)
- "Calculate Shipping" button → shows rate
- "Continue to Payment" button → proceeds to checkout

### 6. Modify Checkout API (`src/app/api/checkout/route.ts`)

Update schema to accept `shippingAddress` and `shippingRate` alongside `items`.

### 7. Modify Stripe Session Creation (`src/lib/shop/stripe.ts`)

- Add shipping as a line item (not a Stripe shipping rate)
- Pre-fill customer email via `customer_email`
- Pre-fill shipping address via `payment_intent_data.shipping`

### 8. Update Cart Drawer (`src/components/shop/cart-drawer.tsx`)

- Change "Proceed to Checkout" to open shipping dialog
- Pass shipping data to checkout API after dialog completion

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/shipping/rates/route.ts` | Shipping rates endpoint |
| `src/components/shop/shipping-address-dialog.tsx` | Address form dialog |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/shop/types.ts` | Add ShippingAddress, ShippingRate interfaces |
| `src/lib/shop/printful.ts` | Add calculateShippingRates function |
| `src/lib/shop/stripe.ts` | Add shipping line item + pre-fill address |
| `src/app/api/checkout/route.ts` | Accept shipping data in request |
| `src/components/shop/cart-drawer.tsx` | Integrate shipping dialog |

## Supported Countries

Match current Stripe config: US, CA, GB, AU, DE, FR, ES, IT, NL

## Printful Shipping Rates API

**Endpoint:** `POST https://api.printful.com/shipping/rates`

**Request:**
```typescript
{
  recipient: {
    address1: string;
    city: string;
    state_code: string;
    country_code: string;  // ISO 2-letter code
    zip: string;
  },
  items: Array<{
    external_variant_id: string;  // Our sync variant ID
    quantity: number;
  }>
}
```

**Response:**
```typescript
{
  code: 200,
  result: Array<{
    id: string;        // "STANDARD", "EXPRESS"
    name: string;
    rate: string;      // Price as string
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
  }>
}
```

## Verification

1. Run `pnpm check` - ensure no type/lint errors
2. Add cart items, click checkout
3. Fill shipping address, verify rate calculates
4. Complete Stripe checkout, verify shipping line item appears
5. Check webhook creates Printful order with correct shipping
