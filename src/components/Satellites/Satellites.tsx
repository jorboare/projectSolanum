import { useEffect, useRef, memo } from "react";
import "./Satellites.css";
import { useAppContext } from "../../context/appContext";
import styled from "styled-components";
interface SatelliteCompProps {
  radius: number;
  color: string;
  hightContrast: boolean;
  dimension: boolean;
}

interface OrbitProps {
  size: number;
  index: number;
  show: boolean;
  dimension: boolean;
}
interface SatelliteProps {
  order?: number;
  data: any;
  onClick?: () => void; // Añadir la propiedad onClick
}

const Satellite = (props: SatelliteProps) => {
  const { planetsNumber, orbits, hightContrast, thirdDimension } =
    useAppContext();
  const movingElementRef = useRef(null);
  const { planetRadius, distance, color, speed, initialAngle } = props.data; //TO DO: Create interface

  useEffect(() => {
    const movingElement: any = movingElementRef.current;
    animateOrbit(movingElement, distance, speed, initialAngle);
  }, [props, thirdDimension]);

  const animateOrbit = (
    element: HTMLElement,
    radius: number,
    speed: number,
    angle: number
  ) => {
    radius = thirdDimension ? (radius = radius * 2) : radius;
    const widthOffset = element.offsetWidth / 2;
    const heightOffset = element.offsetHeight / 2;

    const orbitRadius = radius; // Radio de la órbita
    const orbitSpeed = speed; //Velocidad de la orbita en grados por segundo

    angle -= 90;
    function update() {
      angle += orbitSpeed;
      const x = Math.cos((angle * Math.PI) / 180) * orbitRadius;
      const y = Math.sin((angle * Math.PI) / 180) * orbitRadius;

      element.style.transform = `translate(${x - widthOffset}px, ${
        y - heightOffset
      }px)`;

      requestAnimationFrame(update);
    }

    update();
  };

  return (
    <>
      <Orbit
        size={distance}
        index={planetsNumber() - (props.order || 0)}
        show={orbits}
        dimension={thirdDimension}
      >
        <MovingElement ref={movingElementRef}>
          <SatelliteBody
            color={color}
            radius={planetRadius}
            hightContrast={hightContrast}
            dimension={thirdDimension}
          ></SatelliteBody>
        </MovingElement>
      </Orbit>
    </>
  );
};

const Orbit = styled.div<OrbitProps>`
  position: absolute;
  width: ${(props) =>
    props.dimension
      ? props.size * 4 + "px" || "800px"
      : props.size * 2 + "px" || "800px"};
  height: ${(props) =>
    props.dimension
      ? props.size * 4 + "px" || "800px"
      : props.size * 2 + "px" || "800px"};
  top: 50%;
  left: 50%;
  transform: ${(props) =>
    props.dimension
      ? "translate(-50%, -50%) rotateX(60deg)"
      : "translate(-50%, -50%)"};
  border: ${(props) =>
    props.show ? "1px solid rgba(255, 255, 255, 0.3)" : "none"};
  border-radius: 50%;
  margin: 0 auto;
  z-index: ${(props) => (props.index ? props.index : "0")};
  transition: all 0.5s ease;
`;

const MovingElement = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
`;

const SatelliteBody = styled.div<SatelliteCompProps>`
  position: absolute;
  width: ${(props) =>
    props.hightContrast
      ? props.radius - 5 + "px"
      : props.dimension
      ? props.radius * 2 + "px"
      : props.radius + "px" || "100px"};
  height: ${(props) =>
    props.hightContrast
      ? props.radius - 5 + "px"
      : props.dimension
      ? props.radius * 2 + "px"
      : props.radius + "px" || "100px"};
  top: 50%;
  left: 50%;
  transform: ${(props) =>
    props.dimension
      ? "translate(-50%, -50%) rotateY(-60deg)"
      : "translate(-50%, -50%);"};
  background-color: ${(props) =>
    props.hightContrast ? "transparent" : props.color || "blue"};
  border-radius: 50%;
  transition: all 0.5s ease;
  border: ${(props) => (props.hightContrast ? "3px solid white" : "")};
`;

export default memo(Satellite);
