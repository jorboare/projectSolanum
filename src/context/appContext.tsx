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
  satellites: Satellite[];
}

interface Satellite {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
}

interface AppContextType {
  state: AppState;
  tempPlanet?: Planet;
  updateState: (newState: AppState) => void;
  cleanState: () => void;
  selectPlanet: (id: string) => void;
  deselectPlanet: (id: string) => void;
  selectedPlanets: string[];
  planetsNumber: () => number;
  updateTempPlanet: (planet?: Planet) => void;
  cleanTempPlanet: () => void;
  preview: boolean;
  setPreview: (preview: boolean) => void;
  handleOrbits: () => void;
  orbits: boolean;
  setMouseInactive: (mouseStatus: boolean) => void;
  mouseInactive: boolean;
  deletePlanets: () => void;
  addSatellites: boolean;
  setAddSatellites: (addSatellite: boolean) => void;
  saveSatellite: (newSatellite: Satellite) => void;
  sun: Planet | undefined;
  setSun: (sun: Planet) => void;
  setHightContrast: (contrast: boolean) => void;
  hightContrast: boolean;
  setDemo: () => void;
  setPosition: (pos: any) => void;
  position: any;
  followedPlanet: string;
  setFollowedPlanet: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialAppState = {
    planets: [],
  };

  const initialAppStateDemo = {
    planets: [
      {
        id: "1",
        color: "#4458dc",
        orbitRadius: 656,
        planetRadius: 0,
        distance: 150,
        pattern: "none",
        speed: 0.78,
        initialAngle: 132,
        selected: false,
        satellites: [
          {
            id: "1a",
            color: "#ff9d00",
            orbitRadius: 100,
            planetRadius: 40,
            distance: 40,
            pattern: "none",
            speed: 1,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "1b",
            color: "#e31e00",
            orbitRadius: 100,
            planetRadius: 40,
            distance: 40,
            pattern: "none",
            speed: 1,
            initialAngle: 180,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "2",
        color: "#035d00",
        orbitRadius: 656,
        planetRadius: 50,
        distance: 300,
        pattern: "none",
        speed: 0.5,
        initialAngle: 199,
        selected: false,
        satellites: [
          {
            id: "2a",
            color: "#818181",
            orbitRadius: 100,
            planetRadius: 10,
            distance: 40,
            pattern: "none",
            speed: 2,
            initialAngle: 180,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "3",
        color: "#443f63",
        orbitRadius: 656,
        planetRadius: 40,
        distance: 370,
        pattern: "none",
        speed: 0.4,
        initialAngle: 20,
        selected: false,
        satellites: [
          {
            id: "3a",
            color: "#ea652b",
            orbitRadius: 100,
            planetRadius: 10,
            distance: 40,
            pattern: "none",
            speed: 0.7,
            initialAngle: 180,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "4",
        color: "#7dc978",
        orbitRadius: 656,
        planetRadius: 60,
        distance: 550,
        pattern: "none",
        speed: 0.4,
        initialAngle: 20,
        selected: false,
        satellites: [],
      },
      {
        id: "5",
        color: "#61f7ff",
        orbitRadius: 656,
        planetRadius: 53,
        distance: 670,
        pattern: "none",
        speed: 0.2,
        initialAngle: 256,
        selected: false,
        satellites: [],
      },
    ],
  };

  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : initialAppState;
  });
  const [tempPlanet, setTempPlanet] = useState<Planet | undefined>(undefined);
  const [sun, setSun] = useState<Planet | undefined>({
    id: "0",
    orbitRadius: 0,
    planetRadius: 80,
    distance: 0,
    color: "#ffe500",
    pattern: "none",
    speed: 0,
    initialAngle: 0,
    satellites: [],
  });
  const [preview, setPreview] = useState(false);
  const [orbits, setOrbits] = useState(true);
  const [mouseInactive, setMouseInactive] = useState<boolean>(false);
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]);
  const [addSatellites, setAddSatellites] = useState<boolean>(false);
  const [hightContrast, setHightContrast] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);

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
    if (!selectedPlanets.some((e) => e === id)) {
      setSelectedPlanets([...selectedPlanets, id]);
    } else deselectPlanet(id);
  };

  const deselectPlanet = (id: string | undefined) => {
    if (id) {
      const index = selectedPlanets.findIndex((e) => e === id);
      const newSelectedPlanets = [...selectedPlanets];
      newSelectedPlanets.splice(index, 1);
      setSelectedPlanets(newSelectedPlanets);
    } else setSelectedPlanets([]);
  };

  const deletePlanets = () => {
    if (selectedPlanets.length) {
      const updatedPlanets = state.planets.filter(
        (p) => !selectedPlanets.some((sp) => p.id === sp)
      );

      setState({ ...state, planets: updatedPlanets });
    }
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

  const saveSatellite = (newSatellite: Satellite) => {
    if (selectedPlanets.length === 1 && addSatellites) {
      const newPlanets = state.planets.map((p) => {
        if (p.id === selectedPlanets[0]) {
          p.satellites.push(newSatellite);
          return p;
        } else return p;
      });
      setState({ ...state, planets: newPlanets });
    }
  };

  const setDemo = () => {
    const quantumMoon = {
      id: "6",
      color: "#f4f4f4",
      orbitRadius: 100,
      planetRadius: 10,
      distance: 65,
      pattern: "none",
      speed: 0.7,
      initialAngle: 60,
      selected: false,
      satellites: [],
    };

    var item =
      initialAppStateDemo.planets[
        Math.floor(Math.random() * initialAppStateDemo.planets.length)
      ];

    item.satellites.push(quantumMoon);

    const demoCopy = initialAppStateDemo.planets.map((e) => {
      console.log(e);
      if (e.id === item.id) return item;
      else return e;
    });
    console.log(item);
    console.log(demoCopy);

    setState({ ...initialAppStateDemo, planets: demoCopy });
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
        selectedPlanets,
        deletePlanets,
        addSatellites,
        setAddSatellites,
        saveSatellite,
        sun,
        setSun,
        hightContrast,
        setHightContrast,
        setDemo,
        position,
        setPosition,
        followedPlanet,
        setFollowedPlanet,
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
