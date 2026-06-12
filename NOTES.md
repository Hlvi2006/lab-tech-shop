# Notes: my design log

**Live URL (Vercel):** _paste your deployed link here_

## 1. Route and storage choice

- **Route:** Created `/premium` (or `app/premium/page.jsx`). This clear, semantic naming directly reflects the intent of the page (upgrading to a premium account) and isolates the checkout flow from the main shop logic.
- **Storage:** `localStorage`.
- **Why:** The requirement was for the premium state to survive both page reloads and entirely fresh visits. 
  - `sessionStorage` would have broken the experience because it clears as soon as the user closes the browser tab.
  - `Cookies` could work but are unnecessary here since we don't need to read this state on the server during the initial HTML generation; a simple browser-side flag is faster and lighter.

## 2. Server vs Client Components

- **`app/premium/page.js` (Client Component):** Forced by `useState` (form data, confirmation state), `onSubmit` event handlers, and browser-only APIs (`localStorage`).
- **`app/premium/SuccessMessage.jsx` (Client/Server-Agnostic):** Presentational component, but runs on the client as it is imported inside a Client Component.
- **`app/components/AdBanner.jsx` (Converted to Client Component):** Forced to become a Client Component because it must read from `localStorage` to check the premium flag before deciding whether to hide the ads.
- **Server Benefits:** Keeping the rest of the application (like product listings or static text) on the server ensures minimal JavaScript is sent to the browser, maximizing initial page load speeds and SEO efficiency.

## 3. The first-render problem

- **What happened:** Next.js pre-renders HTML on the server. Since `localStorage` does not exist on the server (`window is not defined`), attempting to check the premium flag during the initial state setup causes a server crash or a hydration mismatch error (server HTML doesn't match client HTML).
- **The Fix:** Initialized the states (`isConfirmed`, `isPremium`) as `false` by default (a known server-safe state). Then, wrapped the `localStorage` lookups inside a **`useEffect`** hook, which safely defers execution until *after* the component mounts entirely in the browser.
- **How I know it's fixed:** The Next.js hydration error overlay disappeared, the browser console is completely clean of warnings/errors, and the UI smoothly transitions without breaking layout shifts.

## 4. How the pieces connect

When a user submits the payment form, `PremiumPage` sets a `'isPremium': 'true'` flag inside the browser's `localStorage` and flips its local state to show the success message. Upon navigating or refreshing, the `AdBanner` component immediately triggers its `useEffect`, reads the `"true"` flag from `localStorage`, and instantly returns `null`. This completely blocks the marquee and floating ads from rendering, delivering a permanently clean, ad-free experience.

## 5. If I had another hour

I would implement a global **React Context API** for the premium state. Right now, components check `localStorage` independently on mount; with a global context, clicking "Upgrade to Premium" would instantly broadcast the status change, causing the ads on the screen to vanish smoothly in real-time without requiring a page refresh.