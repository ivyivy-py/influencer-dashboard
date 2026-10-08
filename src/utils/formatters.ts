import { NicheCategory, PlatformType } from '../types';

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

export const getNicheStyle = (category: NicheCategory): { bg: string; text: string; border: string } => {
  switch (category) {
    case 'Tech & AI':
      return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' };
    case 'Gaming & Esports':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
    case 'Beauty & Skincare':
      return { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' };
    case 'Personal Finance':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'Lifestyle & Vlog':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' };
    case 'Fitness & Health':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' };
    case 'Fashion & Style':
      return { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/20' };
    case 'Food & Culinary':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'Travel & Adventure':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
    default:
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' };
  }
};
