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
interface SatContainerProps {
  show: boolean;
  visible: boolean;
}

const Container = styled.div<ContainerProps>`
  height: 150px;
  width: 90%;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
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
  margin: 0 5% 20px 5%;
`;
const SatContainer = styled.div<SatContainerProps>`
  height: ${(props) => (props.visible ? "100px" : "0px")};
  overflow: hidden;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  border-radius: 20px;
  position: absolute;
  bottom: 160px;
  left: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: all 0.3s ease;
  margin: 0 5% 20px 5%;
  padding: ${(props) => (props.visible ? "10px 0px 10px 10px" : "0px")};
  & > * {
    margin-right: 10px;
    height: ${(props) => (props.visible ? "30px" : "0px")};
    width: ${(props) => (props.visible ? "30px" : "0px")};
  }
`;

const PlanetsList: React.FC = () => {
  const {
    state,
    cleanState,
    selectPlanet,
    handleOrbits,
    setMouseInactive,
    mouseInactive,
    deletePlanets,
    deselectPlanet,
    selectedPlanets,
    addSatellites,
    setAddSatellites,
    hightContrast,
    setHightContrast,
    setDemo,
    setFollowedPlanet,
    followedPlanet,
    setMapState,
  } = useAppContext();
  const [fullScreen, setFullScreen] = useState(false);
  const handleClick = (id: string) => {
    selectPlanet(id);
  };
  //@ts-ignore
  let mouseTimer: NodeJS.Timeout | null = null;
  4;
  const [showSatellites, setShowSatellites] = useState(false);
  const handleMouseMove = () => {
    setMouseInactive(false);
    if (mouseTimer) {
      clearTimeout(mouseTimer);
    }

    mouseTimer = setTimeout(() => {
      setMouseInactive(true);
    }, 5000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setShowSatellites(selectedPlanets.length === 1);
  }, [selectedPlanets]);

  const handleReset = () => {
    cleanState();
  };
  const showOrbits = () => {
    handleOrbits();
  };
  //@ts-ignore
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

  const unSelectPlanets = () => {
    setShowSatellites(false);
    setTimeout(() => {
      deselectPlanet();
    }, 300);
  };

  const resetValue = () => {
    setMapState({
      scale: 1,
      translation: { x: 0, y: 0 },
    });
  };

  return (
    <>
      <SatContainer show={!mouseInactive} visible={showSatellites}>
        {state.planets.map((p) => {
          if (selectedPlanets[0] === p.id) {
            if (p.satellites.length)
              return p.satellites.map((s) => (
                <PlanetGenerator
                  key={s.id}
                  color={s.color}
                  onClick={() => handleClick(s.id)}
                  id={s.id}
                />
              ));
          }
        })}
        <button onClick={() => setShowSatellites(false)}>Hide</button>
      </SatContainer>
      <Container show={!mouseInactive}>
        {state.planets
          ? state.planets.map((p) => (
              <PlanetGenerator
                key={p.id}
                color={p.color}
                onClick={() => handleClick(p.id)}
                id={p.id}
              />
            ))
          : null}
        {selectedPlanets.length === 1 && (
          <button onClick={() => setAddSatellites(!addSatellites)}>
            Add satellites
          </button>
        )}
        {selectedPlanets.length === 1 && (
          <button
            onClick={() => {
              if (followedPlanet) {
                setFollowedPlanet(null);
              } else setFollowedPlanet(selectedPlanets[0]);
            }}
          >
            Follow
          </button>
        )}
        <button onClick={unSelectPlanets}>Unselect</button>
        <button
          onClick={() => {
            setShowSatellites(false);
            deletePlanets();
          }}
        >
          Delete Selected Planets
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={showOrbits}>Orbits</button>
        <button onClick={() => setHightContrast(!hightContrast)}>
          Hight Contrast
        </button>
        <button onClick={setDemo}>Demo</button>

        <button id="fullscreen-button" onClick={handleFullScreen}>
          {fullScreen ? "Close" : "Full screen"}
        </button>
        <button onClick={resetValue}>Reset scale</button>
      </Container>
    </>
  );
};

export default PlanetsList;
