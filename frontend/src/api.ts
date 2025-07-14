import { info, error } from "./logger"

const API_BASE = "http://localhost:5000"

export interface CreateUrlRequest {
  url: string
  validity?: number
  shortcode?: string
}

export interface CreateUrlResponse {
  shortLink: string
  expiry: string
}

export interface StatsResponse {
  totalClicks: number
  originalUrl: string
  createdAt: string
  expiryAt: string
  clicks: Array<{
    timestamp: string
    referrer: string
    location: string
  }>
}

export const createShortUrl = async (data: CreateUrlRequest): Promise<CreateUrlResponse> => {
  try {
    await info(`Creating short URL for: ${data.url}`)

    const response = await fetch(`${API_BASE}/shorturls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      await error(`Failed to create short URL: ${errorData.error}`)
      throw new Error(errorData.error || "Failed to create short URL")
    }

    const result = await response.json()
    await info(`Short URL created successfully: ${result.shortLink}`)
    return result
  } catch (err: any) {
    await error(`Error creating short URL: ${err.message}`)
    throw err
  }
}

export const getStats = async (shortcode: string): Promise<StatsResponse> => {
  try {
    await info(`Getting stats for shortcode: ${shortcode}`)

    const response = await fetch(`${API_BASE}/shorturls/${shortcode}`)

    if (!response.ok) {
      const errorData = await response.json()
      await error(`Failed to get stats: ${errorData.error}`)
      throw new Error(errorData.error || "Failed to get stats")
    }

    const result = await response.json()
    await info(`Stats retrieved for shortcode: ${shortcode}`)
    return result
  } catch (err: any) {
    await error(`Error getting stats: ${err.message}`)
    throw err
  }
}
