import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { Header, Footer } from "../components/Template";
import Phase1 from "./components/Phase1";
import Phase2 from "./components/Phase2";
import Phase3 from "./components/Phase3";

function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [appData, setAppData] = useState({
    phase1: null,
    phase2: null,
  });
  const [prediction, setPrediction] = useState([]);
  const handlePhase1Next = (data) => {
    setPrediction(data.prediction);
    setCurrentPhase(2);
  };

  const handlePhase2Next = (data) => {
    setAppData((prev) => ({
      ...prev,
      phase2: data,
    }));
    setCurrentPhase(3);
  };

  const handleBackToPhase1 = () => {
    setCurrentPhase(1);
  };

  const handleBackToPhase2 = () => {
    setCurrentPhase(2);
  };

  const handleRestart = () => {
    setAppData({ phase1: null, phase2: null });
    setCurrentPhase(1);
  };
  return (
    <div
      className="min-h-screen flex flex-col font-sans text-base-content"
      style={{
        backgroundColor: "#f8fafc",
        backgroundImage: `
             radial-gradient(at 0% 0%, hsla(253,16%,7%,0.03) 0, transparent 50%), 
             radial-gradient(at 50% 0%, hsla(225,39%,30%,0.03) 0, transparent 50%), 
             radial-gradient(at 100% 0%, hsla(339,49%,30%,0.03) 0, transparent 50%)
           `,
      }}
    >
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPhase === 1 && (
            <motion.div
              key="phase1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full flex items-center justify-center"
            >
              <Phase1 onNext={handlePhase1Next} initialData={appData.phase1} />
            </motion.div>
          )}

          {currentPhase === 2 && (
            <motion.div
              key="phase2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full flex items-center justify-center"
            >
              <Phase2
                prediction={prediction}
                onNext={handlePhase2Next}
                onBack={handleBackToPhase1}
                phase1Data={appData.phase1}
              />
            </motion.div>
          )}

          {currentPhase === 3 && (
            <motion.div
              key="phase3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="h-full flex items-center justify-center"
            >
              <Phase3
                userData2={appData.phase2}
                onBack={handleBackToPhase2}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
