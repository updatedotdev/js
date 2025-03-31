# Update JS Library

Update is a library for seamless billing, authentication, and entitlement management. It extends your existing tools like Supabase and Stripe so you can integrate without migrating away from your existing stack.

## 🚀 Quickstart

The easiest way to get started with Update is to use the `create-update-app` command:

```bash
npx create-update-app@latest
```

This tool will help you choose a framework and set up a fully working Update application in seconds. Just provide a name and your API keys.

For source code examples, check out our [examples repository](https://github.com/updatedotdev/examples).

## ✨ Features

- **Authentication**: Easy integration with your auth providers
- **Billing**: Seamless payments management
- **Entitlements**: Simple access control for premium features
- **Framework Support**: Built-in integration for Next.js and other SSR environments

## 🔧 Installation

```bash
npm install @updatedev/js
```

For SSR environments like Next.js:

```bash
npm install @updatedev/js @updatedev/ssr
```

## 🔑 Initializing

### Basic Setup

```javascript
import { createClient } from "@updatedev/js/supabase";

const update = createClient({
    process.env.NEXT_PUBLIC_UPDATE_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
});
```

### Environment Variables (.env.local)

```
NEXT_PUBLIC_UPDATE_PUBLIC_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 🏗️ Framework Integration

### Next.js Integration

Update works well with Next.js and other SSR environments. Create a `utils/update` directory with these files:

#### Client (utils/update/client.ts)

```typescript
import { createBrowserClient } from '@updatedev/ssr/supabase';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_UPDATE_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### Middleware (middleware.ts in root)

```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/update/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### Server (utils/update/server.ts)

```typescript
import { createServerClient } from '@updatedev/ssr/supabase';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_UPDATE_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

## 💳 Billing Features

### Getting Products

```typescript
const { data, error } = await client.billing.getProducts();
```

### Creating a Checkout Session

```typescript
const { data, error } = await client.billing.createCheckoutSession(priceId, {
  redirect_url: 'http://localhost:3000/subscription',
});
```

### Managing Subscriptions

Get user subscriptions:

```typescript
const { data } = await client.billing.getSubscriptions();
```

Cancel a subscription:

```typescript
await client.billing.updateSubscription(id, {
  cancel_at_period_end: true,
});
```

Reactivate a subscription:

```typescript
await client.billing.updateSubscription(id, {
  cancel_at_period_end: false,
});
```

## 🛡️ Entitlements

### List Entitlements

```typescript
const { data, error } = await client.entitlements.list();
```

### Check Entitlement

```typescript
const { data, error } = await client.entitlements.check('premium');
```

## 🔐 Authentication Extensions

### Creating Auth Flow Links

```typescript
const { data, error } = await client.auth.createAuthFlowLink({
  type: 'sign-in',
});
window.location.href = data.url;
```

### Verifying Auth Flow Links

```typescript
const { error } = await client.auth.verifyAuthFlowCode(code);
```

## 📚 Documentation

For complete documentation, visit [our documentation](https://update.dev/docs).

## 💬 Support

Need help? Join our [Discord community](https://discord.gg/Guege5tXFK) for support and discussions.

## 🤝 License

MIT
