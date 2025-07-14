"use client"

import type React from "react"
import { useState } from "react"
import { createShortUrl, type CreateUrlRequest, type CreateUrlResponse } from "../api"
import { info, error } from "../logger"

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState("")
  const [validity, setValidity] = useState(30)
  const [shortcode, setShortcode] = useState("")
  const [result, setResult] = useState<CreateUrlResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setErrorMsg("URL is required")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setResult(null)

    try {
      await info("Form submitted for URL shortening")

      const data: CreateUrlRequest = {
        url,
        validity: validity || 30,
      }

      if (shortcode.trim()) {
        data.shortcode = shortcode.trim()
      }

      const response = await createShortUrl(data)
      setResult(response)

      await info("URL shortened successfully")
    } catch (err: any) {
      setErrorMsg(err.message)
      await error(`URL shortening failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>URL Shortener</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Long URL *</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Validity (minutes)</label>
          <input
            type="number"
            value={validity}
            onChange={(e) => setValidity(Number.parseInt(e.target.value) || 30)}
            min="1"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Custom Shortcode (optional)</label>
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="mycode"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Creating..." : "Shorten URL"}
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

      {result && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          <h3>Short URL Created!</h3>
          <p>
            <strong>Short Link:</strong>{" "}
            <a href={result.shortLink} target="_blank" rel="noopener noreferrer">
              {result.shortLink}
            </a>
          </p>
          <p>
            <strong>Expires:</strong> {new Date(result.expiry).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default UrlShortener
