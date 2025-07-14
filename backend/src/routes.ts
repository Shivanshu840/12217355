import { Router, type Request, type Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { saveUrl, getUrl, addClick, shortcodeExists } from "./storage"
import { generateShortcode, isValidUrl, isValidShortcode } from "./utils"
import type { ShortUrl, CreateUrlRequest, CreateUrlResponse, StatsResponse, Click } from "./types"
import { info, warn, error } from "./logger"

const router = Router()

router.post("/shorturls", async (req: Request, res: Response) => {
  try {
    await info("controller", "Creating new short URL")

    const { url, validity = 30, shortcode }: CreateUrlRequest = req.body

    if (!url) {
      await warn("controller", "URL is required")
      return res.status(400).json({ error: "URL is required" })
    }

    if (!(await isValidUrl(url))) {
      await warn("controller", `Invalid URL provided: ${url}`)
      return res.status(400).json({ error: "Invalid URL format" })
    }

    let finalShortcode = shortcode
    if (shortcode) {
      if (!(await isValidShortcode(shortcode))) {
        await warn("controller", `Invalid shortcode: ${shortcode}`)
        return res.status(400).json({ error: "Invalid shortcode format" })
      }
      if (await shortcodeExists(shortcode)) {
        await warn("controller", `Shortcode already exists: ${shortcode}`)
        return res.status(409).json({ error: "Shortcode already exists" })
      }
    } else {
      do {
        finalShortcode = await generateShortcode()
      } while (await shortcodeExists(finalShortcode))
    }

    const expiry = new Date(Date.now() + validity * 60 * 1000)
    const shortUrl: ShortUrl = {
      id: uuidv4(),
      url,
      shortcode: finalShortcode || "",
      expiry,
      created: new Date(),
      clicks: [],
    }

    await saveUrl(shortUrl)

    const response: CreateUrlResponse = {
      shortLink: `http://localhost:5000/${finalShortcode}`,
      expiry: expiry.toISOString(),
    }

    await info("controller", `Short URL created: ${finalShortcode}`)
    res.status(201).json(response)
  } catch (err: any) {
    await error("controller", `Error creating short URL: ${err.message}`)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/shorturls/:shortcode", async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params
    await info("controller", `Getting stats for shortcode: ${shortcode}`)

    const shortUrl = await getUrl(shortcode)
    if (!shortUrl) {
      await warn("controller", `Shortcode not found: ${shortcode}`)
      return res.status(404).json({ error: "Short URL not found" })
    }

    const response: StatsResponse = {
      totalClicks: shortUrl.clicks.length,
      originalUrl: shortUrl.url,
      createdAt: shortUrl.created.toISOString(),
      expiryAt: shortUrl.expiry.toISOString(),
      clicks: shortUrl.clicks.map((click) => ({
        timestamp: click.timestamp.toISOString(),
        referrer: click.referrer || "Direct",
        location: "Unknown",
      })),
    }

    await info("controller", `Stats retrieved for shortcode: ${shortcode}`)
    res.json(response)
  } catch (err: any) {
    await error("controller", `Error getting stats: ${err.message}`)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/:shortcode", async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params
    await info("controller", `Redirecting shortcode: ${shortcode}`)

    const shortUrl = await getUrl(shortcode)
    if (!shortUrl) {
      await warn("controller", `Shortcode not found for redirect: ${shortcode}`)
      return res.status(404).json({ error: "Short URL not found" })
    }

    if (new Date() > shortUrl.expiry) {
      await warn("controller", `Expired shortcode accessed: ${shortcode}`)
      return res.status(410).json({ error: "Short URL has expired" })
    }

    const click: Click = {
      timestamp: new Date(),
      referrer: req.get("Referer") || "",
      ip: req.ip || "",
      userAgent: req.get("User-Agent") || "",
    }

    await addClick(shortcode, click)
    await info("controller", `Redirecting to: ${shortUrl.url}`)

    res.redirect(shortUrl.url)
  } catch (err: any) {
    await error("controller", `Error redirecting: ${err.message}`)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
