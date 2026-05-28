export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Settings
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Profile Settings */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-4">
            👤 Profile
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Yukta Thakur"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">
                Email
              </label>

              <input
                type="email"
                placeholder="yourmail@gmail.com"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg font-medium">
              Save Changes
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-4">
            🔒 Security
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">
                Change Password
              </label>

              <input
                type="password"
                placeholder="New Password"
                className="w-full mt-1 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <button className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-medium">
              Update Password
            </button>
          </div>
        </div>

        {/* App Preferences */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-4">
            ⚙️ Preferences
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <span>Email Notifications</span>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <span>Auto Save</span>

              <input type="checkbox" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-4">
            ℹ️ About
          </h2>

          <div className="space-y-3 text-zinc-300">
            <p>
              <span className="font-semibold">
                AI App Generator
              </span>
            </p>

            <p>Version: 1.0.0</p>

            <p>
              Built using Next.js, Prisma, SQLite,
              Tailwind CSS and TypeScript.
            </p>

            <p className="text-sm text-zinc-500 mt-4">
              © 2026 Smart CRM Platform
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}