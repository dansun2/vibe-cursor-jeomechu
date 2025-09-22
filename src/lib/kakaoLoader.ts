"use client";

// Kakao Maps SDK loader with singleton Promise
// - Loads `services` library for Places/Geocoder
// - Uses NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY or an explicit key parameter

declare global {
  interface Window {
    kakao?: any;
  }
}

let kakaoLoadingPromise: Promise<any> | null = null;

export function loadKakaoSdk(explicitKey?: string): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao SDK can only be loaded in the browser"));
  }

  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoLoadingPromise) {
    return kakaoLoadingPromise;
  }

  const appKey = explicitKey || process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!appKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY"));
  }

  kakaoLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.kakao || !window.kakao.maps) {
        reject(new Error("Kakao SDK loaded but kakao.maps is unavailable"));
        return;
      }
      window.kakao.maps.load(() => {
        resolve(window.kakao);
      });
    };
    script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK script"));
    document.head.appendChild(script);
  });

  return kakaoLoadingPromise;
}

export type Kakao = any;
