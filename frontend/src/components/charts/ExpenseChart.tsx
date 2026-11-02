import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

interface MonthlyExpense {
  month: string;
  amount: number;
}

export default function ExpenseChart() {
  const [data, setData] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/transactions/analytics");

      const monthlyExpenses = response.data.monthly_expenses || [];

      const formattedData = monthlyExpenses.map(
        (item: MonthlyExpense) => ({
          month: formatMonth(item.month),
          amount: item.amount,
        })
      );

      setData(formattedData);
    } catch (error) {
      console.error("Failed to load spending data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1
    );

    return date.toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center text-slate-500">
        Loading spending data...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-slate-500">
        No expense data available yet.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Line
            type="monotone"
            dataKey="amount"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}