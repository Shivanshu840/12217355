import type { Stack, Level, Pkg } from "./types"

const url = "http://20.244.56.144/evaluation-service/logs"

export const send = async (s: Stack, l: Level, p: Pkg, m: string): Promise<void> => {
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
