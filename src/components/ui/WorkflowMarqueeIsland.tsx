import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Gravity, MatterBody } from './gravity';

// Workflow data array
const workflowData = [
  {
    id: "01",
    title: "Planificación y Setup Inicial",
    number: "01",
    tasks: [
      "Definición del MVP",
      "Diseño de Arquitectura", 
      "Setup del Proyecto"
    ]
  },
  {
    id: "02",
    title: "Desarrollo del Core",
    number: "02",
    tasks: [
      "Autenticación",
      "Gestión de Tareas Básica",
      "Kanban Board",
      "Notificaciones"
    ]
  },
  {
    id: "03",
    title: "Refinamiento y UX",
    number: "03",
    tasks: [
      "Micro-interactions",
      "Modo Offline",
      "Performance Optimization"
    ]
  },
  {
    id: "04",
    title: "Testing y Calidad",
    number: "04",
    tasks: [
      "Testing Automatizado (Jest)",
      "Bug Fixing y Refinamiento"
    ]
  },
  {
    id: "05",
    title: "Pre-Launch",
    number: "05",
    tasks: [
      "Documentación",
      "Beta Testing"
    ]
  },
  {
    id: "06",
    title: "Launch y Post-Launch",
    number: "06",
    tasks: [
      "Deploy a Producción",
      "Monitoreo y Mantenimiento",
      "Iteración Post-Launch"
    ]
  }
];

const WorkflowCard: React.FC<{ workflow: typeof workflowData[0] }> = ({ workflow }) => {
  // Purple, carbon and white color palette
  const taskColors = [
    '#7A2CC8', // Main purple
    '#9D4EDD', // Light purple
    '#6A1B9A', // Dark purple
    '#AB47BC', // Medium purple
    '#2C2C2C', // Carbon dark
    '#404040', // Carbon medium
    '#1A1A1A', // Carbon darkest
    '#FFFFFF'  // White
  ];

  // Font families array
  const fontFamilies = [
    '"Playfair Display", serif',
    'var(--font-display)', // Median
    'var(--font-primary)'  // InterTight
  ];

  // Font sizes array
  const fontSizes = [
    'clamp(10px, 2vw, 12px)',
    'clamp(11px, 1.8vw, 14px)', 
    'clamp(12px, 1.4vw, 16px)',
    'clamp(9px, 1.6vw, 11px)'
  ];

  return (
    <div className="workflow-card">
      <div className="workflow-header">
        <div className="workflow-title">{workflow.title}</div>
        <div className="workflow-number">{workflow.number}</div>
      </div>
      <div className="workflow-content">
        <Gravity 
          gravity={{ x: 0, y: 0.8 }} 
          className="workflow-gravity-container"
          grabCursor={true}
        >
          {workflow.tasks.map((task, index) => (
            <MatterBody
              key={index}
              isDraggable={true}
              matterBodyOptions={{ 
                friction: 0.6, 
                restitution: 0.3,
                frictionAir: 0.02,
                density: 0.002,
                sleepThreshold: Infinity
              }}
              x={`${20 + (index * 15)}%`}
              y={`${10 + (index * 5)}%`}
              angle={Math.random() * 20 - 10}
            >
              <div 
                className="workflow-task-gravity"
                style={{ 
                  backgroundColor: taskColors[index % taskColors.length],
                  color: taskColors[index % taskColors.length] === '#FFFFFF' ? '#2C2C2C' : '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: fontSizes[index % fontSizes.length],
                  fontFamily: fontFamilies[index % fontFamilies.length],
                  fontWeight: taskColors[index % taskColors.length] === '#FFFFFF' ? '600' : '500',
                  whiteSpace: 'nowrap',
                  cursor: 'grab',
                  userSelect: 'none',
                  boxShadow: taskColors[index % taskColors.length] === '#FFFFFF' 
                    ? '0 2px 8px rgba(0,0,0,0.15)' 
                    : '0 2px 8px rgba(122, 44, 200, 0.3)',
                  border: taskColors[index % taskColors.length] === '#FFFFFF' 
                    ? '1px solid #E0E0E0' 
                    : 'none',
                  fontStyle: fontFamilies[index % fontFamilies.length].includes('Playfair') ? 'italic' : 'normal'
                }}
              >
                {task}
              </div>
            </MatterBody>
          ))}
        </Gravity>
      </div>
    </div>
  );
};

const WorkflowMarqueeIsland: React.FC = () => {
  // Duplicate the array for seamless infinite scroll
  const duplicatedWorkflow = [...workflowData, ...workflowData];

  return (
    <ErrorBoundary>
      <div className="workflow-marquee">
        <div className="workflow-set">
          {duplicatedWorkflow.map((workflow, index) => (
            <WorkflowCard 
              key={`${workflow.id}-${index}`} 
              workflow={workflow} 
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WorkflowMarqueeIsland;
