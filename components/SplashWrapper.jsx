"use client";

import { useState } from "react";
import SplashScreen from "./SplashScreen";

export default function SplashWrapper({ children }) {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return children;
}
