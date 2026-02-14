import React, { useState, useEffect, useRef } from 'react';
import { ComponentProps } from 'react';

type Props = ComponentProps<'video'>

const VideoPlayer: React.FC<Props> = ({ src, ...props }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [useCache, setUseCache] = useState<boolean>(false);
  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState<boolean>(false);
  const hasCheckedCache = useRef<boolean>(false);

  const url = typeof src === 'string' ? src : undefined;

  useEffect(() => {
    // Prevent re-running if we've already checked cache for this URL
    if (hasCheckedCache.current) return;

    const DB_NAME = 'VideoCache';
    const STORE_NAME = 'videos';

    // Initialize IndexedDB
    const openDatabase = (): Promise<IDBDatabase> => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
      });
    };

    // Get video from IndexedDB
    const getVideoFromDB = async (db: IDBDatabase, key: string): Promise<Blob | undefined> => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    };

    // Save video to IndexedDB (done in background)
    const saveVideoToDB = async (db: IDBDatabase, key: string, blob: Blob): Promise<void> => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(blob, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    };

    // Fetch video and cache it in the background (doesn't interrupt playback)
    const fetchAndCacheVideo = async (videoUrl: string): Promise<void> => {
      try {
        setIsFirstTimeLoading(true);
        const response = await fetch(videoUrl);
        if (!response.ok) {
          setIsFirstTimeLoading(false);
          return;
        }

        const blob = await response.blob();
        const db = await openDatabase();
        await saveVideoToDB(db, videoUrl, blob);
        console.log('Video cached successfully');
        setIsFirstTimeLoading(false);
      } catch (err) {
        console.error('Error caching video:', err);
        setIsFirstTimeLoading(false);
      }
    };

    // Main function to check cache
    const checkCache = async (): Promise<void> => {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const db = await openDatabase();
        const videoBlob = await getVideoFromDB(db, url);

        if (videoBlob) {
          // Video exists in cache - use it
          console.log('Video loaded from cache');
          const objectUrl = URL.createObjectURL(videoBlob);
          setVideoSrc(objectUrl);
          setUseCache(true);
          setLoading(false);
        } else {
          // Video not in cache - use URL directly and cache in background
          console.log('Video not cached, using URL directly');
          setUseCache(false);
          setLoading(false);
          // Start caching in background WITHOUT interrupting playback
          fetchAndCacheVideo(url);
        }

        hasCheckedCache.current = true;
      } catch (err) {
        console.error('Error checking cache:', err);
        setUseCache(false);
        setLoading(false);
        hasCheckedCache.current = true;
      }
    };

    checkCache();

    // Cleanup: revoke object URL when component unmounts or URL changes
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [url]);

  // Reset cache check flag when URL changes
  useEffect(() => {
    hasCheckedCache.current = false;
  }, [url]);

  // Return null while checking IndexedDB
  if (loading) {
    return null;
  }

  // If video is cached, use the blob URL
  if (useCache && videoSrc) {
    return (
      <video
        {...props}
        src={videoSrc}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // If video is not cached, use the original URL
  return (
    <>
      <video
        {...props}
        src={url}
      >
        Your browser does not support the video tag.
      </video>

      {/* Show loading indicator while caching in background */}
      {isFirstTimeLoading && (
        <div className="absolute z-50 bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1.5">
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Caching...</span>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;