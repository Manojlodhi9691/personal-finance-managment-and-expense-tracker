import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
} from "lucide-react";

import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import api from "../services/api";

interface CategoryExpense {
  category: string;
  amount: number;
}

interface MonthlyExpense {
  month: string;
  amount: number;
}

interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string | null;
  transaction_type: string;
  date: string;
}

interface AnalyticsData {
  total_income: number;
  total_expenses: number;
  balance: number;
  expenses_by_category: CategoryExpense[];
  monthly_expenses: MonthlyExpense[];
}

export default function Reports() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const [analyticsResponse, transactionsResponse] =
        await Promise.all([
          api.get("/transactions/analytics"),
          api.get("/transactions/"),
        ]);

      setAnalytics(analyticsResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1
    );

    return date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">Loading reports...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-red-500">
          Unable to load report data.
        </p>
      </div>
    );
  }

  const totalCategoryExpenses = analytics.expenses_by_category.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Reports
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your financial report using your actual transaction data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Balance"
          value={formatCurrency(analytics.balance)}
          change="Current balance"
          icon={Wallet}
        />

        <StatCard
          title="Total Income"
          value={formatCurrency(analytics.total_income)}
          change="Total income"
          icon={ArrowUpCircle}
        />

        <StatCard
          title="Total Expenses"
          value={formatCurrency(analytics.total_expenses)}
          change="Total expenses"
          icon={ArrowDownCircle}
        />

        <StatCard
          title="Transactions"
          value={transactions.length.toString()}
          change="Total transactions"
          icon={Receipt}
        />

      </div>

      {/* Expenses by Category */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Expenses by Category
          </h2>

          <p className="text-sm text-slate-500">
            Breakdown of your actual expenses.
          </p>
        </div>

        {analytics.expenses_by_category.length === 0 ? (
          <p className="text-slate-500">
            No expense data available yet.
          </p>
        ) : (
          <div className="space-y-5">
            {analytics.expenses_by_category.map((item) => {
              const percentage =
                totalCategoryExpenses > 0
                  ? (item.amount / totalCategoryExpenses) * 100
                  : 0;

              return (
                <div key={item.category}>

                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">
                      {item.category}
                    </span>

                    <span className="text-sm text-slate-500">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-blue-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {percentage.toFixed(1)}% of expenses
                  </p>

                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Monthly Expense Report */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Monthly Expense Report
          </h2>

          <p className="text-sm text-slate-500">
            Your actual expenses grouped by month.
          </p>
        </div>

        {analytics.monthly_expenses.length === 0 ? (
          <p className="text-slate-500">
            No monthly expense data available.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="px-4 py-3">
                    Month
                  </th>

                  <th className="px-4 py-3">
                    Expenses
                  </th>
                </tr>
              </thead>

              <tbody>
                {analytics.monthly_expenses.map((item) => (
                  <tr
                    key={item.month}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      {formatMonth(item.month)}
                    </td>

                    <td className="px-4 py-3">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </Card>

      {/* Transaction Report */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Transaction Report
          </h2>

          <p className="text-sm text-slate-500">
            Complete list of your actual transactions.
          </p>
        </div>

        {transactions.length === 0 ? (
          <p className="text-slate-500">
            No transactions available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-sm text-slate-500">

                  <th className="px-4 py-3">
                    Date
                  </th>

                  <th className="px-4 py-3">
                    Description
                  </th>

                  <th className="px-4 py-3">
                    Category
                  </th>

                  <th className="px-4 py-3">
                    Type
                  </th>

                  <th className="px-4 py-3">
                    Amount
                  </th>

                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b last:border-0"
                  >

                    <td className="px-4 py-3">
                      {transaction.date}
                    </td>

                    <td className="px-4 py-3">
                      {transaction.description || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {transaction.category}
                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={
                          transaction.transaction_type === "income"
                            ? "font-medium text-green-600"
                            : "font-medium text-red-600"
                        }
                      >
                        {transaction.transaction_type}
                      </span>

                    </td>

                    <td
                      className={
                        transaction.transaction_type === "income"
                          ? "px-4 py-3 font-medium text-green-600"
                          : "px-4 py-3 font-medium text-red-600"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </Card>

    </div>
  );
}