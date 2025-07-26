import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

const STORAGE_KEY = 'structured-product-builder';

export const useLocalStoragePersistence = () => {
  const store = useAppStore();

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { bricks, connections } = JSON.parse(savedData);
        if (bricks && Array.isArray(bricks)) {
          bricks.forEach((brick: any) => store.addBrick(brick));
        }
        if (connections && Array.isArray(connections)) {
          connections.forEach((connection: any) => store.addConnection(connection));
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    const { bricks, connections } = store;
    const dataToSave = { bricks, connections };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [store.bricks, store.connections]);

  return {
    clearStorage: () => localStorage.removeItem(STORAGE_KEY),
    exportData: () => {
      const { bricks, connections } = store;
      return JSON.stringify({ bricks, connections }, null, 2);
    },
    importData: (data: string) => {
      try {
        const { bricks, connections } = JSON.parse(data);
        store.resetCanvas();
        if (bricks && Array.isArray(bricks)) {
          bricks.forEach((brick: any) => store.addBrick(brick));
        }
        if (connections && Array.isArray(connections)) {
          connections.forEach((connection: any) => store.addConnection(connection));
        }
        return true;
      } catch (error) {
        console.error('Failed to import data:', error);
        return false;
      }
    }
  };
};