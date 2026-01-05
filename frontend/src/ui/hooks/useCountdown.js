
// import { useEffect, useRef, useState, useCallback } from "react";

// export default function useCountdown(initialSeconds, onExpire) {
//   const [seconds, setSeconds] = useState(initialSeconds || 0);
//   const intervalRef = useRef(null);
//   const expiredRef = useRef(false);

//   const start = useCallback(
//     (secs = initialSeconds || 0) => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       expiredRef.current = false;
//       setSeconds(secs);

//       intervalRef.current = setInterval(() => {
//         setSeconds((prev) => {
//           if (prev <= 1) {
//             clearInterval(intervalRef.current);
//             if (!expiredRef.current) {
//               expiredRef.current = true;
//               try {
//                 onExpire?.();
//               } catch (e) {
//                 console.error("useCountdown onExpire error:", e);
//               }
//             }
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     },
//     [initialSeconds, onExpire]
//   );

//   useEffect(() => {
//     start(initialSeconds || 0);
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       expiredRef.current = true;
//     };
//   }, [initialSeconds, start]);

//   const stop = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     expiredRef.current = true;
//     setSeconds(0);
//   }, []);

//   const reset = useCallback(
//     (newSeconds = initialSeconds) => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       expiredRef.current = false;
//       start(newSeconds);
//     },
//     [initialSeconds, start]
//   );

//   return { seconds, stop, reset };
// }














// src/hooks/useCountdown.js
import { useEffect, useRef, useState, useCallback } from "react";

export default function useCountdown(initialSeconds, onExpire) {
  const [seconds, setSeconds] = useState(initialSeconds || 0);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  const start = useCallback(
    (secs = initialSeconds || 0) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      expiredRef.current = false;
      setSeconds(secs);

      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (!expiredRef.current) {
              expiredRef.current = true;
              try { onExpire?.(); } catch (e) { console.error(e); }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [initialSeconds, onExpire]
  );

  useEffect(() => {
    start(initialSeconds || 0);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      expiredRef.current = true;
    };
  }, [initialSeconds, start]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    expiredRef.current = true;
    setSeconds(0);
  }, []);

  const reset = useCallback((newSeconds = initialSeconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    expiredRef.current = false;
    start(newSeconds);
  }, [initialSeconds, start]);

  return { seconds, stop, reset };
}
