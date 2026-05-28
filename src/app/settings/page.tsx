"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Yukta Thakur");

  const [email, setEmail] = useState(
    "yuktaravindrathakur2006@gmail.com"
  );

  const [password, setPassword] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [autoSave, setAutoSave] = useState(false);

  const handleProfileSave = () => {
    localStorage.setItem(
      "profile",
      JSON.stringify({
        name,
        email,
      })
    );

    alert("Profile saved successfully!");
  };

  const handlePasswordUpdate = () => {
    if (!password) {
      alert("Enter password");
      return;
    }

    localStorage.setItem("password", password);

    alert("Password updated successfully!");

    setPassword("");
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Settings
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Profile */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-6">
            👤 Profile
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleProfileSave}
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-lg font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-6">
            🔒 Security
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400">
                Change Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="New Password"
                className="w-full mt-2 px-4 py-3 rounded-lg bg-black border border-zinc-700 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handlePasswordUpdate}
              className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-lg font-medium"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-6">
            ⚙️ Preferences
          </h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => {
                  setDarkMode(e.target.checked);

                  localStorage.setItem(
                    "darkMode",
                    JSON.stringify(e.target.checked)
                  );
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Email Notifications</span>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => {
                  setEmailNotifications(
                    e.target.checked
                  );

                  localStorage.setItem(
                    "emailNotifications",
                    JSON.stringify(e.target.checked)
                  );
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Auto Save</span>

              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => {
                  setAutoSave(e.target.checked);

                  localStorage.setItem(
                    "autoSave",
                    JSON.stringify(e.target.checked)
                  );
                }}
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950">
          <h2 className="text-2xl font-semibold mb-6">
            ℹ️ About
          </h2>

          <div className="space-y-3 text-zinc-300">
            <p className="font-semibold">
              AI App Generator
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