export interface Reward {
  id: number;
  title: string;
  description?: string;
  starsCost: number;
  createdBy: number;
  createdAt: string;
}

export interface CreateRewardDto {
  title: string;
  description?: string;
  starsCost: number;
}

export interface Wallet {
  id: number;
  childId: number;
  childName: string;
  balance: number;
}

export interface Transaction {
  id: number;
  childId: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface AddStarsDto {
  childId: number;
  amount: number;
  reason: string;
}

export interface DeliverGiftDto {
  childId: number;
  starsCost: number;
  giftName: string;
}

export interface Penalty {
  id: number;
  childId: number;
  childName: string;
  starsDeducted: number;
  reason: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
}

export interface CreatePenaltyDto {
  childId: number;
  starsDeducted: number;
  reason: string;
}
