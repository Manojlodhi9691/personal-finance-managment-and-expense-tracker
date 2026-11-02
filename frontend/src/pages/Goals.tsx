import Card from "../components/ui/Card";

const goals = [
  {
    name: "New Laptop",
    current: 45000,
    target: 80000,
  },
  {
    name: "Emergency Fund",
    current: 60000,
    target: 100000,
  },
  {
    name: "Vacation",
    current: 18000,
    target: 50000,
  },
];

export default function Goals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Savings Goals</h1>
        <p className="text-slate-500">
          Turn your plans into financial goals.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const percentage = Math.round(
            (goal.current / goal.target) * 100
          );

          return (
            <Card key={goal.name}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{goal.name}</h2>
                <span className="text-sm font-semibold">
                  {percentage}%
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold">
                ₹{goal.current.toLocaleString()}
              </p>

              <p className="text-sm text-slate-500">
                of ₹{goal.target.toLocaleString()}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}