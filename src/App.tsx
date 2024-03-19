import * as React from "react";
import SolarSystem from "./components/SolarSystem/SolarSystem";
import "./App.css";
import { AppProvider } from "./context/appContext";
import PlanetsList from "./components/PlanetsList/PlanetsList";
import Menu from "./components/Menu/Menu";
function App() {
  return (
    <React.StrictMode>
      <AppProvider>
        <SolarSystem />
        <PlanetsList />
        <Menu />
      </AppProvider>
    </React.StrictMode>
  );
}

export default App;
