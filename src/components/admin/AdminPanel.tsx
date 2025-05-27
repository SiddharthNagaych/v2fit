"use client";
import { useState } from "react";
import UsersTab from "./tabs/UserTab";
import GymsTab from "./tabs/GymTab";
import ProgramsTab from "./tabs/ProgramTab";
import ScheduleTab from "./tabs/ScheduleTab";

const tabs = ["Users", "Gyms", "Programs", "Schedule"];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Users");

  const renderTab = () => {
    switch (activeTab) {
      case "Users":
        return <UsersTab />;
      case "Gyms":
        return <GymsTab />;
      case "Programs":
        return <ProgramsTab />;
      case "Schedule":
        return <ScheduleTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 border-r border-gray-200">
        <h2 className="text-xl font-bold text-[#C15364] mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#C15364] text-white"
                  : "text-[#858B95] hover:bg-[#C15364]/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderTab()}</main>
    </div>
  );
}
