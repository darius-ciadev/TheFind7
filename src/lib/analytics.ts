// Placeholder analytics helper
// Add real tracking (GA4, Vercel Analytics, etc.) later

export function track(event: string, data?: Record<string, any>) {
    console.log(`[analytics] ${event}`, data || {});
}
