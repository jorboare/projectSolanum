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
    cleanState,
    selectPlanet,
    handleOrbits,
    setMouseInactive,
    selectedPlanets,
    showPlanetList,
  } = useAppContext();
  const handleClick = (id: string) => {
    selectPlanet(id);
  };
  //@ts-ignore
  let mouseTimer: NodeJS.Timeout | null = null;
  4;
  const [showSatellites, setShowSatellites] = useState(false);
  const [satellites, setSatellites] = useState<any[]>([]);
  const [selPlanetIndex, setSelPlanetIndex] = useState<number>(0);
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
    if (selectedPlanets.length === 1) {
      const planet = state.planets.filter(
        (p) => selectedPlanets[0] === p.id
      )[0];
      const index = state.planets.findIndex((p) => selectedPlanets[0] === p.id);
      setSelPlanetIndex(index);
      setSatellites(planet.satellites.map((e) => e));
      setShowSatellites(selectedPlanets.length === 1);
    } else {
      setShowSatellites(false);
      setSatellites([]);
    }
  }, [selectedPlanets]);

  //@ts-ignore
  const handleFullScreen = () => {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
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
    <>
      <SatContainer
        show={showSatellites && satellites.length > 0}
        numPlanets={selPlanetIndex}
      >
        {satellites &&
          satellites.map((s) => (
            <PlanetGenerator
              key={s.id}
              color={s.color}
              onClick={() => handleClick(s.id)}
              id={s.id}
              size={40}
            />
          ))}
      </SatContainer>
      <Container show={showPlanetList}>
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
        {/* {selectedPlanets.length === 1 && (
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
            {followedPlanet ? "Unfollow" : "Follow"}
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
        <button onClick={resetValue}>Reset scale</button> */}
      </Container>
    </>
  );
};

const Container = styled.div<ContainerProps>`
  width: 100px;
  max-height: ${(props) => (props.show ? "500px" : "100px")};
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
  gap: 20px;
  transition: all 1s ease;
  z-index: 100;
`;
const SatContainer = styled.div<SatContainerProps>`
  width: ${(props) => (props.show ? "100px" : "0px")};
  height: ${(props) => (props.show ? "auto" : "0px")};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  border-radius: 50px;
  position: absolute;
  bottom: ${(props) =>
    `${props.numPlanets ? props.numPlanets * 70 + 130 : 130}px`};
  right: 130px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-evenly;
  padding: ${(props) => (props.show ? "20px 0 20px 0" : "0")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  gap: 20px;
  transition: all 0.5s ease, bottom 0ms ease;
  z-index: 100;
`;
export default PlanetsList;
