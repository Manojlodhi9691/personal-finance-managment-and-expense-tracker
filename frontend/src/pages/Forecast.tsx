import { useEffect, useState } from "react";
import api from "../services/api";

interface ForecastData {
  current_month_expense: number;
  predicted_expense: number;
  change_percentage: number;
  next_month: string;
  months_used: number;
  monthly_expenses: {
    month: string;
    amount: number;
  }[];
}

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      const response = await api.get("/predictions/forecast");
      setForecast(response.data);
    } catch (error) {
      console.error("Failed to load forecast:", error);
      setError("Failed to load forecast.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading forecast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!forecast || forecast.months_used === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Expense Forecast
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <p className="text-slate-500">
            Add some expense transactions to generate a forecast.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Expense Forecast
        </h1>

        <p className="mt-2 text-slate-500">
          Forecast based on your actual expense history.
        </p>
      </div>


      {/* Prediction */}
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Current Month Expense
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₹{forecast.current_month_expense.toLocaleString("en-IN")}
          </p>
        </div>


        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Predicted Expense
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₹{forecast.predicted_expense.toLocaleString("en-IN")}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            For {forecast.next_month}
          </p>
        </div>


        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Expected Change
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${
              forecast.change_percentage >= 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {forecast.change_percentage >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(forecast.change_percentage).toFixed(1)}%
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Compared with current month
          </p>
        </div>

      </div>


      {/* Monthly History */}
      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="text-xl font-semibold">
          Expense History Used for Prediction
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Actual monthly expenses from your database.
        </p>

        <div className="mt-6 overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b">
                <th className="pb-3">
                  Month
                </th>

                <th className="pb-3">
                  Actual Expense
                </th>
              </tr>
            </thead>

            <tbody>

              {forecast.monthly_expenses.map((item) => (

                <tr
                  key={item.month}
                  className="border-b last:border-0"
                >

                  <td className="py-4">
                    {formatMonth(item.month)}
                  </td>

                  <td className="py-4 font-semibold">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Method */}
      <div className="rounded-xl bg-slate-50 p-6">

        <h2 className="font-semibold">
          How the prediction is calculated
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          The forecast uses the average of your most recent
          monthly expense values. As you add more transactions,
          the actual expense history is updated automatically.
        </p>

      </div>

    </div>
  );
}


function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1
  );

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
}