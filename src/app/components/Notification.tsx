"use client";

import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function Notification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the notification has been dismissed before
    const isDismissed = localStorage.getItem("notification-2024-2025-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("notification-2024-2025-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center animate-slide-down">
      <div className="bg-gray-500 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-500 max-w-2xl w-full">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium">
              <strong>New Data Available!</strong> 2024-2025 Grade Data is now available for viewing!
            </p>
          </div>
          <button
            onClick={handleClose}
            className="ml-2 hover:bg-gray-600 rounded-full p-1 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <AiOutlineClose className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
