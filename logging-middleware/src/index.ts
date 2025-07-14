import { send } from "./client"
import type { Stack, Level, Pkg } from "./types"

export const Log = (s: Stack, l: Level, p: Pkg, m: string): Promise<void> => {
  return send(s, l, p, m)
}

export const debug = (s: Stack, p: Pkg, m: string): Promise<void> => {
  return send(s, "debug", p, m)
}

export const info = (s: Stack, p: Pkg, m: string): Promise<void> => {
  return send(s, "info", p, m)
}

export const warn = (s: Stack, p: Pkg, m: string): Promise<void> => {
  return send(s, "warn", p, m)
}

export const error = (s: Stack, p: Pkg, m: string): Promise<void> => {
  return send(s, "error", p, m)
}

export const fatal = (s: Stack, p: Pkg, m: string): Promise<void> => {
  return send(s, "fatal", p, m)
}

export type { Stack, Level, Pkg }
