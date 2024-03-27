import { useState, useEffect } from "react";
import { useAppContext } from "../../context/appContext";

import styled from "styled-components";
//@ts-ignore
import { HuePicker } from "react-color";
import PlanetIcon from "../../assets/Icons/Planets.png";
import OrbitsIcon from "../../assets/Icons/Orbits.png";
import HighContrast from "../../assets/Icons/HighContrast.png";
import Demo from "../../assets/Icons/Demo.png";
import ResetView from "../../assets/Icons/ResetView.png";
import FollowPlanet from "../../assets/Icons/Follow.png";
import ThirdDimension from "../../assets/Icons/ThirdDimension.png";
import SecondDimension from "../../assets/Icons/SecondDimension.png";
import FullScreenIcon from "../../assets/Icons/FullScreen.png";
import NoFullScreenIcon from "../../assets/Icons/NoFullScreen.png";
import Play from "../../assets/Icons/play-button.png";
import Stop from "../../assets/Icons/stop-button.png";
interface MenuDisplayed {
  open: boolean;
  idx?: number;
  planetList?: boolean;
  size?: string;
}
interface ButtonContainer {
  name: string;
}

const Menu = () => {
  const {
    cleanState,
    handleOrbits,
    selectedPlanets,
    highContrast,
    sethighContrast,
    setDemo,
    setFollowedPlanet,
    followedPlanet,
    resetMapState,
    showPlanetList,
    setShowPlanetList,
    handleFullScreen,
    fullScreen,
    setThirdDimension,
    deselectPlanet,
    thirdDimension,
    newSpeed,
    setSpeed,
    cinematic,
    setCinematic,
  } = useAppContext();

  let buttons = {
    generalMenu: [
      { name: "Planets", icon: PlanetIcon, action: "showPlanets" },
      { name: "Orbits", icon: OrbitsIcon, action: "showOrbits" },
      {
        name: "High contrast",
        icon: HighContrast,
        action: "highContrastMode",
      },

      { name: "Reset View", icon: ResetView, action: "resetView" },
      { name: "Full screen", icon: FullScreenIcon, action: "setFullScreen" },
      {
        name: "3D/2D",
        icon: ThirdDimension,
        action: "thirdDimension",
      },
      {
        name: "Cinematic Mode",
        icon: cinematic ? Stop : Play,
        action: "cinematic",
      },
    ],
    planetsMenuGeneral: [{ name: "Demo", icon: Demo, action: "showDemo" }],
    planetsMenuSelection: [
      { name: "Follow", icon: FollowPlanet, action: "followPlanet" },
    ],
  };

  const [allButtons] = useState(buttons);

  const [openHorizontalMenu, setOpenHorizontalMenu] = useState(false);
  const [menuButtons, setMenuButtons] = useState(allButtons.generalMenu);
  const [openedMenu, setOpenedMenu] = useState("");

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
        sethighContrast(!highContrast);
        break;
      case "showDemo":
        setDemo();
        break;
      case "resetView":
        resetMapState();
        break;
      case "thirdDimension":
        setThirdDimension(!thirdDimension);
        break;
      case "setFullScreen":
        handleFullScreen(!fullScreen);
        break;
      case "followPlanet":
        followPlanet();
        break;
      case "cinematic":
        setCinematic(!cinematic);
        if (!cinematic) setOpenHorizontalMenu(!openHorizontalMenu);
        if (!cinematic) handleFullScreen(true);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    switch (openedMenu) {
      case "Inputs":
        // setOpenHorizontalMenu(false);
        // setShowPlanetList(false);
        break;
      case "General":
        setShowPlanetList(false);
        deselectPlanet("");
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
    } else {
      setMenuButtons(allButtons.generalMenu);
      setOpenHorizontalMenu(!openHorizontalMenu);
      setOpenedMenu("General");
    }
  };

  useEffect(() => {
    if (showPlanetList && openHorizontalMenu) {
      horizontalMenuHandler(allButtons.planetsMenuGeneral, true);
    } else {
      horizontalMenuHandler(allButtons.generalMenu, false);
    }
  }, [showPlanetList]);

  useEffect(() => {
    if (selectedPlanets.length === 1) {
      horizontalMenuHandler(allButtons.planetsMenuSelection, true);
    } else if (selectedPlanets.length > 1) {
      // if (menuButtons != buttons.planetsMenuMultiSelection)
      //   horizontalMenuHandler(buttons.planetsMenuMultiSelection, true);
    } else if (showPlanetList) {
      horizontalMenuHandler(allButtons.planetsMenuGeneral, true);
    }
  }, [selectedPlanets]);

  const horizontalMenuHandler = (newButtons: any, reopen: boolean) => {
    setOpenHorizontalMenu(false);
    setTimeout(() => {
      setMenuButtons(newButtons);
      setOpenHorizontalMenu(reopen);
    }, 500);
  };

  const calcSpeed = (variable: string) => {
    let speed = newSpeed;
    switch (variable) {
      case "less":
        if (speed === 0) speed = 1;
        if (speed > 0.125) speed = speed / 2;
        break;
      case "stop":
        speed = 0;
        break;
      case "normal":
        speed = 1;
        break;
      case "add":
        if (speed === 0) speed = 1;
        if (speed < 1) speed = speed * 2;
        if (speed >= 1 && speed < 6) speed = speed += 1;
        break;
      default:
        speed = 1;
        return;
    }
    setSpeed(speed);
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
        {menuButtons.map((e, idx) => {
          return e.name === "Cinematic Mode" ? (
            <ButtonContainer key={idx + idx} name={e.name}>
              <MenuButtons
                open={openHorizontalMenu}
                idx={idx}
                src={cinematic ? Stop : Play}
                key={idx}
                onClick={() => handleClick(e.action)}
              />
            </ButtonContainer>
          ) : e.name === "Full screen" ? (
            <ButtonContainer key={idx + idx} name={e.name}>
              <MenuButtons
                open={openHorizontalMenu}
                idx={idx}
                src={fullScreen ? NoFullScreenIcon : FullScreenIcon}
                key={idx}
                onClick={() => handleClick(e.action)}
              />
            </ButtonContainer>
          ) : e.name === "3D/2D" ? (
            <ButtonContainer key={idx + idx} name={e.name}>
              <MenuButtons
                open={openHorizontalMenu}
                idx={idx}
                src={thirdDimension ? SecondDimension : ThirdDimension}
                key={idx}
                onClick={() => handleClick(e.action)}
              />
            </ButtonContainer>
          ) : (
            <ButtonContainer key={idx + idx} name={e.name}>
              <MenuButtons
                open={openHorizontalMenu}
                idx={idx}
                src={e.icon}
                key={idx}
                onClick={() => handleClick(e.action)}
              />
            </ButtonContainer>
          );
        })}
      </MenuDisplayed>
      <p style={{ color: "white" }}>x{newSpeed}</p>
      <button onClick={() => calcSpeed("less")}>-</button>
      <button onClick={() => calcSpeed("stop")}>stop</button>
      <button onClick={() => calcSpeed("normal")}>normal</button>
      <button onClick={() => calcSpeed("add")}>+</button>
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
    gap: 5px;
    padding: ${(props) => (props.open ? "0px 60px 0px 20px" : "0")};
  }
`;

const ButtonContainer = styled.div<ButtonContainer>`
  position: relative;
  @media (min-width: 768px) {
    &:after {
      content: ${(props) => `"${props.name}"`};
      color: white;
      padding: 2px 5px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      bottom: -25px;
      transform: translate(-50%, -50%);
      z-index: 1000;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.5s ease;
      transition-delay: 0.5s;
      font-size: 12px;
    }
    &:hover {
      &:after {
        opacity: 1;
      }
    }
  }
`;

const MenuButtons = styled.img<MenuDisplayed>`
  width: 60px;
  filter: invert(1);
  opacity: ${(props) => (props.open ? "1" : "0")};
  transition: all 0.5 ease;
  cursor: pointer;
  z-index: 1000;

  @media (min-width: 768px) {
    &:hover {
      filter: invert(0);
      transition: filter 0.1s ease;
    }
  }

  @media (max-width: 768px) {
    &:active {
      filter: invert(0);
      transition: filter 0.3s ease;
    }
    width: 40px;
    gap: 10px;
  }
`;

export default Menu;
