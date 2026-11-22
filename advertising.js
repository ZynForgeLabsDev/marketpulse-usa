// Set data-entitlement-url on the script after connecting account billing.
// The endpoint must read the signed-in session and return uncached JSON
// with { "adFree": true } for eligible subscribers or false for free visitors.
(async () => {
  const endpoint = document.currentScript.dataset.entitlementUrl;
  const slots = document.querySelectorAll('[data-ad-slot]');
  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok || (await response.json()).adFree !== false) return;
    } catch {
      // Keep ads hidden whenever subscription status cannot be verified.
      return;
    }
  }
  const style = document.createElement('style');
  style.textContent =     '[data-ad-slot]:not([hidden]){display:flex;flex-direction:column;justify-content:center;' +
    'align-items:center;gap:4px;min-height:92px;padding:12px;margin:16px 0;' +
    'border:1px dashed var(--line,#293354);border-radius:12px;background:var(--panel,#101528);' +
    'color:var(--muted,#b0bbd7);text-align:center}' +
    '[data-ad-slot] small{font-size:11px;text-transform:uppercase;letter-spacing:.08em}';
  document.head.append(style);
  for (const slot of slots) slot.hidden = false;
})();
