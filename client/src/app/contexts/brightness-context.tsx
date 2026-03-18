import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface BrightnessContextType {
  isBright: boolean;
  toggleBrightness: () => void;
}

const BrightnessContext = createContext<BrightnessContextType | null>(null);

export function BrightnessProvider({ children }: { children: ReactNode }) {
  const [isBright, setIsBright] = useState(false);

  const toggleBrightness = () => setIsBright((prev) => !prev);

  useEffect(() => {
    if (isBright) {
      document.body.classList.add("bright-mode");
    } else {
      document.body.classList.remove("bright-mode");
    }
    return () => document.body.classList.remove("bright-mode");
  }, [isBright]);

  return (
    <BrightnessContext.Provider value={{ isBright, toggleBrightness }}>
      {children}
    </BrightnessContext.Provider>
  );
}

export function useBrightness() {
  const ctx = useContext(BrightnessContext);
  if (!ctx) throw new Error("useBrightness must be used inside BrightnessProvider");
  return ctx;
}
