import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  Sparkles,
} from "lucide-react";

import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ExpenseChart from "../components/charts/ExpenseChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import RecentTransactions from "../components/dashboard/RecentTransactions";

import type { Transaction } from "../types";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Forecast {
  predicted_expense: number;
  current_month_expense: number;
  change_percentage: number;
  next_month: string;
  months_used: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [forecast, setForecast] = useState<Forecast | null>(null);

  useEffect(() => {
    // Get transactions
    api
      .get("/transactions/")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
      });

    // Get expense forecast
    api
      .get("/predictions/forecast")
      .then((response) => {
        setForecast(response.data);
      })
      .catch((error) => {
        console.error("Failed to load forecast:", error);
      });
  }, []);

  const income = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Good evening, Manoj 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your money.
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Balance"
          value={`₹${balance.toLocaleString("en-IN")}`}
          change="Current balance"
          icon={Wallet}
        />

        <StatCard
          title="Income"
          value={`₹${income.toLocaleString("en-IN")}`}
          change="Total income"
          icon={ArrowUpCircle}
        />

        <StatCard
          title="Expenses"
          value={`₹${expenses.toLocaleString("en-IN")}`}
          change="Total expenses"
          icon={ArrowDownCircle}
        />

        <StatCard
          title="Savings"
          value={`₹${(income - expenses).toLocaleString("en-IN")}`}
          change="Available savings"
          icon={PiggyBank}
        />

      </div>


      {/* Spending + Budget */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Spending Overview */}
        <Card className="lg:col-span-2">

          <div className="mb-5">
            <h2 className="font-semibold">
              Spending Overview
            </h2>

            <p className="text-sm text-slate-500">
              Your expenses over the last few months
            </p>
          </div>

          <ExpenseChart />

        </Card>


        {/* Budget Status */}
        <Card>

          <h2 className="font-semibold">
            Budget Status
          </h2>

          <div className="mt-6">
            <BudgetProgress />
          </div>

        </Card>

      </div>


      {/* Forecast + Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* AI Expense Forecast */}
        <Card>

          <div className="flex items-center gap-2">

            <Sparkles size={20} />

            <h2 className="font-semibold">
              AI Expense Forecast
            </h2>

          </div>


          {forecast ? (

            <>
              <p className="mt-5 text-sm text-slate-500">
                Predicted expenses for {forecast.next_month}
              </p>


              <p className="mt-2 text-3xl font-bold">
                ₹{forecast.predicted_expense.toLocaleString("en-IN")}
              </p>


              {forecast.change_percentage >= 0 ? (

                <p className="mt-2 text-sm text-red-600">
                  ↑ {forecast.change_percentage.toFixed(1)}%
                  {" "}compared with this month
                </p>

              ) : (

                <p className="mt-2 text-sm text-green-600">
                  ↓ {Math.abs(forecast.change_percentage).toFixed(1)}%
                  {" "}compared with this month
                </p>

              )}


              <p className="mt-2 text-xs text-slate-500">
                Based on your recent {forecast.months_used} month(s)
                of expenses.
              </p>

            </>

          ) : (

            <p className="mt-5 text-slate-500">
              Loading forecast...
            </p>

          )}


          <button
            onClick={() => {
              window.location.href = "/forecast";
            }}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            View Forecast
          </button>

        </Card>


        {/* Recent Transactions */}
        <Card>

          <h2 className="mb-5 font-semibold">
            Recent Transactions
          </h2>

          <RecentTransactions
            transactions={transactions}
          />

        </Card>

      </div>

    </div>
  );
}