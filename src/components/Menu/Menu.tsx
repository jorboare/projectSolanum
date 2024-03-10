import { useState, useEffect } from "react";
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
import NewPlanet from "../../assets/Icons/NewPlanet.png";
import NewSatellite from "../../assets/Icons/AddSatellite.png";
import FollowPlanet from "../../assets/Icons/Follow.png";
interface MenuDisplayed {
  open: boolean;
  idx?: number;
  planetList?: boolean;
  size?: string;
}

const buttons = {
  generalMenu: [
    { name: "Planets", icon: PlanetIcon, action: "showPlanets" },
    { name: "Orbits", icon: OrbitsIcon, action: "showOrbits" },
    {
      name: "High contrast",
      icon: HighContrast,
      action: "highContrastMode",
    },
    { name: "Demo", icon: Demo, action: "showDemo" },
    { name: "Reset View", icon: ResetView, action: "resetView" },
  ],
  planetsMenuGeneral: [
    { name: "Add new planet", icon: NewPlanet, action: "newPlanet" },
    { name: "Reset", icon: ResetIcon, action: "resetPlanets" },
  ],
  planetsMenuSelection: [
    { name: "Edit", icon: PlanetIcon, action: "showPlanets" },
    { name: "Delete", icon: ResetIcon, action: "resetPlanets" },
    { name: "Follow", icon: FollowPlanet, action: "followPlanet" },
    { name: "Add satellite", icon: NewSatellite, action: "resetPlanets" },
  ],
  planetsMenuMultiSelection: [
    { name: "Edit", icon: PlanetIcon, action: "showPlanets" },
    { name: "Delete", icon: ResetIcon, action: "resetPlanets" },
  ],
};

const Menu = () => {
  const {
    cleanState,
    handleOrbits,
    deselectPlanet,
    selectedPlanets,
    hightContrast,
    setHightContrast,
    setDemo,
    setFollowedPlanet,
    followedPlanet,
    resetMapState,
    showPlanetList,
    setShowPlanetList,
    showPlanetInput,
    setShowPlanetInput,
  } = useAppContext();

  const followPlanet = () => {
    if (followedPlanet) {
      setFollowedPlanet(null);
    } else setFollowedPlanet(selectedPlanets[0]);
  };
  const handleClick = (action: string) => {
    switch (action) {
      case "showPlanets":
        setShowPlanetList(!showPlanetList);
        if (showPlanetList) setOpenedMenu("Planets");
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
      case "followPlanet":
        followPlanet();
        break;
      case "newPlanet":
        setShowPlanetInput(!showPlanetInput);
        if (!showPlanetInput) setOpenedMenu("Inputs");
        break;
      default:
        return;
    }
  };

  const [openHorizontalMenu, setOpenHorizontalMenu] = useState(false);
  const [menuButtons, setMenuButtons] = useState(buttons.generalMenu);
  const [openedMenu, setOpenedMenu] = useState("");

  useEffect(() => {
    switch (openedMenu) {
      case "Inputs":
        setOpenHorizontalMenu(false);
        setShowPlanetList(false);
        break;
      case "Planets":
        setShowPlanetInput(false);
        break;
      case "General":
        setShowPlanetList(false);
        setShowPlanetInput(false);
        break;
      default:
        return;
    }
  }, [openedMenu]);

  const handleMenuClick = () => {
    if (showPlanetList) {
      setOpenHorizontalMenu(false);
      setShowPlanetList(!showPlanetList);
      if (showPlanetList) deselectPlanet("");
    } else if (showPlanetInput) {
      setShowPlanetInput(!showPlanetInput);
      setOpenHorizontalMenu(false);
    } else {
      setMenuButtons(buttons.generalMenu);
      setOpenHorizontalMenu(!openHorizontalMenu);
      setOpenedMenu("General");
    }
  };

  useEffect(() => {
    if (showPlanetList && openHorizontalMenu) {
      horizontalMenuHandler(buttons.planetsMenuGeneral, true);
    } else {
      horizontalMenuHandler(buttons.generalMenu, false);
    }
  }, [showPlanetList]);

  useEffect(() => {
    if (selectedPlanets.length === 1) {
      horizontalMenuHandler(buttons.planetsMenuSelection, true);
    } else if (selectedPlanets.length > 1) {
      if (menuButtons != buttons.planetsMenuMultiSelection)
        horizontalMenuHandler(buttons.planetsMenuMultiSelection, true);
    } else if (showPlanetList) {
      horizontalMenuHandler(buttons.planetsMenuGeneral, true);
    }
  }, [selectedPlanets]);

  const horizontalMenuHandler = (newButtons: any, reopen: boolean) => {
    setOpenHorizontalMenu(false);
    setTimeout(() => {
      setMenuButtons(newButtons);
      setOpenHorizontalMenu(reopen);
    }, 500);
  };
  return (
    <>
      <MenuContainer open={openHorizontalMenu}>
        <IconContainer
          onClick={() => handleMenuClick()}
          open={openHorizontalMenu}
        >
          <HamburguerIcon
            open={openHorizontalMenu}
            planetList={showPlanetList}
          ></HamburguerIcon>
        </IconContainer>
      </MenuContainer>
      <MenuDisplayed open={openHorizontalMenu}>
        {menuButtons.map((e, idx) => (
          <MenuButtons
            open={openHorizontalMenu}
            idx={idx}
            src={e.icon}
            key={idx}
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
  width: 100px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  z-index: 100;
  transition: all 0.5s ease;
  display: flex;
  align-items: right;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const IconContainer = styled.div<MenuDisplayed>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  z-index: 400;
  background-color: ${(props) =>
    props.open ? "rgba(255, 255, 255, 0.6)" : ""};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;

const HamburguerIcon = styled.div<MenuDisplayed>`
  width: 40px;
  height: 2px;
  background-color: rgba(
    66,
    66,
    66,
    ${(props) => (props.open ? "0" : props.planetList ? "0" : "1")}
  );
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
    width: ${(props) => (props.planetList ? "20px" : "40px")};
  }

  &:after {
    bottom: ${(props) =>
      props.open ? "50%" : props.planetList ? "50%" : "55%"};
    transform: ${(props) =>
      props.planetList
        ? "rotate(135deg)"
        : props.open
        ? "rotate(45deg)"
        : "rotate(0deg)"};

    height: 2px;
    margin-left: ${(props) => (props.planetList ? "17px" : "")};
  }

  &:before {
    bottom: ${(props) =>
      props.open ? "50%" : props.planetList ? "50%" : "42%"};
    transform: ${(props) =>
      props.planetList
        ? "rotate(45deg)"
        : props.open
        ? "rotate(135deg)"
        : "rotate(0deg)"};
    height: 2px;
    margin-left: ${(props) => (props.planetList ? "3px" : "")};
  }

  @media (max-width: 768px) {
    width: 20px;
    &:after,
    &:before {
      width: ${(props) => (props.planetList ? "10px" : "20px")};
      margin: 0;
    }
    &:after {
      transform: ${(props) =>
        props.planetList
          ? "rotate(135deg)  translate(-6px, -4px)"
          : props.open
          ? "rotate(135deg)"
          : "rotate(0deg)"};
    }

    &:before {
      transform: ${(props) =>
        props.planetList
          ? "rotate(45deg) translateY(-2px)"
          : props.open
          ? "rotate(45deg)"
          : "rotate(0deg)"};
    }
  }
`;

const MenuDisplayed = styled.div<MenuDisplayed>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 100px;
  width: ${(props) => (props.open ? "auto" : "50px")};
  border-radius: ${(props) => (props.open ? "25px 0 0 25px" : "25px 0 0 25px")};
  z-index: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
  border-radius: ${(props) => (props.open ? "50px 50px 50px 50px" : "50px")};
  padding: ${(props) => (props.open ? "0px 120px 0px 20px" : "0")};
  opacity: ${(props) => (props.open ? "1" : "0")};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    height: 50px;
    gap: 10px;
    padding: ${(props) => (props.open ? "0px 60px 0px 20px" : "0")};
  }
`;

const MenuButtons = styled.img<MenuDisplayed>`
  width: 60px;
  filter: invert(1);
  opacity: ${(props) => (props.open ? "1" : "0")};
  transition: all 0.5 ease;
  cursor: pointer;

  &:hover {
    filter: invert(0);
    transition: filter 0.3s ease;
  }

  @media (max-width: 768px) {
    width: 30px;
    gap: 10px;
  }
`;

export default Menu;
