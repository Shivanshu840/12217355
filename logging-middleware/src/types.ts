export type Stack = "backend" | "frontend"

export type Level = "debug" | "info" | "warn" | "error" | "fatal"

export type BackendPkg =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"

export type FrontendPkg = "api"

export type Pkg = BackendPkg | FrontendPkg
