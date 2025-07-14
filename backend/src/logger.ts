type Stack = "backend"
type Level = "debug" | "info" | "warn" | "error" | "fatal"
type Pkg = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service"

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
    
  }
}

export const debug = (p: Pkg, m: string): Promise<void> => send("backend", "debug", p, m)
export const info = (p: Pkg, m: string): Promise<void> => send("backend", "info", p, m)
export const warn = (p: Pkg, m: string): Promise<void> => send("backend", "warn", p, m)
export const error = (p: Pkg, m: string): Promise<void> => send("backend", "error", p, m)
export const fatal = (p: Pkg, m: string): Promise<void> => send("backend", "fatal", p, m)
