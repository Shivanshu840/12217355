export interface ShortUrl {
  id: string
  url: string
  shortcode: string
  expiry: Date
  created: Date
  clicks: Click[]
}

export interface Click {
  timestamp: Date
  referrer: string
  ip: string
  userAgent: string
}

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
  clicks: ClickData[]
}

export interface ClickData {
  timestamp: string
  referrer: string
  location: string
}
