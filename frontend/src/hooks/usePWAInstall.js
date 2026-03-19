import { useState, useEffect } from 'react';

/**
 * Returns { canInstall, install } 
 * canInstall = true when browser fires beforeinstallprompt
 */
export default function usePWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setCanInstall(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setCanInstall(false);
    setPrompt(null);
  };

  return { canInstall, install };
}
