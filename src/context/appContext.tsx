import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AppState {
  planets: Planet[];
}

interface Planet {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
  satellites?: Satellite[];
}

interface Satellite {
  radius: number;
  distance: number;
  color: string;
  pattern: string;
}

interface AppContextType {
  state: AppState;
  tempPlanet?: Planet;
  updateState: (newState: AppState) => void;
  cleanState: () => void;
  selectPlanet: (id: string) => void;
  deselectPlanet: () => void;
  selectedPlanet: string;
  planetsNumber: () => number;
  updateTempPlanet: (planet?: Planet) => void;
  cleanTempPlanet: () => void;
  preview: boolean;
  setPreview: (preview: boolean) => void;
  handleOrbits: () => void;
  orbits: boolean;
  setMouseInactive: (mouseStatus: boolean) => void;
  mouseInactive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialAppState = {
    planets: [
      {
        id: "0",
        orbitRadius: 0,
        planetRadius: 80,
        distance: 0,
        color: "#ffe500",
        pattern: "none",
        speed: 0,
        initialAngle: 0,
        satellites: [],
      },
    ],
  };

  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : initialAppState;
  });
  const [tempPlanet, setTempPlanet] = useState<Planet | undefined>(undefined);
  const [preview, setPreview] = useState(false);
  const [orbits, setOrbits] = useState(true);
  const [mouseInactive, setMouseInactive] = useState<boolean>(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  const updateState = (newState: AppState) => {
    console.log("Prev state --->", state);
    setState(newState);
    console.log("New state --->", newState);
  };

  const cleanState = () => {
    setState(initialAppState);
  };

  const selectPlanet = (id: string) => {
    setSelectedPlanet(id);
  };

  const deselectPlanet = () => {
    setSelectedPlanet("");
  };

  const planetsNumber = () => {
    return state.planets.length;
  };

  const updateTempPlanet = (planet?: Planet) => {
    setTempPlanet(planet);
  };

  const cleanTempPlanet = () => {
    setTempPlanet(undefined);
  };

  const handleOrbits = () => {
    setOrbits(!orbits);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        tempPlanet,
        updateState,
        cleanState,
        selectPlanet,
        deselectPlanet,
        planetsNumber,
        updateTempPlanet,
        cleanTempPlanet,
        setPreview,
        preview,
        handleOrbits,
        orbits,
        mouseInactive,
        setMouseInactive,
        selectedPlanet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
