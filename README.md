# Update JS Library

Update is a library for seamless billing and entitlement management. It integrates with your existing tools, like Stripe and Supabase, so you can integrate without migrating away from your existing stack.

## 🚀 Quickstart

The easiest way to get started with Update is to use the `create-update-app` command:

```bash
npm create update@latest
```

This tool will help you choose a framework and set up a fully working Update application in seconds. Just provide a name and your API keys.

For source code examples, check out our [examples repository](https://github.com/updatedotdev/examples).

## ✨ Features

- **Billing**: Seamless payments management
- **Entitlements**: Simple access control for premium features
- **Framework Support**: Built-in integration for Next.js and other SSR environments

## 🔧 Installation

```bash
npm install @updatedev/js
```

## 🔐 Auth Integrations

- 🐘 [Supabase](https://supabase.com?utm_source=update&utm_medium=referral&utm_campaign=update-js-readme)
- 🔥 [Firebase](https://firebase.google.com?utm_source=update&utm_medium=referral&utm_campaign=update-js-readme)
- 🔐 [Clerk](https://clerk.com?utm_source=update&utm_medium=referral&utm_campaign=update-js-readme)
- ⚙️ Custom

## 🏁 Getting Started

First, you need to create an account on [Update](https://update.dev) and obtain your publishable key. This key is essential for initializing the Update client in your application. Additionally, configure your preferred authentication provider to manage user sessions and access control.

## ⚙️ Initializing

### Basic Setup

```typescript
import { createClient } from '@updatedev/js';

export async function createUpdateClient() {
  return createClient(process.env.NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY!, {
    getSessionToken: async () => {
      // This must be replaced with your own logic to get your session token
      // For example, with Supabase:
      //
      // import { createSupabaseClient } from '@/utils/supabase/client'
      // ...
      // const supabase = createSupabaseClient()
      // const { data } = await supabase.auth.getSession()
      // if (data.session == null) return
      // return data.session.access_token

      // For this example, we'll just return a static token
      return 'your-session-token';
    },
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  });
}
```

### Initialization options

- `getSessionToken`: A function that returns a session token for the user. This is optional, but required for most functions that require authentication.
- `environment`: The environment to use for the client. Valid values are `live` and `test`.

### Environment Variables (.env.local)

```
NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 🏗️ Framework Integration

### Next.js Integration

Update works well with Next.js and other SSR environments. Create a `utils/update` directory with these files:

#### Client (utils/update/client.ts)

```typescript
import { createClient } from '@updatedev/js';

export async function createUpdateClient() {
  return createClient(process.env.NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY!, {
    getSessionToken: async () => {
      // This must be replaced with your own logic to get your session token
      // For example, with Supabase:
      //
      // import { createSupabaseClient } from '@/utils/supabase/client'
      // ...
      // const supabase = createSupabaseClient()
      // const { data } = await supabase.auth.getSession()
      // if (data.session == null) return
      // return data.session.access_token

      // For this example, we'll just return a static token
      return 'your-session-token';
    },
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  });
}
```

#### Server (utils/update/server.ts)

```typescript
import { createClient } from '@updatedev/js';

export async function createUpdateClient() {
  return createClient(process.env.NEXT_PUBLIC_UPDATE_PUBLISHABLE_KEY!, {
    getSessionToken: async () => {
      // This must be replaced with your own logic to get your session token
      // For example, with Supabase:
      //
      // import { createSupabaseClient } from '@/utils/supabase/server'
      // const supabase = await createSupabaseClient()
      // const { data } = await supabase.auth.getSession()
      // if (data.session == null) return
      // return data.session.access_token

      // For this example, we'll just return a static token
      return 'your-session-token';
    },
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  });
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

## 📚 Documentation

For complete documentation, visit [our documentation](https://update.dev/docs).

## 💬 Support

Need help? Join our [Discord community](https://discord.gg/Guege5tXFK) for support and discussions.

## 🤝 License

MIT
