import { useState, useEffect, useId } from "react";
import { useAppContext } from "../../context/appContext";

import styled from "styled-components";
//@ts-ignore
import { HuePicker } from "react-color";
import PlanetIcon from "../../assets/Icons/Planets.png";
import ResetIcon from "../../assets/Icons/Reset.png";
import OrbitsIcon from "../../assets/Icons/Orbits.png";
import HighContrast from "../../assets/Icons/HighContrast.png";
import Demo from "../../assets/Icons/Demo.png";
import ResetView from "../../assets/Icons/ResetView.png";
interface MenuDisplayed {
  open: boolean;
  idx?: number;
}

const icons = [
  { name: "Planets", icon: PlanetIcon, action: "showPlanets" },
  { name: "Reset", icon: ResetIcon, action: "resetPlanets" },
  { name: "Orbits", icon: OrbitsIcon, action: "showOrbits" },
  {
    name: "High contrast",
    icon: HighContrast,
    action: "highContrastMode",
  },
  { name: "Demo", icon: Demo, action: "showDemo" },
  { name: "Reset View", icon: ResetView, action: "resetView" },
];

const Menu = () => {
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
    resetMapState,
  } = useAppContext();

  const handleClick = (action: string) => {
    switch (action) {
      case "showPlanets":
        //ADD ACTION SHOW PLANET MENU
        break;
      case "resetPlanets":
        cleanState();
        break;
      case "showOrbits":
        handleOrbits();
        break;
      case "highContrastMode":
        setHightContrast(!hightContrast);
        break;
      case "showDemo":
        setDemo();
        break;
      case "resetView":
        resetMapState();
        break;
      default:
        return;
    }
  };

  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <MenuContainer open={openMenu}>
        <HamburguerIcon onClick={() => setOpenMenu(!openMenu)} open={openMenu}>
          <MenuIcon open={openMenu}></MenuIcon>
        </HamburguerIcon>
      </MenuContainer>
      <MenuDisplayed open={openMenu}>
        {icons.map((e, idx) => (
          <MenuButtons
            open={openMenu}
            idx={idx}
            src={e.icon}
            size={e.size}
            onClick={() => handleClick(e.action)}
          />
        ))}
      </MenuDisplayed>
    </>
  );
};

const MenuContainer = styled.div<MenuDisplayed>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 100px;
  width: ${(props) => (props.open ? "600px" : "100px")};
  border-radius: ${(props) => (props.open ? "50px 50px 50px 50px" : "50px")};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  z-index: 100;
  transition: all 0.5s ease;
`;

const HamburguerIcon = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  width: 100px;
  height: 100px;
  transform: translate(50%, -50%);
  border-radius: 50%;
  z-index: 400;
  background-color: ${(props) =>
    props.open ? "rgba(255, 255, 255, 0.6)" : ""};
  cursor: pointer;
`;

const MenuIcon = styled.div<MenuDisplayed>`
  position: absolute;
  top: 50px;
  right: 50px;
  transform: translate(50%, -50%);
  width: 40px;
  height: 2px;
  background-color: rgba(66, 66, 66, ${(props) => (props.open ? "0" : "1")});
  transition: all 0.5s ease;
  z-index: 450;
  &:after,
  &:before {
    content: "";
    position: absolute;
    width: 40px;
    height: 3px;
    background-color: #424242;
    transition: all 0.5s ease;
  }

  &:after {
    top: ${(props) => (props.open ? "1px" : "-6px")};
    transform: ${(props) => (props.open ? "rotate(45deg)" : "rotate(0deg)")};
    height: 2px;
  }

  &:before {
    bottom: ${(props) => (props.open ? "0px" : "-6px")};
    transform: ${(props) => (props.open ? "rotate(135deg)" : "rotate(0deg)")};
    height: 2px;
  }
`;

const MenuDisplayed = styled.div<MenuDisplayed>`
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  position: absolute;
  bottom: 20px;
  right: 120px;
  height: 100px;
  width: ${(props) => (props.open ? "520px" : "0px")};
  border-radius: ${(props) => (props.open ? "25px 0 0 25px" : "25px 0 0 25px")};
  z-index: 200;
  transition: all 0.5s ease-in-out;
  overflow: hidden;
`;

const MenuButtons = styled.img<MenuDisplayed>`
  position: absolute;
  top: 50%;
  right: 0px;
  width: ${(props) => (props.size ? `${props.size}px` : "60px")};
  filter: invert(1);
  transform: translateY(-50%)
    ${(props) =>
      props.open
        ? `translateX(${-420 + props.idx * (60 + 20)}px)`
        : "translateX(50px)"};
  opacity: ${(props) => (props.open ? "1" : "0")};
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: ${(props) =>
    (props.open ? 300 + props.idx * 100 : props.idx * -100) + "ms"};
  cursor: pointer;

  &:hover {
    filter: invert(0);
    transition: filter 0.3s ease;
  }
`;

export default Menu;
