import Card from "../components/ui/Card";

export default function Settings() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">
          Manage your account preferences.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold">Profile</h2>

        <div className="mt-5 space-y-4">
          <input
            defaultValue="Manoj"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            defaultValue="manoj@example.com"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Save Changes
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold">Preferences</h2>

        <div className="mt-5 space-y-4">
          <div className="flex justify-between">
            <span>Currency</span>

            <select className="rounded-lg border px-3 py-2">
              <option>INR - ₹</option>
              <option>USD - $</option>
              <option>EUR - €</option>
            </select>
          </div>

          <div className="flex justify-between">
            <span>Theme</span>

            <select className="rounded-lg border px-3 py-2">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}