import RemoveBG from "./RemoveBG.tsx"
import "./build.css"

const App = () => {
  return (
    <div className="w-full h-full flex justify-center items-center" suppressHydrationWarning>
      <RemoveBG />
    </div>
  )
}

export default App
