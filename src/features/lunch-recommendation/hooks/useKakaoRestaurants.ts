"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoSdk } from "@/lib/kakaoLoader";

export type KakaoCategoryCode =
  | "FD6" // 음식점
  | "CE7" // 카페
  | "CS2"; // 편의점 (예시: 확장 가능)

export interface RestaurantPlace {
  id: string;
  name: string;
  address: string;
  roadAddress?: string;
  lat: number;
  lng: number;
  phone?: string;
  url?: string;
  categoryName?: string;
  distanceMeters?: number;
}

export interface UseKakaoRestaurantsParams {
  address: string;
  category: KakaoCategoryCode;
  radiusMeters?: number; // 기본 1500m
  limit?: number; // 기본 10
  kakaoJavascriptKey?: string; // 필요 시 명시적으로 전달 가능
  keyword?: string; // 선택: 키워드 기반 검색 시 사용 (예: "한식")
}

export interface UseKakaoRestaurantsResult {
  data: RestaurantPlace[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function toMeters(distanceStr?: string): number | undefined {
  if (!distanceStr) return undefined;
  const n = Number(distanceStr);
  return Number.isFinite(n) ? n : undefined;
}

export function useKakaoRestaurants(params: UseKakaoRestaurantsParams): UseKakaoRestaurantsResult {
  const { address, category, radiusMeters = 1500, limit = 10, kakaoJavascriptKey, keyword } = params;
  const [data, setData] = useState<RestaurantPlace[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestParamsRef = useRef(params);
  latestParamsRef.current = params;

  const searchAround = useCallback(async (coords: { lat: number; lng: number }) => {
    const kakao = await loadKakaoSdk(kakaoJavascriptKey);
    return await new Promise<RestaurantPlace[]>((resolve, reject) => {
      const places = new kakao.maps.services.Places();
      const options = {
        location: new kakao.maps.LatLng(coords.lat, coords.lng),
        radius: radiusMeters,
      };
      const handle = (results: any[], status: string) => {
        if (status !== kakao.maps.services.Status.OK || !Array.isArray(results)) {
          reject(new Error("주변 장소 검색에 실패했어요."));
          return;
        }
        const mapped = results.slice(0, limit).map((r) => ({
          id: r.id ?? r.place_id ?? `${r.x},${r.y}`,
          name: r.place_name,
          address: r.address_name,
          roadAddress: r.road_address_name || undefined,
          lat: Number(r.y),
          lng: Number(r.x),
          phone: r.phone || undefined,
          url: r.place_url || undefined,
          categoryName: r.category_name || undefined,
          distanceMeters: toMeters(r.distance),
        }));
        resolve(mapped);
      };
      const kw = latestParamsRef.current.keyword?.trim();
      if (kw && kw.length > 0) {
        places.keywordSearch(kw, handle, options);
        return;
      }
      places.categorySearch(latestParamsRef.current.category, handle, options);
    });
  }, [kakaoJavascriptKey, radiusMeters, limit]);

  const doSearch = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    setError(null);
    try {
      const kakao = await loadKakaoSdk(kakaoJavascriptKey);
      const geocoder = new kakao.maps.services.Geocoder();

      let coords: { lat: number; lng: number } | null = null;

      // 1) 주소 지오코딩 시도
      coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        geocoder.addressSearch(latestParamsRef.current.address, (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result?.[0]) {
            const first = result[0];
            resolve({ lat: Number(first.y), lng: Number(first.x) });
            return;
          }
          if (status === kakao.maps.services.Status.ZERO_RESULT) {
            reject(new Error("주소를 더 구체적으로 입력해 주세요."));
            return;
          }
          reject(new Error("지오코딩 실패(키/도메인/쿼리 확인 필요)"));
        });
      }).catch(() => null);

      // 2) 실패 시 브라우저 위치 폴백
      if (!coords && navigator.geolocation) {
        coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => reject(new Error("브라우저 위치 권한이 거부되었어요.")),
            { timeout: 4000 }
          );
        }).catch(() => null);
      }

      // 3) 그래도 없으면 서울시청 좌표로 최후 폴백
      if (!coords) {
        coords = { lat: 37.566535, lng: 126.9779692 };
        setError("주소 변환에 실패해 기본 위치(서울시청) 기준으로 검색합니다.");
      }

      const placesResult = await searchAround(coords);
      setData(placesResult);
    } catch (e: any) {
      setError(e?.message ?? "검색 중 오류가 발생했어요.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [kakaoJavascriptKey, searchAround]);

  useEffect(() => {
    if (!address || !category) return;
    doSearch();
  }, [address, category, keyword, doSearch]);

  const refetch = useCallback(() => {
    doSearch();
  }, [doSearch]);

  return useMemo(
    () => ({ data, loading, error, refetch }),
    [data, loading, error, refetch]
  );
}
