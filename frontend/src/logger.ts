type Stack = "frontend"
type Level = "debug" | "info" | "warn" | "error" | "fatal"
type Pkg = "api"

const url = "http://20.244.56.144/evaluation-service/logs"

const send = async (s: Stack, l: Level, p: Pkg, m: string): Promise<void> => {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stack: s,
        level: l,
        package: p,
        message: m,
      }),
    })
  } catch (e) {
    // Silent fail
  }
}

export const info = (m: string): Promise<void> => send("frontend", "info", "api", m)
export const error = (m: string): Promise<void> => send("frontend", "error", "api", m)
export const warn = (m: string): Promise<void> => send("frontend", "warn", "api", m)
export const debug = (m: string): Promise<void> => send("frontend", "debug", "api", m)
