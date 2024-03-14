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
  setThirdDimension: (dimension: boolean) => void;
  thirdDimension: boolean;
  handleFullScreen: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialAppState = {
    planets: [],
  };

  // const initialAppStateDemo = {
  //   planets: [
  //     {
  //       id: "1",
  //       color: "",
  //       orbitRadius: 656,
  //       planetRadius: 0,
  //       distance: 150,
  //       pattern: "none",
  //       speed: 0.78,
  //       initialAngle: 132,
  //       selected: false,
  //       satellites: [
  //         {
  //           id: "1a",
  //           color: "#c07600",
  //           orbitRadius: 100,
  //           planetRadius: 40,
  //           distance: 40,
  //           pattern: "none",
  //           speed: 1,
  //           initialAngle: 0,
  //           selected: false,
  //           satellites: [],
  //         },
  //         {
  //           id: "1b",
  //           color: "#ac1700",
  //           orbitRadius: 100,
  //           planetRadius: 40,
  //           distance: 40,
  //           pattern: "none",
  //           speed: 1,
  //           initialAngle: 180,
  //           selected: false,
  //           satellites: [],
  //         },
  //       ],
  //     },
  //     {
  //       id: "2",
  //       color: "#024600",
  //       orbitRadius: 656,
  //       planetRadius: 50,
  //       distance: 300,
  //       pattern: "none",
  //       speed: 0.5,
  //       initialAngle: 199,
  //       selected: false,
  //       satellites: [
  //         {
  //           id: "2a",
  //           color: "#5c5c5c",
  //           orbitRadius: 100,
  //           planetRadius: 10,
  //           distance: 40,
  //           pattern: "none",
  //           speed: 2,
  //           initialAngle: 180,
  //           selected: false,
  //           satellites: [],
  //         },
  //       ],
  //     },
  //     {
  //       id: "3",
  //       color: "#34304c",
  //       orbitRadius: 656,
  //       planetRadius: 40,
  //       distance: 370,
  //       pattern: "none",
  //       speed: 0.4,
  //       initialAngle: 20,
  //       selected: false,
  //       satellites: [
  //         {
  //           id: "3a",
  //           color: "#8b3b19",
  //           orbitRadius: 100,
  //           planetRadius: 10,
  //           distance: 40,
  //           pattern: "none",
  //           speed: 0.7,
  //           initialAngle: 180,
  //           selected: false,
  //           satellites: [],
  //         },
  //       ],
  //     },
  //     {
  //       id: "4",
  //       color: "#446c41",
  //       orbitRadius: 656,
  //       planetRadius: 60,
  //       distance: 550,
  //       pattern: "none",
  //       speed: 0.4,
  //       initialAngle: 20,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "5",
  //       color: "#399095",
  //       orbitRadius: 656,
  //       planetRadius: 53,
  //       distance: 670,
  //       pattern: "none",
  //       speed: 0.2,
  //       initialAngle: 256,
  //       selected: false,
  //       satellites: [],
  //     },
  //   ],
  // };

  // const initialAppStateDemoRealScale = {
  //   planets: [
  //     {
  //       id: "1",
  //       color: "#676767",
  //       orbitRadius: 200,
  //       planetRadius: 2,
  //       distance: 100,
  //       pattern: "none",
  //       speed: 1,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "2",
  //       color: "#93660e",
  //       orbitRadius: 656,
  //       planetRadius: 5,
  //       distance: 108,
  //       pattern: "none",
  //       speed: 0.615,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "3",
  //       color: "#29688a",
  //       orbitRadius: 298,
  //       planetRadius: 2,
  //       distance: 149,
  //       pattern: "none",
  //       speed: 0.24,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "4",
  //       color: "#b64913",
  //       orbitRadius: 454,
  //       planetRadius: 57,
  //       distance: 227,
  //       pattern: "none",
  //       speed: 0.152,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "5",
  //       color: "#c29d66",
  //       orbitRadius: 1556,
  //       planetRadius: 47,
  //       distance: 778,
  //       pattern: "none",
  //       speed: 0.038,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "6",
  //       color: "#e0d68a",
  //       orbitRadius: 2854,
  //       planetRadius: 20,
  //       distance: 1427,
  //       pattern: "none",
  //       speed: 0.016,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "7",
  //       color: "#79f8ff",
  //       orbitRadius: 5740,
  //       planetRadius: 20,
  //       distance: 2870,
  //       pattern: "none",
  //       speed: 0.0057,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //     {
  //       id: "8",
  //       color: "#0d65c9",
  //       orbitRadius: 8996,
  //       planetRadius: 53,
  //       distance: 4498,
  //       pattern: "none",
  //       speed: 0.003,
  //       initialAngle: 0,
  //       selected: false,
  //       satellites: [],
  //     },
  //   ],
  // };

  const initialAppStateDemo = {
    planets: [
      {
        id: "1",
        color: "#676767",
        orbitRadius: 200,
        planetRadius: 8,
        distance: 100,
        pattern: "none",
        speed: 1,
        initialAngle: 0,
        selected: false,
        satellites: [],
      },
      {
        id: "2",
        color: "#93660e",
        orbitRadius: 350,
        planetRadius: 15,
        distance: 175,
        pattern: "none",
        speed: 0.615,
        initialAngle: 0,
        selected: false,
        satellites: [],
      },
      {
        id: "3",
        color: "#29688a",
        orbitRadius: 500,
        planetRadius: 15,
        distance: 250,
        pattern: "none",
        speed: 0.24,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "3a",
            color: "#8b8b8b",
            orbitRadius: 100,
            planetRadius: 5,
            distance: 25,
            pattern: "none",
            speed: 1,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "4",
        color: "#b64913",
        orbitRadius: 650,
        planetRadius: 9,
        distance: 325,
        pattern: "none",
        speed: 0.152,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "4a",
            color: "#a97f40",
            orbitRadius: 100,
            planetRadius: 3,
            distance: 25,
            pattern: "none",
            speed: 0.9,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "4b",
            color: "#701818",
            orbitRadius: 100,
            planetRadius: 7,
            distance: 35,
            pattern: "none",
            speed: 0.6,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "5",
        color: "#c29d66",
        orbitRadius: 800,
        planetRadius: 57,
        distance: 400,
        pattern: "none",
        speed: 0.038,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "5a",
            color: "#3b9a74",
            orbitRadius: 100,
            planetRadius: 3,
            distance: 35,
            pattern: "none",
            speed: 0.9,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "5b",
            color: "#983a3a",
            orbitRadius: 100,
            planetRadius: 7,
            distance: 43,
            pattern: "none",
            speed: 0.6,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "5c",
            color: "#403b7a",
            orbitRadius: 100,
            planetRadius: 5,
            distance: 49,
            pattern: "none",
            speed: 0.5,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "5d",
            color: "#986f23",
            orbitRadius: 100,
            planetRadius: 6,
            distance: 60,
            pattern: "none",
            speed: 0.4,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "6",
        color: "#e0d68a",
        orbitRadius: 950,
        planetRadius: 48,
        distance: 475,
        pattern: "none",
        speed: 0.016,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "6a",
            color: "#2f5f4c",
            orbitRadius: 100,
            planetRadius: 4,
            distance: 35,
            pattern: "none",
            speed: 1,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "6b",
            color: "#58375c",
            orbitRadius: 100,
            planetRadius: 3,
            distance: 43,
            pattern: "none",
            speed: 0.8,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "6c",
            color: "#1a6e47",
            orbitRadius: 100,
            planetRadius: 7,
            distance: 49,
            pattern: "none",
            speed: 0.5,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "6d",
            color: "#264066",
            orbitRadius: 100,
            planetRadius: 10,
            distance: 70,
            pattern: "none",
            speed: 0.3,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "7",
        color: "#79f8ff",
        orbitRadius: 1100,
        planetRadius: 20,
        distance: 550,
        pattern: "none",
        speed: 0.0057,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "7a",
            color: "#036c76",
            orbitRadius: 100,
            planetRadius: 2,
            distance: 15,
            pattern: "none",
            speed: 0.7,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
          {
            id: "7b",
            color: "#b9871b",
            orbitRadius: 100,
            planetRadius: 5,
            distance: 37,
            pattern: "none",
            speed: 0.3,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
      {
        id: "8",
        color: "#0d65c9",
        orbitRadius: 1250,
        planetRadius: 20,
        distance: 625,
        pattern: "none",
        speed: 0.003,
        initialAngle: 0,
        selected: false,
        satellites: [
          {
            id: "8a",
            color: "#419307",
            orbitRadius: 100,
            planetRadius: 4,
            distance: 40,
            pattern: "none",
            speed: 0.6,
            initialAngle: 0,
            selected: false,
            satellites: [],
          },
        ],
      },
    ],
  };

  const initialSun = {
    id: "0",
    orbitRadius: 0,
    planetRadius: 90,
    distance: 0,
    color: "#ffe500",
    pattern: "none",
    speed: 0,
    initialAngle: 0,
    satellites: [],
  };
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : initialAppState;
  });
  const [tempPlanet, setTempPlanet] = useState<Planet | undefined>(undefined);
  const [sun, setSun] = useState<Planet>(() => {
    const savedState = localStorage.getItem("appSun");
    return savedState ? JSON.parse(savedState) : initialSun;
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
  const [thirdDimension, setThirdDimension] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    localStorage.setItem("appSun", JSON.stringify(sun));
  }, [sun]);

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
    const farPlanet = state.planets.reduce((maxDistance, planet) =>
      planet.distance > maxDistance.distance ? planet : maxDistance
    );
    let farDistance = farPlanet.distance;

    const minValue = 150;
    const newScale = minValue / farDistance;
    if (window.innerWidth >= 768) {
      setMapState({
        scale: newScale * 2,
        translation: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2.7,
        },
      });
    } else {
      const maxScale = 0.6;
      setMapState({
        scale: newScale >= maxScale ? maxScale : newScale,
        translation: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2.7,
        },
      });
    }
  };

  const setDemo = () => {
    // const quantumMoon = {
    //   id: "6",
    //   color: "#f4f4f4",
    //   orbitRadius: 100,
    //   planetRadius: 10,
    //   distance: 65,
    //   pattern: "none",
    //   speed: 0.7,
    //   initialAngle: 60,
    //   selected: false,
    //   satellites: [],
    // };

    // var item =
    //   initialAppStateDemo.planets[
    //     Math.floor(Math.random() * initialAppStateDemo.planets.length)
    //   ];

    // item.satellites.push(quantumMoon);

    // const demoCopy = initialAppStateDemo.planets.map((e) => {
    //   if (e.id === item.id) return item;
    //   else return e;
    // });
    // setSun(initialSun);
    // setState({ ...initialAppStateDemo, planets: demoCopy });
    setState({ ...initialAppStateDemo });
  };

  const handleFullScreen = () => {
    console.log("fullScreen");
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
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
        handleFullScreen,
        setThirdDimension,
        thirdDimension,
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
