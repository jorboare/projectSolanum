import "./SolarSystem.css";
import { useAppContext } from "../../context/appContext";
import Planet from "../Planet/Planet";
import styled from "styled-components";
//@ts-ignore
import { MapInteractionCSS } from "react-map-interaction";
import { useEffect } from "react";

const SolarContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotateX(50deg);
`;

const SolarSystem = () => {
  const {
    state,
    tempPlanet,
    sun,
    positions,
    followedPlanet,
    mapState,
    setMapState,
    thirdDimension,
    setThirdDimension,
  } = useAppContext();

  useEffect(() => {
    if (followedPlanet) {
      setMapState({
        scale: 1,
        translation: positions,
      });
    }
  }, [positions]);
  return (
    <>
      <button onClick={() => setThirdDimension(!thirdDimension)}>3d</button>
      <MapInteractionCSS
        showControls
        defaultValue={mapState}
        value={mapState}
        onChange={(value: any) => setMapState(value)}
      >
        <SolarContainer
          id="solarSystem"
          style={{ transform: thirdDimension ? "rotateX(60deg)" : "none" }}
        >
          {tempPlanet && <Planet data={tempPlanet} order={-100} />}
          {sun && <Planet data={sun} sun={true} />}
          {state.planets &&
            state.planets.map((e, idx) => (
              <Planet key={idx} data={e} order={idx} />
            ))}
        </SolarContainer>
      </MapInteractionCSS>
    </>
  );
};

export default SolarSystem;
