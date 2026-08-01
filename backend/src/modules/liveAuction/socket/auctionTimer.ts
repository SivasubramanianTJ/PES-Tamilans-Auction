let countdown: NodeJS.Timeout | null = null;

export function startAuctionTimer(
  seconds: number,
  onFinish: () => void
) {
  stopAuctionTimer();

  countdown = setTimeout(() => {
    countdown = null;
    onFinish();
  }, seconds * 1000);
}

export function resetAuctionTimer(
  seconds: number,
  onFinish: () => void
) {
  startAuctionTimer(seconds, onFinish);
}

export function stopAuctionTimer() {
  if (countdown) {
    clearTimeout(countdown);
    countdown = null;
  }
}

export function isTimerRunning() {
  return countdown !== null;
}