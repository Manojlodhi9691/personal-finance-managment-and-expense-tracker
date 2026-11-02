import { useEffect, useState } from "react";
import api from "../../services/api";

interface Budget {
  id: number;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export default function BudgetProgress() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets/");
      setBudgets(response.data);
    } catch (error) {
      console.error("Failed to load dashboard budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading budgets...
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-gray-500">
        No budgets created yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {budgets.map((item) => {
        const percentage = Math.min(
          Math.max(item.percentage, 0),
          100
        );

        return (
          <div key={item.id}>

            {/* Category and amount */}
            <div className="flex justify-between items-center mb-2">

              <span className="font-medium text-gray-700">
                {item.category}
              </span>

              <span className="text-sm text-gray-500">
                ₹{item.spent.toLocaleString()} / ₹
                {item.budget.toLocaleString()}
              </span>

            </div>


            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            {/* Percentage and remaining */}
            <div className="flex justify-between mt-2 text-sm">

              <span className="text-gray-500">
                {item.percentage.toFixed(1)}% used
              </span>

              <span
                className={
                  item.remaining >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {item.remaining >= 0
                  ? `₹${item.remaining.toLocaleString()} remaining`
                  : `₹${Math.abs(
                      item.remaining
                    ).toLocaleString()} over budget`}
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}