// Basic API helper for future data fetching
// You can expand this when Find7 connects to real category data.

export async function fetchJSON(url: string) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}

// Example placeholder function
export async function getCategoryData(slug: string) {
  // Later this will fetch real category data
    return {
        slug,
        items: [],
    };
}
