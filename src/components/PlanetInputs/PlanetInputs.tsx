import { useState, useEffect, useId } from "react";
import styled from "styled-components";
//@ts-ignore
import { CirclePicker } from "react-color";
import { useAppContext } from "../../context/appContext";
import "./PlanetInputs.css";
import { v4 as uuidv4 } from "uuid";

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
  radius: number;
  distance: number;
  color: string;
  pattern: string;
}

interface ContainerProps {
  show: boolean;
}

const Container = styled.div<ContainerProps>`
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  position: absolute;
  top: 20px;
  left: 0;
  z-index: 999;
  padding: 20px;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: all 1s ease;
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
`;

const Info = styled.p`
  display: inline;
  margin-left: 10px;
`;

const Button = styled.button`
  margin-top: 20px;
`;

const PlanetInputs: React.FC = () => {
  const {
    state,
    updateState,
    updateTempPlanet,
    cleanTempPlanet,
    preview,
    setPreview,
    mouseInactive,
  } = useAppContext();
  const [planetData, setPlanetData] = useState<Planet>({
    id: uuidv4(),
    color: "#ff0000",
    orbitRadius: 100,
    planetRadius: 100,
    distance: 100,
    pattern: "none",
    speed: 0.3,
    initialAngle: 0,
    selected: false,
    satellites: [],
  });
  const screenHeight = window.innerHeight;
  const maxDistance = (screenHeight * 0.8) / 2;

  useEffect(() => {
    if (preview) {
      updateTempPlanet({ ...planetData, speed: 0 });
    } else cleanTempPlanet();
  }, [planetData, preview]);

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
    setPreview(false);
    savePlanet(newPlanet);
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

  const handleRandom = () => {
    const planetDistance = generateRandomNumber(50, maxDistance);
    const randomPlanet = {
      id: uuidv4(),
      color: "#ff0000",
      orbitRadius: planetDistance * 2,
      planetRadius: generateRandomNumber(10, 50),
      distance: planetDistance,
      pattern: "none",
      speed: generateRandomNumber(0.1, 1),
      initialAngle: generateRandomNumber(0, 360),
      selected: false,
      satellites: [],
    };

    setPlanetData(randomPlanet);
  };

  function generateRandomNumber(min: number, max: number) {
    if (max <= 1) {
      // Si el valor máximo es menor o igual a 1, genera un número decimal aleatorio
      const decimalRandomNumber = Math.random() * (max - min) + min;
      return decimalRandomNumber;
    } else {
      // Si el valor máximo es mayor que 1, genera un número entero aleatorio
      const integerRandomNumber =
        Math.floor(Math.random() * (max - min + 1)) + min;
      return integerRandomNumber;
    }
  }

  return (
    <Container show={!mouseInactive}>
      <Icon></Icon>
      <form onSubmit={handleSubmit}>
        <Label>Planet Radius</Label>
        <InputContainer>
          <Slider
            type="range"
            value={planetData.planetRadius}
            min="10"
            max="50"
            step="1"
            onChange={(e) =>
              handleInputChange("planetRadius", parseInt(e.target.value, 10))
            }
          />
          <Info>{planetData.planetRadius}</Info>
        </InputContainer>
        <Label>Distance</Label>
        <InputContainer>
          <Slider
            type="range"
            value={planetData.distance}
            min="50"
            max={maxDistance}
            step="1"
            onChange={(e) => {
              handleInputChange("distance", parseInt(e.target.value, 10));
            }}
          />
          <Info>{planetData.distance}</Info>
        </InputContainer>
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
        <Label>Initial Angle</Label>
        <InputContainer>
          <Slider
            type="range"
            value={planetData.initialAngle}
            min="0"
            max="360"
            step="1"
            onChange={(e) =>
              handleInputChange("initialAngle", parseFloat(e.target.value))
            }
          />
          <Info>{planetData.initialAngle}º</Info>
        </InputContainer>
        <Label>Preview</Label>
        <InputContainer>
          <input
            type="checkbox"
            checked={preview}
            onChange={(e) => handleChecked(e.target.checked)}
          />
        </InputContainer>
        <hr />
        <CirclePicker onChange={handleColorChange} />
        <Button type="submit">Submit</Button>
        <Button type="button" onClick={handleRandom}>
          Rnadomize
        </Button>
      </form>
    </Container>
  );
};

export default PlanetInputs;
