/* -------------------------------------------------
   Content script – runs on every page.
   Simulated fake‑news detection; replace with real logic.
   ------------------------------------------------- */
(() => {
    // Simulate a score between 0 and 1
    const score = Math.random();
    let level, impact;
    if (score < 0.33) {
        level = 'low';
        impact = Math.round(score * 30); // up to ~30%
    } else if (score < 0.66) {
        level = 'medium';
        impact = Math.round(30 + (score - 0.33) * 40); // 30‑70%
    } else {
        level = 'high';
        impact = Math.round(70 + (score - 0.66) * 30); // 70‑100%
    }
    // Store for popup UI
    chrome.storage.local.set({ level, impact });
})();
