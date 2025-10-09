import React, { 
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import type { ReactNode } from 'react';
import Matter from 'matter-js';

// Extract named exports from Matter.js CommonJS module
const {
  Bodies,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} = Matter;

// Utility function to calculate position
function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;
    return containerSize * percentage;
  }
  return typeof value === "number"
    ? value
    : elementSize / 2;
}

type GravityProps = {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
}

type PhysicsBody = {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
}

type MatterBodyProps = {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle";
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
}

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    context.registerElement(idRef.current, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });

    return () => context.unregisterElement(idRef.current);
  }, [props, children, matterBodyOptions, isDraggable, x, y, angle, context]);

  return (
    <div
      ref={elementRef}
      className={`absolute ${className || ''} ${isDraggable ? 'pointer-events-auto cursor-grab' : ''}`}
      style={{
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = false,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Engine.create());
    const render = useRef<Matter.Render | undefined>(undefined);
    const runner = useRef<Matter.Runner | undefined>(undefined);
    const bodiesMap = useRef(new Map<string, PhysicsBody>());
    const frameId = useRef<number | undefined>(undefined);
    const mouseConstraint = useRef<Matter.MouseConstraint | undefined>(undefined);
    const mouseDown = useRef(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const isRunning = useRef(false);
    
    // Update canvas size when container resizes
    const updateCanvasSize = useCallback(() => {
      if (!canvas.current) return;
      const rect = canvas.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    }, []);
    
    // Register Matter.js body in the physics world
    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return;
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current!.getBoundingClientRect();
    
        const angle = (props.angle || 0) * (Math.PI / 180);
    
        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height);
    
        let body;
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Bodies.circle(x, y, radius, {
            friction: props.matterBodyOptions?.friction || 0.1,
            restitution: props.matterBodyOptions?.restitution || 0.1,
            density: props.matterBodyOptions?.density || 0.001,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            friction: props.matterBodyOptions?.friction || 0.1,
            restitution: props.matterBodyOptions?.restitution || 0.1,
            density: props.matterBodyOptions?.density || 0.001,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        }
    
        if (body) {
          World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props });
        }
      },
      [debug]
    );
    
    // Unregister Matter.js body from the physics world
    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id);
      if (body) {
        World.remove(engine.current.world, body.body);
        bodiesMap.current.delete(id);
      }
    }, []);
    
    // Keep react elements in sync with the physics world
    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);
    
        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`;
      });
    
      frameId.current = requestAnimationFrame(updateElements);
    }, []);
    
    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;
    
      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;
      
      // Update canvas size state
      setCanvasSize({ width, height });
    
      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;
    
      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      });
    
      const mouse = Mouse.create(render.current.canvas);
      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      });
    
      // Add walls
      const walls = [
        // Floor
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),
    
        // Right wall
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),
    
        // Left wall
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: {
            visible: debug,
          },
        }),
      ];
    
      const topWall = addTopWall
        ? Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: {
              visible: debug,
            },
          })
        : null;
    
      if (topWall) {
        walls.push(topWall);
      }
    
      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0;
    
      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default";
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab";
            }
          }
        });
    
        canvas.current.addEventListener("mousedown", () => {
          mouseDown.current = true;
    
          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grabbing";
            } else {
              canvas.current.style.cursor = "default";
            }
          }
        });
        canvas.current.addEventListener("mouseup", () => {
          mouseDown.current = false;
    
          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grab";
            } else {
              canvas.current.style.cursor = "default";
            }
          }
        });
      }
    
      World.add(engine.current.world, [mouseConstraint.current, ...walls]);
    
      // CRÍTICO: vincular mouse al render para que funcione el dragging
      render.current.mouse = mouse;
      
      // Ensure mouse constraint is properly configured for dragging
      mouseConstraint.current.mouse = mouse;

      // Eventos de drag para feedback visual
      Events.on(mouseConstraint.current, 'startdrag', (event) => {
        if (canvas.current) {
          canvas.current.style.cursor = 'grabbing';
        }
      });

      Events.on(mouseConstraint.current, 'enddrag', (event) => {
        if (canvas.current) {
          canvas.current.style.cursor = 'grab';
        }
      });
    
      runner.current = Runner.create();
      Render.run(render.current);
      updateElements();
      runner.current.enabled = false;
    
      if (autoStart) {
        runner.current.enabled = true;
        startEngine();
      }
    }, [updateElements, debug, autoStart, gravity.x, gravity.y, addTopWall, grabCursor]);
    
    // Clear the Matter.js world
    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    
      if (mouseConstraint.current) {
        // Limpiar eventos del mouseConstraint
        Events.off(mouseConstraint.current, 'startdrag');
        Events.off(mouseConstraint.current, 'enddrag');
        World.remove(engine.current.world, mouseConstraint.current);
      }
    
      if (render.current) {
        // CRÍTICO: limpiar eventos del mouse
        Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        render.current.canvas.remove();
      }
    
      if (runner.current) {
        Runner.stop(runner.current);
      }
    
      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
      }
    
      bodiesMap.current.clear();
    }, []);
    
    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true;
        Runner.run(runner.current, engine.current);
      }
      if (render.current) {
        Render.run(render.current);
      }
      frameId.current = requestAnimationFrame(updateElements);
      isRunning.current = true;
    }, [updateElements]);
    
    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;
    
      if (runner.current) {
        Runner.stop(runner.current);
      }
      if (render.current) {
        Render.stop(render.current);
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      isRunning.current = false;
    }, []);
    
    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = (props.angle || 0) * (Math.PI / 180);
    
        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        );
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        );
        body.position.x = x;
        body.position.y = y;
      });
      updateElements();
    }, [stopEngine, updateElements, canvasSize.width, canvasSize.height]);
    
    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    );
    
    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
    }, [initializeRenderer, clearRenderer]);
    
    // Handle resize events
    useEffect(() => {
      if (!resetOnResize) return;
      
      const handleResize = () => {
        if (canvas.current) {
          clearRenderer();
          setTimeout(() => {
            initializeRenderer();
          }, 100);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [resetOnResize, clearRenderer, initializeRenderer]);
    
    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={`absolute top-0 left-0 w-full h-full ${className || ''}`}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";
export { Gravity, MatterBody };
