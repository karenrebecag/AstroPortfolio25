import React from 'react';
import ErrorBoundary from '../../Marquees/ErrorBoundary';
import RingSphereBackground from '../../../three/RingSphereBackground';
import TechMarqueesIsland from './TechMarqueesIsland';

interface MyStackIslandProps {
  className?: string;
}

const MyStackIsland: React.FC<MyStackIslandProps> = ({ className = '' }) => {
  return (
    <ErrorBoundary>
      <div className={`my-stack-island ${className}`}>
        {/* Área del contenido principal */}
        <div className="stack-content-area">
          {/* Contenedor para el modelo 3D RingSphere */}
          <div className="model-3d-container">
            {/* RingSphere 3D Background con mismas optimizaciones que GemBackground */}
            <RingSphereBackground className="ringsphere-background" />
          </div>

          {/* Marquees en la parte inferior con limitación de ancho */}
          <div className="tech-marquees-container">
            <div className="tech-marquees-wrapper-limited">
              <div className="tech-marquees-wrapper">
                <TechMarqueesIsland />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MyStackIsland;
