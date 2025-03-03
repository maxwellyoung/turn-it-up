"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export default function PhysicsSimulation() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();

  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Mouse = Matter.Mouse;
    const MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: "transparent",
        showAngleIndicator: false,
      },
    });
    renderRef.current = render;

    // Create walls
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "#22c55e",
        lineWidth: 1,
      },
    };

    const wallThickness = 50;
    const width = render.options.width;
    const height = render.options.height;

    const walls = [
      Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        wallOptions
      ),
      Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        wallOptions
      ),
      Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        wallOptions
      ),
      Bodies.rectangle(
        width / 2,
        -wallThickness / 2,
        width,
        wallThickness,
        wallOptions
      ),
    ];

    // Create objects
    const objects = [];
    const colors = ["#22c55e", "#16a34a", "#15803d"];

    const createObject = (x: number, y: number) => {
      const size = Math.random() * 20 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      return Bodies.circle(x, y, size, {
        restitution: 0.8,
        friction: 0.005,
        frictionAir: 0.001,
        render: {
          fillStyle: color,
          strokeStyle: "#000000",
          lineWidth: 1,
        },
      });
    };

    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      objects.push(createObject(x, y));
    }

    // Add all bodies to the world
    World.add(engine.world, [...walls, ...objects]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Add some forces to make it more dynamic
    setInterval(() => {
      objects.forEach((object) => {
        const forceMagnitude = 0.02 * object.mass;
        Matter.Body.applyForce(object, object.position, {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: (Math.random() - 0.5) * forceMagnitude,
        });
      });
    }, 1000);

    // Run the engine
    Engine.run(engine);
    Render.run(render);

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current || !render.canvas) return;

      const width = sceneRef.current.clientWidth;
      const height = sceneRef.current.clientHeight;

      render.canvas.width = width;
      render.canvas.height = height;
      render.options.width = width;
      render.options.height = height;

      // Update wall positions
      Matter.Body.setPosition(walls[0], {
        x: width / 2,
        y: height + wallThickness / 2,
      });
      Matter.Body.setPosition(walls[1], {
        x: -wallThickness / 2,
        y: height / 2,
      });
      Matter.Body.setPosition(walls[2], {
        x: width + wallThickness / 2,
        y: height / 2,
      });
      Matter.Body.setPosition(walls[3], {
        x: width / 2,
        y: -wallThickness / 2,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
        renderRef.current = undefined;
      }

      if (engineRef.current) {
        Engine.clear(engineRef.current);
        engineRef.current = undefined;
      }
    };
  }, []);

  return <div ref={sceneRef} className="w-full h-full" />;
}
