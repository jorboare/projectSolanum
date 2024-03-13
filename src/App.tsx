import * as React from "react";
import SolarSystem from "./components/SolarSystem/SolarSystem";
import PlanetInputs from "./components/PlanetInputs/PlanetInputs";
import "./App.css";
import { AppProvider } from "./context/appContext";
import PlanetsList from "./components/PlanetsList/PlanetsList";
import Menu from "./components/Menu/Menu";
function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <PlanetInputs />
        <SolarSystem />
        <PlanetsList />
        <Menu />
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
