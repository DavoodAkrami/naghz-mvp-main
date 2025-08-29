
export const calculateRemainingTime = (
  lastUpdate: string | null,
  totalDuration: number = 600
): number => {
  if (!lastUpdate) return totalDuration;
  
  const lastUpdateTime = new Date(lastUpdate).getTime();
  if (Number.isNaN(lastUpdateTime)) {
    return totalDuration;
  }
  
  const now = Date.now();
  const elapsedSec = Math.max(0, Math.floor((now - lastUpdateTime) / 1000));
  return Math.max(0, totalDuration - elapsedSec);
};


export const formatTime = (seconds: number): { minutes: number; seconds: number } => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, seconds: remainingSeconds };
};

export const formatTimeString = (seconds: number): string => {
  const { minutes, seconds: remainingSeconds } = formatTime(seconds);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isTimeExpired = (timeLeft: number): boolean => {
  return timeLeft <= 0;
};

export const createCountdownInterval = (
  timeLeft: number,
  setTimeLeft: (value: number | ((prev: number) => number)) => void,
  interval: number = 1000
): NodeJS.Timeout => {
  return setInterval(() => {
    setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  }, interval);
};
