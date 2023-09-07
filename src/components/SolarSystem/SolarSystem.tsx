import "./SolarSystem.css";
import { useAppContext } from "../../context/appContext";
import Planet from "../Planet/Planet";
const SolarSystem = () => {
  const { state, tempPlanet } = useAppContext();

  return (
    <>
      {tempPlanet && <Planet data={tempPlanet} />}
      {state.planets &&
        state.planets.map((e, idx) => (
          <Planet key={idx} data={e} order={idx} />
        ))}
    </>
  );
};

export default SolarSystem;
