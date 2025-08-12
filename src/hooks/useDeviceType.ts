/* eslint-disable prettier/prettier */
// src/hooks/useDeviceType.ts
import { useEffect, useState } from "react";

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

export function useDeviceType() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1920);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setWidth(w);
      if (w <= 767) setDeviceType("mobile");
      else if (w <= 1023) setDeviceType("tablet");
      else if (w <= 1366) setDeviceType("laptop");
      else setDeviceType("desktop");
    };

   
    check();


    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(check, 120);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { deviceType, width };
}
