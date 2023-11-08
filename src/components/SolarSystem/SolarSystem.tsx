import "./SolarSystem.css";
import { useAppContext } from "../../context/appContext";
import Planet from "../Planet/Planet";
import styled from "styled-components";
//@ts-ignore
import { MapInteractionCSS } from "react-map-interaction";
import { useState } from "react";
import { useEffect } from "react";

const SolarContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SolarSystem = () => {
  const { state, tempPlanet, sun, position, followedPlanet } = useAppContext();
  const [mapState, setMapState] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });

  useEffect(() => {
    console.log(mapState);
  }, [mapState]);

  useEffect(() => {
    console.log("position", position);
    if (followedPlanet) {
      setMapState({
        scale: 2,
        translation: position,
      });
    }
  }, [position]);

  const resetValue = () => {
    setMapState({
      scale: 1,
      translation: { x: 0, y: 0 },
    });
  };

  return (
    <>
      {/* <button onClick={resetValue}>Reset scale</button> */}
      <MapInteractionCSS
        showControls
        defaultValue={mapState}
        value={mapState}
        onChange={(value: any) => setMapState(value)}
      >
        <SolarContainer>
          {tempPlanet && <Planet data={tempPlanet} />}
          {sun && <Planet data={sun} />}
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
