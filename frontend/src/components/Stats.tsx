"use client"

import type React from "react"
import { useState } from "react"
import { getStats, type StatsResponse } from "../api"
import { info, error } from "../logger"

const Stats: React.FC = () => {
  const [shortcode, setShortcode] = useState("")
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shortcode.trim()) {
      setErrorMsg("Shortcode is required")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setStats(null)

    try {
      await info(`Getting stats for shortcode: ${shortcode}`)
      const response = await getStats(shortcode.trim())
      setStats(response)
      await info("Stats retrieved successfully")
    } catch (err: any) {
      setErrorMsg(err.message)
      await error(`Stats retrieval failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>URL Statistics</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Shortcode *</label>
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="abcd1"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Get Stats"}
        </button>
      </form>

      {errorMsg && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {stats && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "4px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3>Statistics</h3>
          <p>
            <strong>Original URL:</strong>{" "}
            <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer">
              {stats.originalUrl}
            </a>
          </p>
          <p>
            <strong>Total Clicks:</strong> {stats.totalClicks}
          </p>
          <p>
            <strong>Created:</strong> {new Date(stats.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Expires:</strong> {new Date(stats.expiryAt).toLocaleString()}
          </p>

          {stats.clicks.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>Click History</h4>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {stats.clicks.map((click, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      margin: "5px 0",
                      backgroundColor: "white",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                    }}
                  >
                    <p>
                      <strong>Time:</strong> {new Date(click.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Referrer:</strong> {click.referrer || "Direct"}
                    </p>
                    <p>
                      <strong>Location:</strong> {click.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Stats
