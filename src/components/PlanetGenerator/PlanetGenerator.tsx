import styled from "styled-components";
import { useRef } from "react";
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
    props.selected
      ? `5px solid white`
      : props.color
      ? "0px solid white"
      : "5px dotted black"};
  transform: ${(props) => (props.selected ? `scale(1.2)` : "")};
  transition: all 0.5s ease;
  position: relative;
`;

interface PlanetGeneratorProps {
  color: string;
  size?: number;
  onClick: () => void;
  id: string;
}

const PlanetGenerator: React.FC<PlanetGeneratorProps> = ({
  color,
  size,
  onClick,
  id,
}) => {
  const planetRef = useRef<HTMLDivElement | null>(null);

  const { selectedPlanets } = useAppContext();

  return (
    <Planet
      ref={planetRef}
      color={color}
      size={size}
      selected={selectedPlanets.some((p) => p === id)}
      onClick={onClick}
    ></Planet>
  );
};

export default PlanetGenerator;
