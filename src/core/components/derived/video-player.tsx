import React, { useState, useEffect } from 'react';
import { ComponentProps } from 'react';

type Props = ComponentProps<'video'>

const VideoPlayer: React.FC<Props> = ({ src, ...props }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [useCache, setUseCache] = useState<boolean>(false);

  const url = typeof src === 'string' ? src : undefined;

  useEffect(() => {
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

    // Fetch video and cache it in the background
    const fetchAndCacheVideo = async (videoUrl: string): Promise<void> => {
      try {
        const response = await fetch(videoUrl);
        if (!response.ok) return;

        const blob = await response.blob();
        const db = await openDatabase();
        await saveVideoToDB(db, videoUrl, blob);
        console.log('Video cached for next time');
      } catch (err) {
        console.error('Error caching video:', err);
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
        } else {
          // Video not in cache - use URL directly and cache in background
          console.log('Video not cached, using URL directly');
          setUseCache(false);
          // Start caching in background
          fetchAndCacheVideo(url);
        }
      } catch (err) {
        console.error('Error checking cache:', err);
        setUseCache(false);
      } finally {
        setLoading(false);
      }
    };

    checkCache();

    // Cleanup: revoke object URL when component unmounts or URL changes
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [url, videoSrc]);

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
        controls
        className="w-full rounded-lg shadow-lg"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // If video is not cached, use the original URL
  return (
    <video
      {...props}
      src={url}
      controls
      className="w-full rounded-lg shadow-lg"
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;