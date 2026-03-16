import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./components/home";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 22, 36, 0.98)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </>
    </Suspense>
  );
}

export default App;
