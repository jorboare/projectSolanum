import { useEffect, useRef, memo, useState } from "react";
import "./Planet.css";
import { useAppContext } from "../../context/appContext";
import styled from "styled-components";
import Satellite from "../Satellites/Satellites";
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
  id: string;
  satRadius: number;
  distance: number;
  color: string;
  pattern: string;
  speed: number;
  initialAngle: number;
}
interface InnerPlanetProps {
  color: string;
  radius: number;
  selected: boolean;
  highContrast: boolean;
  followed?: boolean;
  sun?: boolean;
  dimension?: boolean;
  cover?: boolean;
}

interface OrbitProps {
  size: number;
  index: number;
  show: boolean;
  dimension?: boolean;
}
interface PlanetProps {
  order?: number;
  data: any;
  sun?: boolean;

  onClick?: () => void; // Añadir la propiedad onClick
}

interface CoordinatesInterface {
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
}

const Planet = (props: PlanetProps) => {
  const {
    planetsNumber,
    orbits,
    selectedPlanets,
    highContrast,
    setPositions,
    followedPlanet,
    thirdDimension,
    newSpeed,
    generalScale,
    setGeneralScale,
  } = useAppContext();
  const movingElementRef = useRef(null);
  const { planetRadius, distance, color, speed, initialAngle, id, satellites } =
    props.data;

  const [coordinates, setCoordinates] = useState<CoordinatesInterface>();

  useEffect(() => {
    const movingElement: any = movingElementRef.current;
    // const widthOffset = movingElement.offsetWidth / 2;
    const heightOffset = movingElement.offsetHeight / 2;
    if (id === followedPlanet) {
      // console.log("screen.width ---->", screen.width);
      // console.log("screen.height ---->", screen.height);
      // console.log("pos ---->", {
      //   x: -x - screen.width,
      //   y: -y - screen.height,
      // });
      //works for scale: 3
      // setPositions({
      //   x: -x * 3 - screen.width - widthOffset,
      //   y: -y * 3 - screen.height - heightOffset,
      // });
      // This works for scale: 1
      if (coordinates) {
        // setPositions({
        //   x: -coordinates?.coordinates.x + screen.width / 2,
        //   y: -coordinates?.coordinates.y,
        // });
        // This works for scale: 2
        // console.log("coordinates.coordinates.x", coordinates.coordinates.x);
        // console.log("coordinates.coordinates.y", coordinates.coordinates.y);
        // setPositions({
        //   x: -coordinates?.coordinates.x,
        //   y: -coordinates?.coordinates.y,
        // });

        const inclination = (50 * Math.PI) / 180;
        const adjustedX =
          coordinates?.coordinates.x * Math.cos(inclination) -
          coordinates?.coordinates.y * Math.sin(inclination);
        const adjustedY =
          coordinates?.coordinates.x * Math.sin(inclination) +
          coordinates?.coordinates.y * Math.cos(inclination);
        if (thirdDimension && !generalScale) {
          setGeneralScale(1);
          setPositions({
            scale: generalScale,
            translation: {
              x: -adjustedX + screen.width / 2,
              y: -adjustedY + screen.height / 20,
            },
          });
        } else if (thirdDimension && generalScale === 2) {
          console.log(-adjustedY + screen.height / (50 * 1000));
          setPositions({
            scale: generalScale,
            translation: {
              x: -adjustedX + screen.width / 2,
              y: -adjustedY - 200,
            },
          });
        } else {
          setGeneralScale(2);
          setPositions({
            scale: generalScale,
            translation: {
              x: -coordinates?.coordinates.x * 2 + screen.width / 2,
              y:
                -coordinates?.coordinates.y * 2 -
                screen.height / 2 +
                heightOffset,
            },
          });
        }
      }
    }
  }, [coordinates, followedPlanet, generalScale]);

  useEffect(() => {
    const movingElement: any = movingElementRef.current;
    animateOrbit(movingElement, distance, speed, initialAngle);
  }, [props, newSpeed]);

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
      setCoordinates({ id: id, coordinates: { x, y } });

      element.style.transform = `translate(${x - widthOffset}px, ${
        y - heightOffset
      }px)`;

      if (id === followedPlanet) {
        // console.log("screen.width ---->", screen.width);
        // console.log("screen.height ---->", screen.height);
        // console.log("pos ---->", {
        //   x: -x - screen.width,
        //   y: -y - screen.height,
        // });
        //works for scale: 3
        // setPositions({
        //   x: -x * 3 - screen.width - widthOffset,
        //   y: -y * 3 - screen.height - heightOffset,
        // });
        // This works for scale: 1
        // setPositions({
        //   x: -x + screen.width / 2,
        //   y: -y,
        // });
        // This works for scale: 2
        // setPositions({
        //   x: -x * 2 + screen.width / 2,
        //   y: -y * 2 - screen.height / 2 + heightOffset,
        // });
      }

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
          <InnerPlanet
            color={color}
            radius={planetRadius}
            selected={selectedPlanets.some((p) => p === id)}
            highContrast={highContrast}
            followed={followedPlanet ? true : false}
            dimension={thirdDimension}
          >
            {satellites.map((s: Satellite, idx: number) => {
              return <Satellite key={idx} data={s}></Satellite>;
            })}
            {/* <Contorno radius={planetRadius} /> */}
          </InnerPlanet>
          <InnerPlanet
            color={color}
            radius={planetRadius}
            selected={selectedPlanets.some((p) => p === id)}
            highContrast={highContrast}
            followed={followedPlanet ? true : false}
            dimension={thirdDimension}
            cover={true}
          ></InnerPlanet>
          {props.sun && (
            <InnerPlanet
              color={color}
              radius={planetRadius}
              selected={selectedPlanets.some((p) => p === id)}
              highContrast={highContrast}
              sun={props.sun}
            ></InnerPlanet>
          )}
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
  border: ${(props) =>
    props.show
      ? props.dimension
        ? "1px solid rgba(255, 255, 255, 0.4)"
        : "1px solid rgba(255, 255, 255, 0.5)"
      : "none"};
  border-radius: 50%;
  margin: 0 auto;
  transition: all 0s ease;
  z-index: ${(props) => props.index};
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
  width: ${(props) =>
    props.highContrast
      ? props.dimension
        ? props.radius * 2 - 5 + "px"
        : props.radius - 5 + "px"
      : props.sun
      ? props.radius * 1.5 + "px"
      : props.dimension
      ? props.radius * 2 + "px"
      : props.radius + "px" || "100px"};
  height: ${(props) =>
    props.highContrast
      ? props.dimension
        ? props.radius * 2 - 5 + "px"
        : props.radius - 5 + "px"
      : props.sun
      ? props.radius * 1.5 + "px"
      : props.dimension
      ? props.radius * 2 + "px"
      : props.radius + "px" || "100px"};
  top: 50%;
  left: 50%;
  transform: ${(props) =>
    props.dimension
      ? "translate(-50%, -50%) rotateY(-60deg)"
      : "translate(-50%, -50%)"};
  background-color: ${(props) =>
    props.highContrast ? "transparent" : props.color || "blue"};
  border-radius: 50%;
  transition: all 0s ease, border 0.5s ease;
  border: ${(props) =>
    ((props.selected || props.highContrast) &&
      props.radius &&
      !props.followed) ||
    props.highContrast
      ? "3px solid white"
      : ""};
  filter: ${(props) => (props.sun ? "blur(40px)" : "")};
  background-color: ${(props) =>
    props.highContrast ? "transparent" : props.color || "blue"};
  z-index: ${(props) => (props.sun ? 0 : 400)};
  clip-path: ${(props) =>
    props.cover && !props.sun
      ? "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)"
      : ""};
`;

// const Sat = styled.div`
//   position: absolute;
//   width: ${(props) => props.radius + "px" || "100px"};
//   height: ${(props) => props.radius + "px" || "100px"};
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   background-color: ${(props) => props.color || "blue"};
//   border-radius: 50%;
//   overflow: hidden;
//   transition: all 0.5s ease;
// `;

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
