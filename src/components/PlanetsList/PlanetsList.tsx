//@ts-ignore
import React, { useState, useEffect } from "react";
import styled from "styled-components";
//@ts-ignore
import { CirclePicker } from "react-color";
import { useAppContext } from "../../context/appContext";
import "./PlanetsList.css";
import PlanetGenerator from "../PlanetGenerator/PlanetGenerator";

interface ContainerProps {
  show: boolean;
}
interface SatContainerProps {
  show: boolean;
  numPlanets: number;
}

const PlanetsList: React.FC = () => {
  const {
    state,
    selectPlanet,
    setMouseInactive,
    showPlanetList,
    showSatellites,
    selPlanetIndex,
    selPlanet,
  } = useAppContext();
  const handleClick = (id: string) => {
    selectPlanet(id);
  };
  //@ts-ignore
  let mouseTimer: NodeJS.Timeout | null = null;
  4;
  const handleMouseMove = () => {
    setMouseInactive(false);
    if (mouseTimer) {
      clearTimeout(mouseTimer);
    }

    mouseTimer = setTimeout(() => {
      setMouseInactive(true);
    }, 8000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <SatContainer
        show={
          showSatellites &&
          selPlanet !== null &&
          selPlanet.satellites.length > 0
        }
        numPlanets={selPlanetIndex}
      >
        {selPlanet &&
          selPlanet.satellites.length &&
          selPlanet.satellites.map((s) => (
            <PlanetGenerator key={s.id} color={s.color} id={s.id} size={40} />
          ))}
      </SatContainer>
      <Container show={showPlanetList}>
        {state.planets
          ? state.planets.map((p) => (
              <PlanetGenerator
                key={p.id}
                color={p.color}
                id={p.id}
                onClick={() => handleClick(p.id)}
              />
            ))
          : null}
      </Container>
    </>
  );
};

const Container = styled.div<ContainerProps>`
  width: 100px;
  max-height: ${(props) => (props.show ? "650px" : "100px")};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  border-radius: 50px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-evenly;
  padding: ${(props) => (props.show ? "20px 0 120px 0" : "0")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  gap: 10px;
  transition: all 1s ease;
  z-index: 100;

  & > * {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    width: 50px;
    padding: ${(props) => (props.show ? "20px 0 60px 0" : "0")};
    & > * {
      width: 30px;
      height: 30px;
    }
  }
`;
const SatContainer = styled.div<SatContainerProps>`
  width: ${(props) => (props.show ? "70px" : "0px")};
  height: ${(props) => (props.show ? "auto" : "0px")};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  border-radius: 50px;
  position: absolute;
  bottom: ${(props) =>
    `${props.numPlanets ? props.numPlanets * 50 + 140 : 130}px`};
  right: 130px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-evenly;
  padding: ${(props) => (props.show ? "10px 0 10px 0" : "0")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  gap: 10px;
  transition: all 0.5s ease, bottom 0ms ease;
  z-index: 100;
  @media (max-width: 768px) {
    width: 50px;
    padding: ${(props) => (props.show ? "10px 0 10px 0" : "0")};
    right: 75px;
    bottom: ${(props) =>
      `${props.numPlanets ? props.numPlanets * 40 + 80 : 75}px`};
    gap: 10px;
    & > * {
      width: 20px;
      height: 20px;
    }
  }
`;
export default PlanetsList;
