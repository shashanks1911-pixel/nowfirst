import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { BoardType } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placementId = searchParams.get('placementId');
  const board = (searchParams.get('board') as BoardType) || 'companies';
  const isSpotlight = searchParams.get('isSpotlight') === 'true';

  if (!placementId) {
    return NextResponse.redirect(new URL(`/${board}`, request.url));
  }

  // 1. Prefetch detection: if browser prefetching, redirect without incrementing stats
  const isPrefetch =
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch' ||
    request.headers.get('x-purpose') === 'preview' ||
    request.headers.get('x-moz') === 'prefetch';

  // 2. Fetch placement
  const boardState = store.getBoard(board);
  let targetPlacement =
    boardState.currentPlacement?.id === placementId ? boardState.currentPlacement : null;

  if (!targetPlacement) {
    targetPlacement = boardState.history.find((h) => h.id === placementId) || null;
  }

  if (!targetPlacement) {
    return NextResponse.redirect(new URL(`/${board}`, request.url));
  }

  const destinationUrl = targetPlacement.adRevision.destinationUrl;

  if (isPrefetch) {
    return NextResponse.redirect(destinationUrl, { status: 302 });
  }

  // 3. Telemetry & Filtering
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || '';

  store.recordOutboundClick({
    placementId,
    board,
    isSpotlight,
    ip: clientIp,
    userAgent,
  });

  return NextResponse.redirect(destinationUrl, {
    status: 302,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    },
  });
}

