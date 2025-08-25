/* eslint-disable prettier/prettier */
// src/hooks/useDeviceType.ts
import { useEffect, useState } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export function useDeviceType() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setWidth(w);
      if (w <= 767) setDeviceType('mobile');
      else if (w <= 1199) setDeviceType('tablet');
      // 768–1199
      else if (w <= 1600) setDeviceType('laptop');
      // 1200–1600
      else setDeviceType('desktop'); // 1600+
    };

    check();

    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(check, 120);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { deviceType, width };
}
