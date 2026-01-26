import { useEffect, useState } from "react";

export default function useExamTimer(expiresAt, onExpire) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000
      );

      if (diff <= 0) {
        setTimeLeft(0);
        if (onExpire) onExpire();
      } else {
        setTimeLeft(diff);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}
