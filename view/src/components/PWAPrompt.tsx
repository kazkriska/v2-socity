"use client";

import { useState, useEffect } from "react";

// Standard Typescript doesn't include the BeforeInstallPromptEvent, so we define it here
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the browser's default mini-infobar from appearing
      e.preventDefault();
      
      // Stash the event so it can be triggered later via your custom button
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show your custom modal
      setShowModal(true);
    };

    // Listen for the install prompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Optional: Listen to see if the user has successfully installed the app
    const handleAppInstalled = () => {
      setShowModal(false);
      setDeferredPrompt(null);
      console.log("PWA was installed successfully!");
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Trigger the native browser prompt that we saved earlier
    await deferredPrompt.prompt();

    // Wait for the user to respond to the native prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the saved prompt whether they accepted or dismissed
    setDeferredPrompt(null);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-2 text-xl font-bold text-gray-900">Install App</h2>
        <p className="mb-6 text-gray-600">
          Install this application to your device for a faster, offline-capable experience!
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setShowModal(false)}
            className="rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Maybe Later
          </button>
          <button 
            onClick={handleInstallClick}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
