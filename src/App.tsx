import React, { useState, useEffect } from "react";
import SolarSystem from "./components/SolarSystem/SolarSystem";
import PlanetInputs from "./components/PlanetInputs/PlanetInputs";
import "./App.css";
import { AppProvider } from "./context/appContext";
import PlanetsList from "./components/PlanetsList/PlanetsList";

function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <PlanetInputs />
        <SolarSystem />
        <PlanetsList />
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
