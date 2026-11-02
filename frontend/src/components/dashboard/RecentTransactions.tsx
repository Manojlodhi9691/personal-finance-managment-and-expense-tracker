import type { Transaction } from "../../types";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No transactions yet.
        </p>
      ) : (
        transactions.slice(0, 6).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
          >
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-xs text-slate-500">
                {transaction.category}
              </p>
            </div>

            <span
              className={
                transaction.transaction_type === "income"
                  ? "font-semibold text-emerald-600"
                  : "font-semibold text-red-600"
              }
            >
              {transaction.transaction_type === "income" ? "+" : "-"}₹
              {transaction.amount.toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}