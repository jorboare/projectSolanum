import { useEffect, useRef, memo } from "react";
import "./SolarSystem.css";
import { useAppContext } from "../../context/appContext";
import styled from "styled-components";

interface ContornoProps {
  radius: number;
  size?: number;
}
interface Planet {
  id: string;
  orbitRadius: number;
  planetRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
  satellites?: Satellite[];
}

interface Satellite {
  radius: number;
  distance: number;
  color: string;
  pattern: string;
}
interface InnerPlanetProps {
  color: string;
  radius: number;
}

interface OrbitProps {
  size: number;
  index: number;
  show: boolean;
}
interface PlanetProps {
  order?: number;
  data: any;
  onClick?: () => void; // Añadir la propiedad onClick
}

const Planet = (props: PlanetProps) => {
  const { planetsNumber, preview, orbits, tempPlanet } = useAppContext();
  const movingElementRef = useRef(null);

  const {
    id,
    orbitRadius,
    planetRadius,
    distance,
    color,
    pattern,
    speed,
    initialAngle,
    satellites,
  } = props.data; //TO DO: Create interface

  useEffect(() => {
    console.log("refresed");
    console.log(props);
  }, [props]);

  useEffect(() => {
    const movingElement: any = movingElementRef.current;
    animateOrbit(movingElement, distance, speed, initialAngle);
  }, [props]);

  const animateOrbit = (
    element: HTMLElement,
    radius: number,
    speed: number,
    angle: number
  ) => {
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
      >
        <MovingElement ref={movingElementRef}>
          <InnerPlanet color={color} radius={planetRadius}>
            {/* <Contorno radius={planetRadius} /> */}
          </InnerPlanet>
        </MovingElement>
      </Orbit>
    </>
  );
};

const Orbit = styled.div<OrbitProps>`
  position: absolute;
  width: ${(props) => props.size * 2 + "px" || "800px"};
  height: ${(props) => props.size * 2 + "px" || "800px"};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: ${(props) => (props.show ? "1px dashed white" : "none")};
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

const InnerPlanet = styled.div<InnerPlanetProps>`
  position: absolute;
  width: ${(props) => props.radius + "px" || "100px"};
  height: ${(props) => props.radius + "px" || "100px"};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.color || "blue"};
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.5s ease;
  &:hover {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

// const Contorno = styled.div<ContornoProps>`
//   position: absolute;
//   width: 100px;
//   height: 100px;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   border: ${(props) =>
//     props.radius
//       ? `${props.radius / 2}px solid rgba(0, 0, 0, 0.8)`
//       : "50px solid rgba(0, 0, 0, 0.8)"};
//   border-radius: 50%;
//   filter: blur(20px);
//   transition: all 0.5s ease;
//   &:hover {
//     position: absolute;
//     width: ${(props) => `${props.radius / 2}px` || "100px"};
//     height: ${(props) => `${props.radius / 2}px` || "100px"};
//     top: 50%;
//     left: 50%;
//     border: 75px solid rgba(0, 0, 0, 1);
//     filter: blur(20px);
//   }
// `;

export default memo(Planet);
