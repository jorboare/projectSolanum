import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { initialAppStateDemo, initialSun } from "../utils/data/demoSystems";

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
  showPlanetInput: boolean;
  setShowPlanetInput: (show: boolean) => void;
  setThirdDimension: (dimension: boolean) => void;
  thirdDimension: boolean;
  handleFullScreen: () => void;
  showSatellites: boolean;
  selPlanetIndex: number;
  selPlanet: Planet | null;
  newSpeed: number;
  setSpeed: (speed: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const initialAppState = {
    planets: [],
  };

  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : initialAppState;
  }); //takes the state in localStorage if there is one stored or keeps the state empty
  const [tempPlanet, setTempPlanet] = useState<Planet | undefined>(undefined); //used to show the planet being edited
  const [sun, setSun] = useState<Planet>(() => {
    const savedState = localStorage.getItem("appSun");
    return savedState ? JSON.parse(savedState) : initialSun;
  }); //the sun is stored apart from the planets even if it's rendered similar, easier to edit and modify it.
  const [preview, setPreview] = useState(false);
  const [orbits, setOrbits] = useState(true); //show or hide orbits
  const [mouseInactive, setMouseInactive] = useState<boolean>(false); //LIKELY DELETEABLE, it was used to hide the UI when inactive 5s
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]); //Array of planet ids
  const [addSatellites, setAddSatellites] = useState<boolean>(false); //state of editing and modifying sattelites
  const [highContrast, sethighContrast] = useState<boolean>(false); //Enables hight contrast mode, white border and no colors
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [followedPlanet, setFollowedPlanet] = useState<string | null>(null); //ID of the followed planet
  const [mapState, setMapState] = useState({
    scale: 0.5,
    translation: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
  }); //map state to reset de view
  const [showPlanetList, setShowPlanetList] = useState<boolean>(false);
  const [showPlanetInput, setShowPlanetInput] = useState<boolean>(false);
  const [thirdDimension, setThirdDimension] = useState<boolean>(false); //enables/disables the 3d perspective
  const [showSatellites, setShowSatellites] = useState(false); //Show satellites in the planetList menu
  const [selPlanet, setSelPlanet] = useState<Planet | null>(null);
  const [selPlanetIndex, setSelPlanetIndex] = useState<number>(0);
  const [newSpeed, setSpeed] = useState<number>(1);

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
        showPlanetInput,
        setShowPlanetInput,
        handleFullScreen,
        setThirdDimension,
        thirdDimension,
        showSatellites,
        selPlanetIndex,
        selPlanet,
        newSpeed,
        setSpeed,
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
