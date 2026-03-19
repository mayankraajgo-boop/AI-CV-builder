import { useState, useEffect } from 'react';

export default function usePWAInstall() {
  const [prompt, setPrompt] = useState(() => window.__pwaPrompt || null);
  const [canInstall, setCanInstall] = useState(() => !!window.__pwaPrompt);

  useEffect(() => {
    // If prompt was already captured before React mounted, use it
    if (window.__pwaPrompt && !prompt) {
      setPrompt(window.__pwaPrompt);
      setCanInstall(true);
    }

    const onReady = () => {
      if (window.__pwaPrompt) {
        setPrompt(window.__pwaPrompt);
        setCanInstall(true);
      }
    };
    const onBeforeInstall = (e) => {
      e.preventDefault();
      window.__pwaPrompt = e;
      setPrompt(e);
      setCanInstall(true);
    };
    const onInstalled = () => {
      window.__pwaPrompt = null;
      setCanInstall(false);
      setPrompt(null);
    };

    window.addEventListener('pwaPromptReady', onReady);
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('pwaPromptReady', onReady);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window.__pwaPrompt = null;
      setCanInstall(false);
    }
    setPrompt(null);
  };

  return { canInstall, install };
}
