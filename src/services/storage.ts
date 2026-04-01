import { Customer, Repair, Transaction, Part } from '../types';

const STORAGE_KEYS = {
  CUSTOMERS: 'fixmaster_customers',
  REPAIRS: 'fixmaster_repairs',
  TRANSACTIONS: 'fixmaster_transactions',
  PARTS: 'fixmaster_parts',
};

export const StorageService = {
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  saveCustomer: (customer: Customer) => {
    const customers = StorageService.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      customers[index] = customer;
    } else {
      customers.push(customer);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  getRepairs: (): Repair[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REPAIRS);
    return data ? JSON.parse(data) : [];
  },
  saveRepair: (repair: Repair) => {
    const repairs = StorageService.getRepairs();
    const index = repairs.findIndex(r => r.id === repair.id);
    if (index >= 0) {
      repairs[index] = repair;
    } else {
      repairs.push(repair);
    }
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs));
  },
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveTransaction: (transaction: Transaction) => {
    const transactions = StorageService.getTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  deleteCustomer: (id: string) => {
    const customers = StorageService.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  deleteRepair: (id: string) => {
    const repairs = StorageService.getRepairs().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPAIRS, JSON.stringify(repairs));
  },
  getParts: (): Part[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PARTS);
    return data ? JSON.parse(data) : [];
  },
  savePart: (part: Part) => {
    const parts = StorageService.getParts();
    const index = parts.findIndex(p => p.id === part.id);
    if (index >= 0) {
      parts[index] = part;
    } else {
      parts.push(part);
    }
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
  },
  deletePart: (id: string) => {
    const parts = StorageService.getParts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
  },
  getPartById: (id: string): Part | undefined => {
    return StorageService.getParts().find(p => p.id === id);
  }
};
