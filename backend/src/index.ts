import express from "express"
import cors from "cors"
import routes from "./routes"
import { info, error } from "./logger"

const app = express()
const port = 5000

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

app.use(async (req, res, next) => {
  await info("handler", `${req.method} ${req.url}`)
  next()
})

app.use("/", routes)

app.listen(port, async () => {
  console.log(`Server running on port ${port}`)
})
