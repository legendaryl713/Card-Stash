
import { Card, GrailCard } from '../types';

const STORAGE_KEY = 'cardvault_data_v1';
const GRAIL_STORAGE_KEY = 'cardvault_grails_v1';

export const saveCards = (cards: Card[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Failed to save cards to local storage', error);
  }
};

export const loadCards = (): Card[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load cards from local storage', error);
    return [];
  }
};

export const saveGrails = (grails: GrailCard[]): void => {
  try {
    localStorage.setItem(GRAIL_STORAGE_KEY, JSON.stringify(grails));
  } catch (error) {
    console.error('Failed to save grails to local storage', error);
    // Likely quota exceeded if images are too large
    alert('Failed to save image. Storage might be full.');
  }
};

export const loadGrails = (): GrailCard[] => {
  try {
    const data = localStorage.getItem(GRAIL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load grails from local storage', error);
    return [];
  }
};
