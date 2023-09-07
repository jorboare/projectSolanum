//@ts-ignore
import React, { useState, useEffect } from "react";
import styled from "styled-components";
//@ts-ignore
import { CirclePicker } from "react-color";
import { useAppContext } from "../../context/appContext";
import "./PlanetsList.css";
import PlanetGenerator from "../PlanetGenerator/PlanetGenerator";

interface Satellite {
  radius: number;
  distance: number;
  color: string;
  pattern: string;
}

interface ContainerProps {
  show: boolean;
}

const Container = styled.div<ContainerProps>`
  height: 150px;
  width: 95%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: all 1s ease;
`;

const PlanetsList: React.FC = () => {
  const {
    state,
    cleanState,
    selectPlanet,
    handleOrbits,
    setMouseInactive,
    mouseInactive,
  } = useAppContext();
  const [fullScreen, setFullScreen] = useState(false);
  const handleClick = (id: string) => {
    selectPlanet(id);
  };
  //@ts-ignore
  let mouseTimer: NodeJS.Timeout | null = null;

  const handleMouseMove = () => {
    console.log("Fullscreen----->", fullScreen);

    setMouseInactive(false);
    if (mouseTimer) {
      clearTimeout(mouseTimer);
    }

    // Establecer un temporizador para marcar como inactivo después de 3 segundos
    mouseTimer = setTimeout(() => {
      setMouseInactive(true);
      // Aquí puedes ejecutar el código que deseas cuando el ratón está inactivo
      console.log("El ratón está inactivo durante 3 segundos");
    }, 5000); // 3000 milisegundos (3 segundos)
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      // Limpieza cuando el componente se desmonta
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseTimer) {
        clearTimeout(mouseTimer);
      }
    };
  }, []);

  const handleReset = () => {
    cleanState();
  };
  const showOrbits = () => {
    handleOrbits();
  };

  const handleFullScreen = () => {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      setFullScreen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      setFullScreen(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    }
  };

  return (
    <Container show={!mouseInactive}>
      {state.planets
        ? state.planets.map((p) => (
            <PlanetGenerator
              key={p.id}
              color={p.color}
              onClick={() => handleClick(p.id)}
              selected={p.selected}
              id={p.id}
            />
          ))
        : null}
      <button onClick={handleReset}>Reset</button>
      <button onClick={showOrbits}>Orbits</button>
      <button id="fullscreen-button" onClick={handleFullScreen}>
        {fullScreen ? "Close" : "Full screen"}
      </button>
    </Container>
  );
};

export default PlanetsList;
