import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../services/api";

interface CategoryData {
  category: string;
  amount: number;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface AnalyticsData {
  total_income: number;
  total_expenses: number;
  balance: number;
  expenses_by_category: CategoryData[];
  monthly_expenses: MonthlyData[];
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/transactions/analytics");

      setData(response.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-4 text-gray-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-4 text-red-500">
          Unable to load analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">

      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Financial Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Analyze your income and spending patterns.
        </p>
      </div>


      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Income */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Total Income
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{Number(data.total_income).toLocaleString()}
          </h2>
        </div>


        {/* Expenses */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Total Expenses
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            ₹{Number(data.total_expenses).toLocaleString()}
          </h2>
        </div>


        {/* Balance */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Balance
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ₹{Number(data.balance).toLocaleString()}
          </h2>
        </div>

      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Category chart */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Expenses by Category
          </h2>

          {data.expenses_by_category.length === 0 ? (
            <p className="text-gray-500">
              No expense data available.
            </p>
          ) : (
            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={data.expenses_by_category}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >

                    {data.expenses_by_category.map(
                      (_, index) => (
                        <Cell
                          key={index}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>
          )}

        </div>


        {/* Monthly chart */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Monthly Expenses
          </h2>

          {data.monthly_expenses.length === 0 ? (
            <p className="text-gray-500">
              No monthly expense data available.
            </p>
          ) : (
            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={data.monthly_expenses}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="amount"
                    name="Expenses"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          )}

        </div>

      </div>


      {/* Category table */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Category Breakdown
        </h2>

        {data.expenses_by_category.length === 0 ? (
          <p className="text-gray-500">
            No expenses recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Category
                  </th>

                  <th className="text-right py-3">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.expenses_by_category.map(
                  (item) => (
                    <tr
                      key={item.category}
                      className="border-b"
                    >

                      <td className="py-3">
                        {item.category}
                      </td>

                      <td className="py-3 text-right font-medium">
                        ₹{item.amount.toLocaleString()}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}