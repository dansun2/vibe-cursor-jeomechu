'use client';

import { generateQRCodeURL } from '@/lib/utils';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export const QRCode = ({ url, size = 200, className }: QRCodeProps) => {
  const qrUrl = generateQRCodeURL(url);
  
  return (
    <img 
      src={qrUrl} 
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  );
};