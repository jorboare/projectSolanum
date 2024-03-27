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
const Title = styled.div`
  position: absolute;
  left: 0;
  top: 0;

  z-index: 100;
  color: white;
  font-family: "Encode Sans Expanded", sans-serif;
  margin-left: 20px;
  width: 170px;

  h1 {
    font-weight: 100;
    font-style: normal;
    font-size: 50px;
    padding: 0;
    margin: 10px 0 10px 0;
    line-height: 35px;

    span {
      font-size: 30px;
    }
  }

  h4 {
    color: #afafaf;
    margin: 0;
    font-family: "Encode Sans Expanded", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    span {
      font-weight: 100;
    }
  }
`;

const SolarSystem = () => {
  const {
    state,
    sun,
    positions,
    followedPlanet,
    mapState,
    setMapState,
    thirdDimension,
  } = useAppContext();

  useEffect(() => {
    if (followedPlanet) {
      setMapState(positions);
    }
  }, [positions]);

  return (
    <>
      <Title>
        <h1>
          <span>Project</span> Solanum
        </h1>
        <h4>
          {""}
          <span>By </span>Jordi Boronat
        </h4>
      </Title>
      <MapInteractionCSS
        defaultValue={mapState}
        value={mapState}
        onChange={(value: any) => setMapState(value)}
      >
        <SolarContainer
          id="solarSystem"
          style={{ transform: thirdDimension ? "rotateX(60deg)" : "none" }}
        >
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
