import { useState, useEffect } from "react";
import styled from "styled-components";
//@ts-ignore
import { HuePicker } from "react-color";
import { useAppContext } from "../../context/appContext";
import "./PlanetInputs.css";
import { v4 as uuidv4 } from "uuid";
import Arrow from "../../utils/Arrow";
import arrowIcon from "../../assets/right-arrow.png";
interface Planet {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
  selected: boolean;
  satellites: Satellite[];
}

interface Satellite {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
  selected: boolean;
}

interface ContainerProps {
  show: boolean;
}

const PlanetInputs: React.FC = () => {
  const {
    state,
    updateState,
    updateTempPlanet,
    cleanTempPlanet,
    preview,
    setPreview,
    mouseInactive,
    addSatellites,
    setAddSatellites,
    saveSatellite,
    setSun,
    showPlanetInput,
    setShowPlanetInput,
  } = useAppContext();
  const initialPlanet = {
    id: uuidv4(),
    color: "#ff0000",
    orbitRadius: addSatellites ? 100 : 200,
    planetRadius: addSatellites ? 3 : 100,
    distance: addSatellites ? 50 : 100,
    pattern: "none",
    speed: addSatellites ? 0.3 : 0.3,
    initialAngle: 0,
    selected: false,
    satellites: [],
  };
  const [planetData, setPlanetData] = useState<Planet>(initialPlanet);
  const [isSun, setIsSun] = useState<boolean>(false);
  const screenHeight = window.innerHeight;
  const minDistance = addSatellites ? 10 : 50;
  const maxDistance = addSatellites ? 100 : 2000;
  const minRadius = addSatellites ? 1 : 10;
  const maxRadius = isSun ? 150 : addSatellites ? 10 : 50;

  useEffect(() => {
    if (preview) {
      updateTempPlanet({ ...planetData, speed: 0 });
    } else cleanTempPlanet();
  }, [planetData, preview]);

  useEffect(() => {
    if (isSun) {
      setPlanetData({
        id: uuidv4(),
        color: "#ff8000",
        orbitRadius: 0,
        planetRadius: 100,
        distance: 0,
        pattern: "none",
        speed: 0,
        initialAngle: 0,
        selected: false,
        satellites: [],
      });
    } else {
      setPlanetData(initialPlanet);
    }
  }, [isSun]);

  const handleInputChange = (
    field: keyof Planet,
    value: string | number
  ): void => {
    setPlanetData({
      ...planetData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const planetId = uuidv4();

    const newPlanet: Planet = {
      ...planetData,
      orbitRadius: planetData.distance * 2,
      id: planetId,
      satellites: [],
    };
    const newSatellite: Satellite = {
      ...planetData,
      orbitRadius: planetData.distance * 2,
      id: planetId,
    };
    setPreview(false);
    if (!addSatellites) savePlanet(newPlanet);
    else {
      setAddSatellites(false);
      saveSatellite(newSatellite);
    }

    cleanTempPlanet();
  };
  const handleSunSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const planetId = "0";

    const newPlanet: Planet = {
      ...planetData,
      orbitRadius: planetData.distance,
      id: planetId,
      satellites: [],
    };

    console.log(newPlanet);

    setSun(newPlanet);
    setPreview(false);

    cleanTempPlanet();
  };

  const savePlanet = (newPlanet: Planet): void => {
    const updatedPlanets = [...state.planets, newPlanet];
    updateState({
      ...state,
      planets: updatedPlanets,
    });
  };

  const handleColorChange = (color: any): void => {
    handleInputChange("color", color.hex);
  };

  const handleChecked = (checked: boolean) => {
    setPreview(checked);
    if (checked) {
      updateTempPlanet({ ...planetData, speed: 0.3 });
    } else {
      updateTempPlanet(undefined);
    }
  };
  const handleIsSun = (checked: boolean) => {
    setIsSun(checked);
  };

  const handleRandom = () => {
    setPreview(true);
    const planetDistance = generateRandomNumber(minDistance, maxDistance);
    const randomPlanet = {
      id: uuidv4(),
      color: generateRandomHexColor(),
      orbitRadius: planetDistance * 2,
      planetRadius: generateRandomNumber(minRadius, maxRadius),
      distance: planetDistance,
      pattern: "none",
      speed: Number(generateRandomNumber(0.1, 1).toFixed(2)),
      initialAngle: generateRandomNumber(0, 360),
      selected: false,
      satellites: [],
    };

    setPlanetData(randomPlanet);
  };

  function generateRandomNumber(min: number, max: number) {
    if (max <= 1) {
      const decimalRandomNumber = Math.random() * (max - min) + min;
      return decimalRandomNumber;
    } else {
      const integerRandomNumber =
        Math.floor(Math.random() * (max - min + 1)) + min;
      return integerRandomNumber;
    }
  }

  function generateRandomHexColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const redComponent = r.toString(16).padStart(2, "0");
    const greenComponent = g.toString(16).padStart(2, "0");
    const blueComponent = b.toString(16).padStart(2, "0");

    const hexColorCode = `#${redComponent}${greenComponent}${blueComponent}`;

    return hexColorCode;
  }

  const handleToggle = (e: Event) => {};

  return (
    <>
      <Container show={showPlanetInput}>
        <Icon></Icon>
        {addSatellites && <p>Satellite</p>}
        <form onSubmit={(e) => (isSun ? handleSunSubmit(e) : handleSubmit(e))}>
          <Label>{isSun ? "Sun" : "Planet"} Radius</Label>
          <InputContainer>
            <Slider
              type="range"
              value={planetData.planetRadius}
              min={minRadius}
              max={maxRadius}
              step="1"
              onChange={(e) =>
                handleInputChange("planetRadius", parseInt(e.target.value, 10))
              }
            />
            <Info>{planetData.planetRadius}</Info>
          </InputContainer>
          {!isSun && (
            <>
              <Label>Distance</Label>
              <InputContainer>
                <Slider
                  type="range"
                  value={planetData.distance}
                  min={minDistance}
                  max={maxDistance}
                  step="1"
                  onChange={(e) => {
                    handleInputChange("distance", parseInt(e.target.value, 10));
                  }}
                />
                <Info>{planetData.distance}</Info>
              </InputContainer>
            </>
          )}
          {!isSun && (
            <>
              <Label>Speed 1-10</Label>
              <InputContainer>
                <Slider
                  type="range"
                  value={planetData.speed}
                  min="0.1"
                  max="1"
                  step="0.1"
                  onChange={(e) =>
                    handleInputChange("speed", parseFloat(e.target.value))
                  }
                />
                <Info>{planetData.speed}</Info>
              </InputContainer>
            </>
          )}
          {!isSun && (
            <>
              <Label>Initial Angle</Label>
              <InputContainer>
                <Slider
                  type="range"
                  value={planetData.initialAngle}
                  min="0"
                  max="360"
                  step="1"
                  onChange={(e) =>
                    handleInputChange(
                      "initialAngle",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <Info>{planetData.initialAngle}º</Info>
              </InputContainer>
            </>
          )}
          <Label>Preview</Label>
          <InputContainer>
            <input
              type="checkbox"
              checked={preview}
              onChange={(e) => handleChecked(e.target.checked)}
            />
          </InputContainer>
          <Label>Sun</Label>
          <InputContainer>
            <input
              type="checkbox"
              checked={isSun}
              onChange={(e) => handleIsSun(e.target.checked)}
            />
          </InputContainer>
          <hr />
          <HuePicker
            color={planetData.color}
            onChange={handleColorChange}
            style={{ width: "100px" }}
          />
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={handleRandom}>
            Randomize
          </Button>
          <Button
            type="button"
            onClick={() => setShowPlanetInput(!showPlanetInput)}
          >
            Cancel
          </Button>
        </form>
        <ArrowBtn
          onClick={(e) => {
            handleToggle(e);
          }}
        >
          <ArrowImg src={arrowIcon} />
        </ArrowBtn>
        <Arrow />
      </Container>
    </>
  );
};

const Container = styled.div<ContainerProps>`
  border-radius: 50px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1;
  padding: 20px;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: all 1s ease;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  margin: 10px 0 0 20px;
  width: ${(props) => (props.show ? "250px" : "50px")};
  height: ${(props) => (props.show ? "600px" : "50px")};
  overflow: hidden;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0;
`;

const Icon = styled.div`
  width: 100%;
  color: black;
  text-align: center;
  &::before {
    content: "\\2726";
    font-size: 25px;
    opacity: 0.6;
  }
`;

const Label = styled.label`
  margin-top: 10px;
`;

const Slider = styled.input`
  width: 90%;
  display: inline;
  height: 10px;
`;

const Info = styled.p`
  display: inline;
  margin-left: 10px;
`;

const Button = styled.button`
  margin-top: 20px;
`;

const ArrowBtn = styled.div`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: absolute;
  top: 20px;
  left: 290px;
  z-index: 999;
  transition: all 1s ease;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  width: 20px;
  height: 40px;
  padding-left: 5px;
`;
const ArrowImg = styled.img`
  margin-top: 12.5px;
  width: 15px;
`;

export default PlanetInputs;
