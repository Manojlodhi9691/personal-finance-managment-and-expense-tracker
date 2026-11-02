import type { LucideIcon } from "lucide-react";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="rounded-xl bg-slate-100 p-2.5">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>

      {change && (
        <p className="mt-2 text-sm text-emerald-600">
          {change}
        </p>
      )}
    </Card>
  );
}