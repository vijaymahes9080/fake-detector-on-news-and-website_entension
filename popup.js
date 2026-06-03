/* Render level icon, description, and impact metric */
document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const levelContainer = document.getElementById('levelContainer');
  const impactEl = document.getElementById('impactMetric');

  // Retrieve stored analysis results (set by content.js)
  const { level = 'low', impact = 0 } = await chrome.storage.local.get(['level', 'impact']);

  const levelMap = {
    low: {
      icon: 'icons/low.png',
      label: 'Low risk',
      color: getComputedStyle(document.documentElement).getPropertyValue('--low')
    },
    medium: {
      icon: 'icons/medium.png',
      label: 'Medium risk',
      color: getComputedStyle(document.documentElement).getPropertyValue('--medium')
    },
    high: {
      icon: 'icons/high.svg',
      label: 'High risk',
      color: getComputedStyle(document.documentElement).getPropertyValue('--high')
    }
  };

  const { icon, label, color } = levelMap[level] || levelMap.low;

  statusEl.textContent = `Detected: ${label}`;
  levelContainer.innerHTML = `<img src="${icon}" alt="${label} icon"><span style="color:${color.trim()}">${label}</span>`;
  impactEl.textContent = `${impact}%`;
});
