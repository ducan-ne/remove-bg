import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./App.css"

const container = document.getElementById("remove-bg")!
const root = createRoot(container)

root.render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center items-center">
        <div className="p-10 w-[1024px]">
          <App />
        </div>
      </div>
    </Suspense>
  </StrictMode>,
)
