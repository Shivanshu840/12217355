import { debug, info } from "./logger"

export const generateShortcode = async (): Promise<string> => {
  await debug("service", "Generating new shortcode")
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  await info("service", `Generated shortcode: ${result}`)
  return result
}

export const isValidUrl = async (url: string): Promise<boolean> => {
  await debug("service", `Validating URL: ${url}`)
  try {
    new URL(url)
    await info("service", `URL is valid: ${url}`)
    return true
  } catch {
    await info("service", `URL is invalid: ${url}`)
    return false
  }
}

export const isValidShortcode = async (shortcode: string): Promise<boolean> => {
  await debug("service", `Validating shortcode: ${shortcode}`)
  const valid = /^[a-zA-Z0-9]{1,10}$/.test(shortcode)
  await info("service", `Shortcode ${shortcode} is valid: ${valid}`)
  return valid
}
