'use client';

import dynamic from 'next/dynamic';
import { MarkerData } from '@/types/map';
import { markers } from '@/utils/mapData';
import { useEffect, useState } from 'react';


const MapContainer = dynamic<{ markersData: MarkerData[] }>(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

export default function HomePage() {
  const [isWebView, setIsWebView] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const webViewIndicators = [
      'WebView',
      'wv',
      'Android; Mobile',
      'iPhone; CPU iPhone OS',
      'iPad; CPU OS',
      'Version/',
    ];
    const isInWebView = webViewIndicators.some(indicator => userAgent.includes(indicator)) && !userAgent.includes('Safari');
    setIsWebView(isInWebView);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] pt-16">
      <div style={{ backgroundColor: 'white', width: '100%', height: isWebView ? 60 : 0 }} />
      <MapContainer markersData={markers}/>
    </div>
  );
}