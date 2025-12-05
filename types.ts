
export interface Card {
  id: string;
  name: string;
  year: string;
  set: string; // e.g., Prizm, Optic, Topps Chrome
  purchasePrice: number;
  purchaseDate: string;
  isSold: boolean;
  soldPrice?: number;
  soldDate?: string;
  tags: string[];
  notes?: string;
}

export interface GrailCard {
  id: string;
  caption: string;
  imageBase64: string;
  dateAdded: string;
}

export type TagOption = 'Basketball' | 'Baseball' | 'Football' | 'Soccer' | 'Pokemon' | 'F1' | 'UFC' | 'Hockey' | 'Other';

export const PRESET_TAGS: TagOption[] = [
  'Basketball', 'Baseball', 'Football', 'Soccer', 'Pokemon', 'F1', 'Hockey', 'UFC'
];

export interface DashboardStats {
  totalCards: number;
  totalInvested: number; // Cost basis of current portfolio
  portfolioValue: number; // For now, assumed equal to cost unless sold (could be manually updated in future)
  realizedProfit: number;
  soldCount: number;
}
