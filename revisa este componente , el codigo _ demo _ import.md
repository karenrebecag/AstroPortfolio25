<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# revisa este componente , el codigo : demo : import { Gravity, MatterBody } from "@/components/ui/gravity";

function Preview() {
return (
<div className="w-full h-full min-h-[500px] flex flex-col relative font-azeretMono">
<div className="pt-20 text-6xl sm:text-7xl md:text-8xl text-black w-full text-center font-calendas italic">
fancy
</div>
<p className="pt-4 text-base sm:text-xl md:text-2xl text-black w-full text-center">
components made with:
</p>
<Gravity gravity={{ x: 0, y: 1 }} className="w-full h-full">
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="30%"
y="10%"
>
<div className="text-xl sm:text-2xl md:text-3xl bg-[#0015ff] text-white rounded-full hover:cursor-pointer px-8 py-4">
react
</div>
</MatterBody>
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="30%"
y="30%"
>
<div className="text-xl sm:text-2xl md:text-3xl bg-[#E794DA] text-white rounded-full hover:cursor-grab px-8 py-4 ">
typescript
</div>
</MatterBody>
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="40%"
y="20%"
angle={10}
>
<div className="text-xl sm:text-2xl md:text-3xl bg-[#1f464d]  text-white rounded-full hover:cursor-grab px-8 py-4 ">
motion
</div>
</MatterBody>
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="75%"
y="10%"
>
<div className="text-xl sm:text-2xl md:text-3xl bg-[#ff5941]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
tailwind
</div>
</MatterBody>
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="80%"
y="20%"
>
<div className="text-xl sm:text-2xl md:text-3xl bg-orange-500  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
drei
</div>
</MatterBody>
<MatterBody
matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
x="50%"
y="10%"
>
<div className="text-xl sm:text-2xl md:text-3xl bg-[#ffd726]  text-white [#E794DA] rounded-full hover:cursor-grab px-8 py-4 ">
matter-js
</div>
</ gravity.tsx : import {
createContext,
forwardRef,
ReactNode,
useCallback,
useContext,
useEffect,
useImperativeHandle,
useRef,
useState,
} from "react"
import { debounce } from "lodash"
import Matter, {
Bodies,
Common,
Engine,
Events,
Mouse,
MouseConstraint,
Query,
Render,
Runner,
World,
} from "matter-js"

import { cn } from "@/lib/utils"

import SVGPathCommander from 'svg-path-commander';

// Function to convert SVG path "d" to vertices
function parsePathToVertices(path: string, sampleLength = 15) {
// Convert path to absolute commands
const commander = new SVGPathCommander(path);

    const points: { x: number, y: number }[] = [];
    let lastPoint: { x: number, y: number } | null = null;
    
    // Get total length of the path
    const totalLength = commander.getTotalLength();
    let length = 0;
    
    // Sample points along the path
    while (length < totalLength) {
        const point = commander.getPointAtLength(length);
    
        // Only add point if it's different from the last one
        if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
            points.push({ x: point.x, y: point.y });
            lastPoint = point;
        }
    
        length += sampleLength;
    }
    
    // Ensure we get the last point
    const finalPoint = commander.getPointAtLength(totalLength);
    if (lastPoint && (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)) {
        points.push({ x: finalPoint.x, y: finalPoint.y });
    }
    
    return points;
    }

function calculatePosition(
value: number | string | undefined,
containerSize: number,
elementSize: number
) {
if (typeof value === "string" \&\& value.endsWith("%")) {
const percentage = parseFloat(value) / 100;
return containerSize * percentage;
}
return typeof value === "number"
? value
: elementSize - containerSize + elementSize / 2;
}

type GravityProps = {
children: ReactNode
debug?: boolean
gravity?: { x: number; y: number }
resetOnResize?: boolean
grabCursor?: boolean
addTopWall?: boolean
autoStart?: boolean
className?: string
}

type PhysicsBody = {
element: HTMLElement
body: Matter.Body
props: MatterBodyProps
}

type MatterBodyProps = {
children: ReactNode
matterBodyOptions?: Matter.IBodyDefinition
isDraggable?: boolean
bodyType?: "rectangle" | "circle" | "svg"
sampleLength?: number
x?: number | string
y?: number | string
angle?: number
className?: string
}

export type GravityRef = {
start: () => void
stop: () => void
reset: () => void
}

const GravityContext = createContext<{
registerElement: (
id: string,
element: HTMLElement,
props: MatterBodyProps
) => void
unregisterElement: (id: string) => void
} | null>(null)

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
sampleLength = 15,
x = 0,
y = 0,
angle = 0,
...props
}: MatterBodyProps) => {
const elementRef = useRef<HTMLDivElement>(null)
const idRef = useRef(Math.random().toString(36).substring(7))
const context = useContext(GravityContext)

useEffect(() => {
if (!elementRef.current || !context) return
context.registerElement(idRef.current, elementRef.current, {
children,
matterBodyOptions,
bodyType,
sampleLength,
isDraggable,
x,
y,
angle,
...props,
})

    return () => context.unregisterElement(idRef.current)
    }, [props, children, matterBodyOptions, isDraggable])

return (
<div
ref={elementRef}
className={cn(
"absolute",
className,
isDraggable \&\& "pointer-events-none"
)}
>
{children}
</div>
)
}

const Gravity = forwardRef<GravityRef, GravityProps>(
(
{
children,
debug = false,
gravity = { x: 0, y: 1 },
grabCursor = true,
resetOnResize = true,
addTopWall = true,
autoStart = true,
className,
...props
},
ref
) => {
const canvas = useRef<HTMLDivElement>(null)
const engine = useRef(Engine.create())
const render = useRef<Render>()
const runner = useRef<Runner>()
const bodiesMap = useRef(new Map<string, PhysicsBody>())
const frameId = useRef<number>()
const mouseConstraint = useRef<Matter.MouseConstraint>()
const mouseDown = useRef(false)
const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    const isRunning = useRef(false)
    
    // Register Matter.js body in the physics world
    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return
        const width = element.offsetWidth
        const height = element.offsetHeight
        const canvasRect = canvas.current!.getBoundingClientRect()
    
        const angle = (props.angle || 0) * (Math.PI / 180)
    
        const x = calculatePosition(props.x, canvasRect.width, width)
        const y = calculatePosition(props.y, canvasRect.height, height)
    
        let body
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2
          body = Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else if (props.bodyType === "svg") {
          const paths = element.querySelectorAll("path")
          const vertexSets: Matter.Vector[][] = []
    
          paths.forEach((path) => {
            const d = path.getAttribute("d")
            const p = parsePathToVertices(d!, props.sampleLength)
            vertexSets.push(p)
          })
    
          body = Bodies.fromVertices(x, y, vertexSets, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle: angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        }
    
        if (body) {
          World.add(engine.current.world, [body])
          bodiesMap.current.set(id, { element, body, props })
        }
      },
      [debug]
    )
    
    // Unregister Matter.js body from the physics world
    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id)
      if (body) {
        World.remove(engine.current.world, body.body)
        bodiesMap.current.delete(id)
      }
    }, [])
    
    // Keep react elements in sync with the physics world
    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position
        const rotation = body.angle * (180 / Math.PI)
    
        element.style.transform = `translate(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px) rotate(${rotation}deg)`
      })
    
      frameId.current = requestAnimationFrame(updateElements)
    }, [])
    
    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return
    
      const height = canvas.current.offsetHeight
      const width = canvas.current.offsetWidth
    
      Common.setDecomp(require("poly-decomp"))
    
      engine.current.gravity.x = gravity.x
      engine.current.gravity.y = gravity.y
    
      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
        },
      })
    
      const mouse = Mouse.create(render.current.canvas)
      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: debug,
          },
        },
      })
    
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
      ]
    
      const topWall = addTopWall
        ? Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: {
              visible: debug,
            },
          })
        : null
    
      if (topWall) {
        walls.push(topWall)
      }
    
      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0
    
      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", (event) => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default"
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab"
            }
          }
        })
    
        canvas.current.addEventListener("mousedown", (event) => {
          mouseDown.current = true
    
          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grabbing"
            } else {
              canvas.current.style.cursor = "default"
            }
          }
        })
        canvas.current.addEventListener("mouseup", (event) => {
          mouseDown.current = false
    
          if (canvas.current) {
            if (touchingMouse()) {
              canvas.current.style.cursor = "grab"
            } else {
              canvas.current.style.cursor = "default"
            }
          }
        })
      }
    
      World.add(engine.current.world, [mouseConstraint.current, ...walls])
    
      render.current.mouse = mouse
    
      runner.current = Runner.create()
      Render.run(render.current)
      updateElements()
      runner.current.enabled = false
    
      if (autoStart) {
        runner.current.enabled = true
        startEngine()
      }
    }, [updateElements, debug, autoStart])
    
    // Clear the Matter.js world
    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
    
      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current)
      }
    
      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse)
        Render.stop(render.current)
        render.current.canvas.remove()
      }
    
      if (runner.current) {
        Runner.stop(runner.current)
      }
    
      if (engine.current) {
        World.clear(engine.current.world, false)
        Engine.clear(engine.current)
      }
    
      bodiesMap.current.clear()
    }, [])
    
    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return
    
      const newWidth = canvas.current.offsetWidth
      const newHeight = canvas.current.offsetHeight
    
      setCanvasSize({ width: newWidth, height: newHeight })
    
      // Clear and reinitialize
      clearRenderer()
      initializeRenderer()
    }, [clearRenderer, initializeRenderer, resetOnResize])
    
    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true
    
        Runner.run(runner.current, engine.current)
      }
      if (render.current) {
        Render.run(render.current)
      }
      frameId.current = requestAnimationFrame(updateElements)
      isRunning.current = true
    }, [updateElements, canvasSize])
    
    const stopEngine = useCallback(() => {
      if (!isRunning.current) return
    
      if (runner.current) {
        Runner.stop(runner.current)
      }
      if (render.current) {
        Render.stop(render.current)
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      isRunning.current = false
    }, [])
    
    const reset = useCallback(() => {
      stopEngine()
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0
    
        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        )
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        )
        body.position.x = x
        body.position.y = y
      })
      updateElements()
      handleResize()
    }, [])
    
    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine]
    )
    
    useEffect(() => {
      if (!resetOnResize) return
    
      const debouncedResize = debounce(handleResize, 500)
      window.addEventListener("resize", debouncedResize)
    
      return () => {
        window.removeEventListener("resize", debouncedResize)
        debouncedResize.cancel()
      }
    }, [handleResize, resetOnResize])
    
    useEffect(() => {
      initializeRenderer()
      return clearRenderer
    }, [initializeRenderer, clearRenderer])
    
    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(className, "absolute top-0 left-0 w-full h-full")}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    )
    }
)

Gravity.displayName = "Gravity"
export { Gravity, MatterBody }

      </Gravity>
    </div>
    );
}

export { Preview };
, . echale un ojo y ayudame a hacer un research de documentacion actual y tips de desarrolladores front experimentados que hayan implementado ese efecto anteriormente. Busca documentacion en ingles y dame una. guia super completa para implementarlo correctamente, con documentacion anadida

Este tipo de efecto de "componentes flotantes con física interactiva", usando Matter.js integrado en React, es avanzado pero muy popular entre desarrolladores frontend que buscan agregar interactividad o “serious play” en interfaces modernas. Aquí tienes una guía super completa, elaborada con base en documentación y experiencias recientes de expertos, que te ayudará a implementar este sistema correctamente y optimizarlo.

### Documentación clave y fuentes

- Documentación oficial Matter.js: https://github.com/liabru/matter-js/wiki/Tutorials [^1]
- Ejemplo práctico y discusión sobre React + Matter.js: https://paulie.dev/posts/2020/08/react-hooks-and-matter-js/ [^2]
- Implementación SVG → cuerpo físico: https://www.fancycomponents.dev/docs/components/physics/gravity [^3]
- YouTube demo responsive SVG bodies: https://www.youtube.com/watch?v=hZkah1Y85Oc [^4]
- Uso y límites de fromVertices con SVG en Matter.js: https://brm.io/matter-js/docs/classes/Svg.html [^5]
- Experiencias con frustraciones y soluciones SVG (forces, collisions): https://stackoverflow.com/questions/78443651/in-matter-js-using-svg-objects-created-fromvertices-i-cant-applyforce-or-s [^6]
- Tips generales y performance: https://dev.to/alisamir/frontend-performance-optimization-a-comprehensive-guide-2bfk [^7]

***

## Guía avanzada para integrar Matter.js con React

### 1. Setup Inicial

- Instala Matter.js y cualquier polyfill necesario (ej. `poly-decomp` para SVGs decompuestos). Usualmente basta con:

```bash
npm install matter-js poly-decomp svg-path-commander
```

- Estructura tus componentes React con contextos para registrar cuerpos físicos, permitiendo flexibilidad en la children-prop. Usa refs (`useRef`) para manipular el canvas y los motores de física. Ver ejemplo de Paul Scanlon [^2].


### 2. Renderizar cuerpos físicos y sincronizar DOM

- Asocia cada elemento visible con un cuerpo Matter.js:
    - Rectángulos y círculos: directas con `Bodies.rectangle` o `Bodies.circle`.
    - SVGs personalizados: extrae la path/vertices y utiliza `Bodies.fromVertices`. Apóyate en `svg-path-commander` para simplificar paths y samplear puntos. La calidad depende de la simplicidad del path—evita SVGs con muchos comandos, curvas complicadas o agujeros [^3][^5][^4][^6].
- Sincroniza la posición/rotación de cada cuerpo físico con el DOM usando transformaciones CSS en cada frame (`requestAnimationFrame`), como en tu código.


### 3. Drag \& Drop y mouse constraints

- Usa `Matter.MouseConstraint` para que los cuerpos se arrastren con el mouse/touch. Ajusta el stiffness y render para una experiencia natural.
- Para cuerpos “solo visuales”, puedes usar overlays HTML/svg que se mueven según el estado físico—esto es recomendable para SVGs muy complejos.
- Proporciona feedback visual (“grab”, “grabbing”) ajustando el cursor, como muestras en tu código.


### 4. Responsividad y reactividad

- Adapta el canvas y los límites del mundo físico cuando la ventana cambia de tamaño. Borra y recalcula cuerpos físicos en estos eventos para evitar glitches [^2][^4].
- Recomendada la actualización del estado de la física y del canvas en listeners de resize, con debounce.


### 5. Performance y optimización

- Mantén los SVGs lo más simples posible. Entre más vértices, más costoso el cálculo [^3]. Usa `sampleLength` para ajustar precisión vs. velocidad.
- Activa/desactiva el runner y la renderización de Matter.js cuando la simulación esté fuera de pantalla.
- Evita renderizar wireframes o debug visuals en producción.
- Aplica técnicas de optimization general de frontend como lazy loading y code splitting para los componentes con física [^7].


### 6. Debug y control avanzado

- Utiliza el prop `debug` para visualizar cuerpos físicos. Es vital cuando estás ajustando el path de SVG y la correspondencia física.
- Si cuerpos SVG no responden bien a fuerzas o colisiones, intenta simplificar el path o cambiar el método de sampling [^6][^3].
- Consulta constantemente la wiki oficial y ejemplos recientes: https://github.com/liabru/matter-js/wiki/Tutorials [^1].

***

### Documentación adicional y guías recomendadas

- Demo interactiva con SVGs y textos: [^4]
- Documentación del módulo SVG de Matter.js: [^5]
- Performance tuning: [^7][^8]
- Experiencias reales de devs: [^2][^6]
- Documentación sobre drag \& drop y DnD: [^9][^10][^11]
- Guía oficial Fancy Components: [^3]

***

## Tips finales de developers experimentados

- Testea con SVGs pequeños y simples antes de pasar a objetos complejos.
- Usa el debug para visualizar hitboxes reales vs. lo que ves en pantalla.
- Aplica reset automático al canvas/engine tras cambios grandes de layout para evitar “cuerpos huérfanos” y errores visuales.
- Revisa el ejemplo de integración con React hooks actualizados [^2].
- Para simulaciones más realistas (ejemplo: rebote, fricción), ajusta los valores de `friction`, `restitution`, y `density` con base en lo que esperas del comportamiento físico.
- Si tienes cuerpos que se comportan “raro”, revisa especialmente la generación de vertices del SVG.
- Mantén la lógica de Matter.js encapsulada y desacoplada del render (React) para facilitar debugging y performance.

***

### Recursos esenciales para continuar

- Matter.js wiki/tutorials y guías de video [^1][^4]
- Ejemplo gravity de Fancy Components: [^3]
- Experiencias y frustraciones con SVG: [^6]
- Guide en video sobre responsive bodies: [^4]

Esta guía está pensada para cubrir los retos más comunes y los mejores trucos usados por desarrolladores frontend al integrar física avanzada en componentes React, con links clave y comentarios de la comunidad actual [^3][^2][^4][^6][^7][^1].
<span style="display:none">[^12][^13][^14][^15][^16][^17][^18][^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29][^30][^31][^32][^33][^34][^35][^36][^37][^38][^39][^40]</span>

<div align="center">⁂</div>

[^1]: https://github.com/liabru/matter-js/wiki/Tutorials

[^2]: https://paulie.dev/posts/2020/08/react-hooks-and-matter-js/

[^3]: https://www.fancycomponents.dev/docs/components/physics/gravity

[^4]: https://www.youtube.com/watch?v=hZkah1Y85Oc

[^5]: https://brm.io/matter-js/docs/classes/Svg.html

[^6]: https://stackoverflow.com/questions/78443651/in-matter-js-using-svg-objects-created-fromvertices-i-cant-applyforce-or-s

[^7]: https://dev.to/alisamir/frontend-performance-optimization-a-comprehensive-guide-2bfk

[^8]: https://www.linkedin.com/posts/christopher-tseng_frontend-performance-optimization-a-guide-activity-7376767464388472832-zMyn

[^9]: https://www.windmill.dev/blog/react-draggable-component

[^10]: https://refine.dev/blog/react-draggable-components-with-react-dnd/

[^11]: https://www.robinwieruch.de/react-drag-and-drop/

[^12]: https://rgsa.openaccesspublications.org/rgsa/article/view/4201

[^13]: https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECOOP.2020.12

[^14]: https://www.e3s-conferences.org/10.1051/e3sconf/202457601001

[^15]: https://onepetro.org/speapcc/proceedings/25APCC/788167

[^16]: https://saemobilus.sae.org/papers/enhanced-impeller-blade-design-water-coolant-pump-ic-engines-2024-26-0034

[^17]: https://iopscience.iop.org/article/10.1088/1742-6596/2523/1/012010

[^18]: https://ieeexplore.ieee.org/document/10126305/

[^19]: https://www.ssrn.com/abstract=3975665

[^20]: https://www.semanticscholar.org/paper/b0ce65e04b1583f6e37536a828cf6799884ca43c

[^21]: https://www.semanticscholar.org/paper/ef56cee7fda89184c1da4af7ecd3d960ee9c75a7

[^22]: http://arxiv.org/pdf/2403.15382.pdf

[^23]: https://arxiv.org/html/2410.12696v2

[^24]: https://arxiv.org/html/2409.08857v2

[^25]: https://arxiv.org/html/2504.03884v1

[^26]: https://arxiv.org/html/2403.07420v2

[^27]: http://arxiv.org/pdf/2305.10973.pdf

[^28]: https://dl.acm.org/doi/pdf/10.1145/3588432.3591500

[^29]: https://arxiv.org/pdf/0912.2706.pdf

[^30]: https://arxiv.org/pdf/2312.05360.pdf

[^31]: http://arxiv.org/pdf/2404.13144.pdf

[^32]: https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable

[^33]: https://www.reddit.com/r/reactjs/comments/13jj4r2/what_is_the_preferable_way_to_do_a_smooth_element/

[^34]: https://dev.to/franklin030601/creando-un-app-que-usa-drag-and-drop-con-react-sin-librerias--gm3

[^35]: https://github.com/bberak/react-native-game-engine/issues/35

[^36]: https://expo.dev/blog/build-2d-game-style-physics-with-matter-js-and-react-native-skia

[^37]: https://www.freecodecamp.org/news/the-front-end-performance-optimization-handbook/

[^38]: https://gsap.com/community/forums/topic/36845-draggable-with-physics-and-throw-props-inertia-collision-mimic-of-matterjs/

[^39]: https://github.com/project-chip/matter.js/

[^40]: https://frontendlead.com/system-design/performace-frontend-system-design

