import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { info } from "./logger"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

info("React app starting")

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
