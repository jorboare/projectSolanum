import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  initialAppStateDemo,
  initialSun,
  initialAppStateDemoSolanum,
} from "../utils/data/demoSystems";

const demos = {
  Outer: {
    name: "Outer",
    system: initialAppStateDemoSolanum,
  },
  Solar: { name: "Solar", system: initialAppStateDemo },
};
interface AppState {
  name: string;
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
  name?: string;
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
  cleanState: () => void;
  selectPlanet: (id: string) => void;
  deselectPlanet: (id: string) => void;
  selectedPlanets: string[];
  planetsNumber: () => number;
  handleOrbits: () => void;
  orbits: boolean;
  setMouseInactive: (mouseStatus: boolean) => void;
  mouseInactive: boolean;
  deletePlanets: () => void;
  sun: Planet | undefined;
  setSun: (sun: Planet) => void;
  sethighContrast: (contrast: boolean) => void;
  highContrast: boolean;
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
  setThirdDimension: (dimension: boolean) => void;
  thirdDimension: boolean;
  handleFullScreen: (action: boolean) => void;
  fullScreen: boolean;
  showSatellites: boolean;
  selPlanetIndex: number;
  selPlanet: Planet | null;
  newSpeed: number;
  setSpeed: (speed: number) => void;
  setCinematic: (status: boolean) => void;
  cinematic: boolean;
  generalScale: number;
  setGeneralScale: (scale: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialAppState = initialAppStateDemo;

  const [state, setState] = useState<AppState>(() => {
    const savedState = initialAppState;
    return savedState;
  }); //takes the state in localStorage if there is one stored or keeps the state empty
  const [sun, setSun] = useState<Planet>(() => {
    const savedState = localStorage.getItem("appSun");
    return savedState ? JSON.parse(savedState) : initialSun;
  }); //the sun is stored apart from the planets even if it's rendered similar, easier to edit and modify it.
  const [orbits, setOrbits] = useState(true); //show or hide orbits
  const [mouseInactive, setMouseInactive] = useState<boolean>(false); //LIKELY DELETEABLE, it was used to hide the UI when inactive 5s
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]); //Array of planet ids
  const [highContrast, sethighContrast] = useState<boolean>(false); //Enables hight contrast mode, white border and no colors
  const [positions, setPositions] = useState({
    scale: 0.5,
    translation: { x: 0, y: 1 },
  });
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null); //ID of the followed planet
  const [generalScale, setGeneralScale] = useState<number>(0.5);
  const [mapState, setMapState] = useState({
    scale: generalScale,
    translation: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
  }); //map state to reset de view
  const [showPlanetList, setShowPlanetList] = useState<boolean>(false);
  const [thirdDimension, setThirdDimension] = useState<boolean>(false); //enables/disables the 3d perspective
  const [showSatellites, setShowSatellites] = useState(false); //Show satellites in the planetList menu
  const [selPlanet, setSelPlanet] = useState<Planet | null>(null); //Object of the selected planet, only one planet selected
  const [selPlanetIndex, setSelPlanetIndex] = useState<number>(0); //Index of the planet in the state used to calculate the height of the satellites menu
  const [newSpeed, setSpeed] = useState<number>(1); //General render speed
  const [cinematic, setCinematic] = useState<boolean>(false); //Enable/disable cinematic mode
  const [demoApplied, selectedDemo] = useState<any>({
    name: "Solar",
    system: initialAppStateDemo,
  });
  const [intervalId, setIntervalId] = useState<any>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  //Handles the cinematic mode
  useEffect(() => {
    if (cinematic) {
      setFollowedPlanet(getRandomId());
      const interval = setInterval(() => {
        const randomBoolean = randomBooleanGenerator();
        let randomId = getRandomId();
        const randomPlanet = state.planets.filter((p) => p.id === randomId);

        if (randomBoolean && randomPlanet[0].speed < 0.3) {
          setGeneralScale(randomBooleanGenerator() ? 2 : 1);
          setThirdDimension(randomBoolean);
          setFollowedPlanet(randomId);
        } else {
          setThirdDimension(false);
          setFollowedPlanet(randomId);
        }
      }, 7000);
      setIntervalId(interval);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setFollowedPlanet("");
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [cinematic]);

  /**
   * Generates a random boolean
   * @returns {Boolean}
   */
  const randomBooleanGenerator = () => {
    return Math.random() > 0.5;
  };

  /**
   *
   * @returns {String} Random id of a planet
   */
  const getRandomId = () => {
    const ids = state.planets.map((p) => p.id);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return randomId;
  };

  const cleanState = () => {
    setState(initialAppState);
    setSun(initialSun);
  };

  const selectPlanet = (id: string) => {
    if (!selectedPlanets.some((e) => e === id)) {
      setSelectedPlanets([id]);
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

  const handleOrbits = () => {
    setOrbits(!orbits);
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
          y: window.innerHeight / 4,
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

  useEffect(() => {
    if (selectedPlanets.length === 1) {
      const planet = state.planets.filter(
        (p) => selectedPlanets[0] === p.id
      )[0];
      const index = state.planets.findIndex((p) => selectedPlanets[0] === p.id);
      setSelPlanet(planet);
      setSelPlanetIndex(index);
      setShowSatellites(selectedPlanets.length === 1);
    } else {
      setSelPlanet(null);
      setShowSatellites(false);
    }
  }, [selectedPlanets]);

  const setDemo = () => {
    if (demoApplied.name === "Solar" && state.name === "Solar") {
      setState({
        name: demos.Outer.name,
        planets: demos.Outer.system.planets,
      });
      selectedDemo(demos.Outer);
    } else {
      setState({
        name: demos.Solar.name,
        planets: demos.Solar.system.planets,
      });
      selectedDemo(demos.Solar);
    }
  };

  const handleFullScreen = (fullScreenAction: boolean) => {
    if (fullScreenAction) {
      if (document.documentElement.requestFullscreen) {
        setFullScreen(true);
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          setFullScreen(false);
          document.exitFullscreen();
        }
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        cleanState,
        selectPlanet,
        deselectPlanet,
        planetsNumber,

        handleOrbits,
        orbits,
        mouseInactive,
        setMouseInactive,
        selectedPlanets,
        deletePlanets,
        sun,
        setSun,
        highContrast,
        sethighContrast,
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
        handleFullScreen,
        fullScreen,
        setThirdDimension,
        thirdDimension,
        showSatellites,
        selPlanetIndex,
        selPlanet,
        newSpeed,
        setSpeed,
        setCinematic,
        cinematic,
        generalScale,
        setGeneralScale,
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
