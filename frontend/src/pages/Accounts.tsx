import { type FormEvent, useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../services/api";

interface Account {
  id: number;
  name: string;
  account_type: string;
  opening_balance: number;
  balance: number;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("Bank");
  const [openingBalance, setOpeningBalance] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load accounts
  const loadAccounts = async () => {
    try {
      const response = await api.get("/accounts/");
      setAccounts(response.data);
    } catch (error) {
      console.error("Failed to load accounts:", error);
      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Create account
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError("");

      await api.post("/accounts/", {
        name: name,
        account_type: accountType,
        opening_balance: Number(openingBalance),
      });

      // Clear form
      setName("");
      setAccountType("Bank");
      setOpeningBalance("");

      // Reload accounts
      await loadAccounts();
    } catch (error: any) {
      console.error("Failed to create account:", error);

      setError(
        error?.response?.data?.detail ||
          "Failed to create account."
      );
    }
  }

  // Delete account
  async function handleDelete(id: number) {
    try {
      await api.delete(`/accounts/${id}`);
      await loadAccounts();
    } catch (error: any) {
      console.error("Failed to delete account:", error);

      setError(
        error?.response?.data?.detail ||
          "Failed to delete account."
      );
    }
  }

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Accounts
        </h1>

        <p className="text-slate-500">
          Manage your bank accounts, cash and other sources of money.
        </p>
      </div>

      {/* Create Account */}
      <Card>
        <h2 className="mb-5 font-semibold">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-4"
        >

          {/* Account Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Account name"
            required
            className="rounded-xl border px-4 py-3"
          />

          {/* Account Type */}
          <select
            value={accountType}
            onChange={(e) =>
              setAccountType(e.target.value)
            }
            className="rounded-xl border px-4 py-3"
          >
            <option value="Bank">
              Bank
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="Credit Card">
              Credit Card
            </option>

            <option value="Savings">
              Savings
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* Opening Balance */}
          <input
            type="number"
            value={openingBalance}
            onChange={(e) =>
              setOpeningBalance(e.target.value)
            }
            placeholder="Opening balance"
            min="0"
            required
            className="rounded-xl border px-4 py-3"
          />

          {/* Button */}
          <Button type="submit">
            Create Account
          </Button>

        </form>
      </Card>

      {/* Account List */}
      <Card>
        <h2 className="mb-5 font-semibold">
          Your Accounts
        </h2>

        {loading ? (
          <p className="text-slate-500">
            Loading accounts...
          </p>
        ) : accounts.length === 0 ? (
          <p className="text-slate-500">
            No accounts created yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {accounts.map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border p-5"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <h3 className="font-semibold">
                      {account.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {account.account_type}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(account.id)
                    }
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>

                </div>

                <p className="mt-5 text-2xl font-bold">
                  ₹
                  {account.balance.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Current balance
                </p>

              </div>
            ))}

          </div>
        )}
      </Card>

    </div>
  );
}