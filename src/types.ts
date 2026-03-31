export interface User {
  name: string;
  role: string;
  trialStartDate: string;
  trialStarted: boolean;
  isSubscribed: boolean;
  subscriptionDate?: string;
  pixPaymentInitiatedAt?: string;
  aiDiagnosesCount?: number;
  lastAiDiagnosisDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface Repair {
  id: string;
  customerId: string;
  deviceModel: string;
  reportedDefect: string;
  diagnosis?: string;
  checklist: {
    powersOn: boolean;
    charges: boolean;
    simRecognized: boolean;
    screenIntact: boolean;
    touchWorks: boolean;
  };
  status: 'pending' | 'in-progress' | 'waiting-parts' | 'finished' | 'delivered';
  budget: {
    partsCost: number;
    laborCost: number;
    total: number;
  };
  entryDate: string;
  deliveryDate?: string;
  photos: string[]; // base64 or URLs
  notes: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'scheduled';
  repairId?: string;
}
