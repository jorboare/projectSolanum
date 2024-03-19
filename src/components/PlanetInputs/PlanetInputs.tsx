import { useState, useEffect } from "react";
import styled from "styled-components";
//@ts-ignore
import { CompactPicker } from "react-color";
import { useAppContext } from "../../context/appContext";
import "./PlanetInputs.css";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "@mui/material/Checkbox";
import PlanetGenerator from "../PlanetGenerator/PlanetGenerator";
import NewSatellite from "../../assets/Icons/AddSatellite.png";
import Planet from "../Planet/Planet";

interface Planet {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
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
    addSatellites,
    setAddSatellites,
    saveSatellite,
    setSun,
    showPlanetInput,
    setShowPlanetInput,
    setMapState,
    tempPlanet,
    selPlanet,
  } = useAppContext();
  const initialPlanet = selPlanet
    ? selPlanet
    : {
        id: uuidv4(),
        color: "#ff0000",
        orbitRadius: addSatellites ? 50 : 50,
        planetRadius: addSatellites ? 3 : 50,
        distance: addSatellites ? 50 : 100,
        pattern: "none",
        speed: addSatellites ? 0.3 : 0.3,
        initialAngle: 0,
        satellites: [],
      };
  const [planetData, setPlanetData] = useState<Planet>(initialPlanet);
  const [isSun, setIsSun] = useState<boolean>(false);
  const minDistance = addSatellites ? 10 : 50;
  const maxDistance = addSatellites ? 100 : 2000;
  const minRadius = addSatellites ? 1 : 10;
  const maxRadius = isSun ? 150 : addSatellites ? 10 : 100;

  useEffect(() => {
    if (preview) {
      let satellites: Satellite[] = [];
      if (planetData?.satellites.length > 1) {
        satellites = planetData.satellites.map((s) => {
          return { ...s, speed: 0 };
        });
      }
      updateTempPlanet({ ...planetData, speed: 0, satellites: satellites });
    } else cleanTempPlanet();
  }, [preview]);

  useEffect(() => {
    setPlanetData(initialPlanet);
  }, [selPlanet, addSatellites]);

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
        satellites: [],
      });
    } else {
      setPlanetData(initialPlanet);
    }
  }, [isSun]);
  useEffect(() => {
    updateTempPlanet({ ...planetData, speed: 0 });
  }, [planetData]);

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
      saveSatellite(newSatellite);
      setAddSatellites(false);
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
      updateTempPlanet({ ...planetData, speed: 0 });
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

  useEffect(() => {
    const farPlanet = state.planets.reduce((maxDistance, planet) =>
      planet.distance > maxDistance.distance ? planet : maxDistance
    );
    let farDistance = farPlanet.distance;
    if (tempPlanet && tempPlanet?.distance) {
      farDistance = tempPlanet?.distance;
    }
    const minValue = 150;
    const newScale = minValue / (farDistance / 2);
    if (showPlanetInput && preview) {
      if (window.innerWidth >= 768) {
        const maxScale = 0.8;
        setMapState({
          scale: newScale >= maxScale ? maxScale : newScale,
          translation: {
            x: window.innerWidth / 3,
            y: window.innerHeight / 3,
          },
        });
      } else {
        const maxScale = 0.6;
        setMapState({
          scale: newScale >= maxScale ? maxScale : newScale,
          translation: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 5,
          },
        });
      }
    }
    if (!showPlanetInput) setPreview(false);
  }, [showPlanetInput, tempPlanet]);

  const handleClick = (id: string) => {
    // const sat = selPlanet?.satellites.filter((s) => s.id === id)[0];
    // setPlanetData(sat);
    console.log(id);
    setAddSatellites(true);
  };

  const handleAddSat = () => {
    setAddSatellites(true);
  };

  return (
    <>
      <Container show={showPlanetInput}>
        <Icon></Icon>
        <form
          onSubmit={(e) => (isSun ? handleSunSubmit(e) : handleSubmit(e))}
          onChange={() => updateTempPlanet({ ...planetData, speed: 0 })}
        >
          <Checkboxes>
            <>
              <Label>Preview</Label>
              <InputContainer>
                <Checkbox
                  checked={preview}
                  onChange={(e) => handleChecked(e.target.checked)}
                  color="default"
                />
              </InputContainer>
            </>

            <Label>Sun</Label>
            <InputContainer>
              <Checkbox
                color="default"
                checked={isSun}
                onChange={(e) => handleIsSun(e.target.checked)}
              />
            </InputContainer>
            <Label>Satellite</Label>
            <InputContainer>
              <Checkbox
                color="default"
                checked={addSatellites}
                onChange={(e) => setAddSatellites(e.target.checked)}
              />
            </InputContainer>
          </Checkboxes>
          <IndividualContainer>
            <Label>{isSun ? "Sun" : "Planet"} Radius</Label>
            <InputContainer>
              <Slider
                type="range"
                value={planetData.planetRadius}
                min={minRadius}
                max={maxRadius}
                step="1"
                onChange={(e) =>
                  handleInputChange(
                    "planetRadius",
                    parseInt(e.target.value, 10)
                  )
                }
              />
              <Info>{planetData.planetRadius}</Info>
            </InputContainer>
          </IndividualContainer>
          {!isSun && (
            <IndividualContainer>
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
            </IndividualContainer>
          )}
          {!isSun && (
            <IndividualContainer>
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
            </IndividualContainer>
          )}
          {!isSun && (
            <IndividualContainer>
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
            </IndividualContainer>
          )}
          <Label>Color</Label>
          <ColorPickerCont>
            <CompactPicker
              className="colorPicker"
              color={planetData.color}
              onChange={handleColorChange}
              style={{ width: "100px" }}
            />
          </ColorPickerCont>

          <hr />
          <p>Satellites</p>
          <SatellitesContainer>
            {selPlanet?.satellites.map((s) => (
              <PlanetGenerator
                key={s.id}
                color={s.color}
                id={s.id}
                onClick={() => handleClick(s.id)}
              ></PlanetGenerator>
            ))}
            <AddSatellitesIcon
              src={NewSatellite}
              onClick={handleAddSat}
            ></AddSatellitesIcon>
          </SatellitesContainer>
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
  transition: all 0.5s ease;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  margin: 10px 0 0 20px;
  width: ${(props) => (props.show ? "250px" : "50px")};
  height: ${(props) => (props.show ? "auto" : "50px")};
  max-height: 600px;
  overflow: hidden;

  @media (min-width: 768px) {
    bottom: 130px;
    right: 130px;
  }

  @media (max-width: 768px) {
    width: ${(props) => (props.show ? `${window.innerWidth - 80}px` : "50px")};
    height: ${(props) => (props.show ? "300px" : "50px")};
    padding: ${(props) => (props.show ? "20px" : "0px")};
    max-height: 400px;
    margin: 0;
    border-radius: 25px;
    overflow: scroll;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  height: 20px;
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
  margin-top: 0px;
`;

const Slider = styled.input`
  width: 90%;
  display: inline;
  height: 10px;
`;

const Info = styled.p`
  display: inline;
  margin-left: 10px;
  width: 10%;
`;

const Button = styled.button`
  margin-top: 20px;
`;

const Checkboxes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IndividualContainer = styled.div`
  margin-top: 10px;
`;
const ColorPickerCont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SatellitesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
`;

const AddSatellitesIcon = styled.img`
  width: 60px;
  filter: invert(1);
  transition: all 0.5 ease;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    filter: invert(0);
    transition: filter 0.3s ease;
  }
`;
export default PlanetInputs;
