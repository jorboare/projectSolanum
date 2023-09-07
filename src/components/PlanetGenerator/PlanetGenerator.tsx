import styled from "styled-components";
import { useRef, useEffect, useContext } from "react";
import { useAppContext } from "../../context/appContext";

interface PlanetProps {
  color: string;
  size?: number;
  selected: boolean;
}

const Planet = styled.div<PlanetProps>`
  background-color: ${(props) => (props.color ? props.color : null)};
  width: ${(props) => (props.size ? `${props.size}px` : "50px")};
  height: ${(props) => (props.size ? `${props.size}px` : "50px")};
  border-radius: 50%;
  border: ${(props) =>
    props.selected ? `5px solid white` : "0px solid white"};
  transform: ${(props) => (props.selected ? `scale(1.2)` : "")};
  transition: all 0.5s ease;
`;

interface PlanetGeneratorProps {
  color: string;
  size?: number;
  onClick: () => void;
  selected: boolean;
  id: string;
}

const PlanetGenerator: React.FC<PlanetGeneratorProps> = ({
  color,
  size,
  selected,
  onClick,
  id,
}) => {
  const planetRef = useRef<HTMLDivElement | null>(null);

  const { deselectPlanet, selectedPlanet } = useAppContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        planetRef.current &&
        !planetRef.current.contains(event.target as Node)
      ) {
        deselectPlanet();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Planet
      ref={planetRef}
      color={color}
      size={size}
      selected={selectedPlanet === id}
      onClick={onClick}
    />
  );
};

export default PlanetGenerator;
