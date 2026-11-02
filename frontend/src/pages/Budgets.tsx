import { useEffect, useState } from "react";
import api from "../services/api";

interface Budget {
  id: number;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets/");
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to load budgets:", err);
    }
  };

  const addBudget = async () => {
    if (!category || !amount) {
      alert("Please enter category and budget amount");
      return;
    }

    try {
      await api.post("/budgets/", {
        category: category,
        amount: Number(amount),
      });

      setCategory("");
      setAmount("");

      fetchBudgets();
    } catch (err) {
      console.error("Failed to create budget:", err);
      alert("Failed to create budget");
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await api.delete(`/budgets/${id}`);

      fetchBudgets();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  return (
    <div className="p-8 space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Budgets
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your spending limits and track your expenses.
        </p>
      </div>


      {/* Add Budget */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Create Budget
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            placeholder="Budget amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg px-4 py-3"
          />

          <button
            onClick={addBudget}
            className="bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700"
          >
            Add Budget
          </button>

        </div>

      </div>


      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {budgets.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              No budgets created yet.
            </p>
          </div>
        ) : (
          budgets.map((item) => {

            const percentage = Math.min(
              Math.max(item.percentage, 0),
              100
            );

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-6"
              >

                {/* Header */}
                <div className="flex justify-between items-center">

                  <div>
                    <h2 className="text-xl font-semibold">
                      {item.category}
                    </h2>

                    <p className="text-gray-500">
                      ₹{item.spent.toLocaleString()} spent
                      {" / "}
                      ₹{item.budget.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteBudget(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>

                </div>


                {/* Progress */}
                <div className="mt-5">

                  <div className="w-full bg-gray-200 rounded-full h-4">

                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>


                {/* Information */}
                <div className="flex justify-between mt-3 text-sm">

                  <span>
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
          })
        )}

      </div>

    </div>
  );
}