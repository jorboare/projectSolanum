import { useEffect, useRef } from "react";
import "./SolarSystem.css";

const SolarSystem = () => {
  const movingElementRef = useRef(null);

  useEffect(() => {
    const movingElement: any = movingElementRef.current;

    animateOrbit(movingElement, 100, 0.2, 0);
  });

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
    <div id="orbit">
      <div ref={movingElementRef} id="movingElement">
        <div id="innerPlanet"></div>
      </div>
    </div>
  );
};

export default SolarSystem;
