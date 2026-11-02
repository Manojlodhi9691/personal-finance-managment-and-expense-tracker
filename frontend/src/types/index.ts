export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  transaction_type: string;
  date: string;
  
}

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

export interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
}

export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
}

export interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
}