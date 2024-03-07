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

interface MapStateObject {
  scale: number;
  translation: {
    x: number;
    y: number;
  };
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
  setPositions: (pos: any) => void;
  positions: any;
  followedPlanet: string | null;
  setFollowedPlanet: (id: string | null) => void;
  mapState: MapStateObject;
  setMapState: (state: MapStateObject) => void;
  resetMapState: () => void;
  showPlanetList: boolean;
  setShowPlanetList: (show: boolean) => void;
  showPlanetInput: boolean;
  setShowPlanetInput: (show: boolean) => void;
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
        color: "",
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
            color: "#c07600",
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
            color: "#ac1700",
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
        color: "#024600",
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
            color: "#5c5c5c",
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
        color: "#34304c",
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
            color: "#8b3b19",
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
        color: "#446c41",
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
        color: "#399095",
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
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null);
  const [mapState, setMapState] = useState({
    scale: 0.5,
    translation: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
  });
  const [showPlanetList, setShowPlanetList] = useState<boolean>(false);
  const [showPlanetInput, setShowPlanetInput] = useState<boolean>(false);

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

  const deselectPlanet = (id?: string) => {
    if (id) {
      const index = selectedPlanets.findIndex((e) => e === id);
      const newSelectedPlanets = [...selectedPlanets];
      newSelectedPlanets.splice(index, 1);
      setSelectedPlanets(newSelectedPlanets);
      if (id === followedPlanet) setFollowedPlanet(null);
    } else {
      setFollowedPlanet(null);
      setSelectedPlanets([]);
    }
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

  const resetMapState = () => {
    setMapState({
      scale: 0.5,
      translation: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
    });
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
      if (e.id === item.id) return item;
      else return e;
    });

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
        positions,
        setPositions,
        followedPlanet,
        setFollowedPlanet,
        mapState,
        setMapState,
        resetMapState,
        showPlanetList,
        setShowPlanetList,
        showPlanetInput,
        setShowPlanetInput,
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
