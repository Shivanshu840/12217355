import type { ShortUrl, Click } from "./types"
import { info, debug } from "./logger"

const urls = new Map<string, ShortUrl>()

export const saveUrl = async (shortUrl: ShortUrl): Promise<void> => {
  urls.set(shortUrl.shortcode, shortUrl)
 
}

export const getUrl = async (shortcode: string): Promise<ShortUrl | null> => {
  await debug("db", `Fetching URL for shortcode: ${shortcode}`)
  const url = urls.get(shortcode) || null
  if (url) {
    
  } else {
   
  }
  return url
}

export const addClick = async (shortcode: string, click: Click): Promise<void> => {
 
  const url = urls.get(shortcode)
  if (url) {
    url.clicks.push(click)
  }
}

export const shortcodeExists = async (shortcode: string): Promise<boolean> => {
  const exists = urls.has(shortcode)
  return exists
}
