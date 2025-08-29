
export const loadImage = (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    
    img.onload = () => {
      resolve();
    };
    
    img.onerror = () => {
      console.warn(`Failed to preload image: ${imageUrl}`);
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };

    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
  });
};


export const loadImagesWithConcurrency = async (
  images: string[],
  concurrency: number = 3
): Promise<void> => {
  if (!images || images.length === 0) return;

  const chunks = [];
  
  for (let i = 0; i < images.length; i += concurrency) {
    chunks.push(images.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.allSettled(
      chunk.map(imageUrl => loadImage(imageUrl))
    );
  }
};


export const trackImageLoading = (
  images: string[],
  setLoadedImages: React.Dispatch<React.SetStateAction<Set<string>>>,
  setFailedImages: React.Dispatch<React.SetStateAction<Set<string>>>
): void => {
  if (images.length === 0) return;

  const loadImageWithTracking = async (imageUrl: string): Promise<void> => {
    try {
      await loadImage(imageUrl);
      setLoadedImages(prev => new Set(prev).add(imageUrl));
    } catch (error) {
      setFailedImages(prev => new Set(prev).add(imageUrl));
    }
  };

  loadImagesWithConcurrency(images).then(() => {

  });
};


export const calculateLoadingProgress = (
  loadedCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) return 100;
  return Math.round((loadedCount / totalCount) * 100);
};
