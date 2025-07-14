"use client"

import type React from "react"
import { useState } from "react"
import UrlShortener from "./components/UrlShortener"
import Stats from "./components/Stats"
import { info } from "./logger"

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"shorten" | "stats">("shorten")

  const handleTabChange = async (tab: "shorten" | "stats") => {
    await info(`Switching to ${tab} tab`)
    setActiveTab(tab)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <header
        style={{
          backgroundColor: "#343a40",
          color: "white",
          padding: "20px 0",
          textAlign: "center",
        }}
      >
        <h1>URL Shortener Service</h1>
      </header>

      <nav
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #dee2e6",
          padding: "0",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex" }}>
          <button
            onClick={() => handleTabChange("shorten")}
            style={{
              padding: "15px 30px",
              border: "none",
              backgroundColor: activeTab === "shorten" ? "#007bff" : "transparent",
              color: activeTab === "shorten" ? "white" : "#007bff",
              cursor: "pointer",
              borderBottom: activeTab === "shorten" ? "3px solid #007bff" : "none",
            }}
          >
            Shorten URL
          </button>
          <button
            onClick={() => handleTabChange("stats")}
            style={{
              padding: "15px 30px",
              border: "none",
              backgroundColor: activeTab === "stats" ? "#28a745" : "transparent",
              color: activeTab === "stats" ? "white" : "#28a745",
              cursor: "pointer",
              borderBottom: activeTab === "stats" ? "3px solid #28a745" : "none",
            }}
          >
            View Stats
          </button>
        </div>
      </nav>

      <main style={{ padding: "40px 20px" }}>
        {activeTab === "shorten" && <UrlShortener />}
        {activeTab === "stats" && <Stats />}
      </main>

    </div>
  )
}

export default App
