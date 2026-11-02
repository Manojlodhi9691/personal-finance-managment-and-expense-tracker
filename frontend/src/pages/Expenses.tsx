import { type FormEvent, useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../services/api";
import type { Transaction } from "../types";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Rent",
  "Other",
];

interface Account {
  id: number;
  name: string;
  account_type: string;
  opening_balance: number;
  balance?: number;
}

export default function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState("");

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load accounts
  const loadAccounts = async () => {
    try {
      const response = await api.get("/accounts/");
      setAccounts(response.data);

      // Automatically select first account
      if (response.data.length > 0) {
        setAccountId(String(response.data[0].id));
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError("Failed to load accounts.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Load expenses
  const loadTransactions = async () => {
    try {
      const response = await api.get("/transactions/");

      setTransactions(
        response.data.filter(
          (item: Transaction) =>
            item.transaction_type === "expense"
        )
      );
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  // Add expense
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!accountId) {
      setError("Please select an account.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post("/transactions/", {
        account_id: Number(accountId),
        amount: Number(amount),
        category,
        description,
        transaction_type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      // Clear form
      setAmount("");
      setDescription("");

      // Reload expenses
      await loadTransactions();
    } catch (err: any) {
      console.error("Failed to add expense:", err);

      const message =
        err?.response?.data?.detail ||
        "Failed to add expense.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-slate-500">
          Track where your money goes.
        </p>
      </div>

      {/* Add Expense */}
      <Card>
        <h2 className="mb-5 font-semibold">
          Add Expense
        </h2>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loadingAccounts ? (
          <p className="text-slate-500">
            Loading accounts...
          </p>
        ) : accounts.length === 0 ? (
          <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            No accounts found. Please create an account first.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-5"
          >
            {/* Account */}
            <select
              value={accountId}
              onChange={(e) =>
                setAccountId(e.target.value)
              }
              className="rounded-xl border px-4 py-3"
              required
            >
              <option value="">
                Select Account
              </option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                >
                  {account.name}
                </option>
              ))}
            </select>

            {/* Amount */}
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Amount"
              min="1"
              required
              className="rounded-xl border px-4 py-3"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border px-4 py-3"
            >
              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Description */}
            <input
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Description"
              required
              className="rounded-xl border px-4 py-3"
            />

            {/* Button */}
            <div className="flex items-center">
              <Button
                type="submit"
                {...({ disabled: submitting } as any)}
                className="w-full"
              >
                {submitting
                  ? "Adding..."
                  : "Add Expense"}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Expense History */}
      <Card>
        <h2 className="mb-5 font-semibold">
          Expense History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Date</th>
                <th className="p-3">Account</th>
                <th className="p-3">Description</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-slate-500"
                  >
                    No expenses found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const account = accounts.find(
                    (item) =>
                      item.id === (transaction as any).account_id
                  );

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b last:border-0"
                    >
                      <td className="p-3">
                        {transaction.date}
                      </td>

                      <td className="p-3">
                        {account?.name || "Unknown"}
                      </td>

                      <td className="p-3">
                        {transaction.description}
                      </td>

                      <td className="p-3">
                        {transaction.category}
                      </td>

                      <td className="p-3 text-right font-semibold text-red-600">
                        -₹
                        {transaction.amount.toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}