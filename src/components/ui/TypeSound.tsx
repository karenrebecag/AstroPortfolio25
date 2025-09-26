import { useEffect, useRef } from 'react';

interface TypeSoundProps {
  volume?: number;
}

export default function TypeSound({ volume = 0.15 }: TypeSoundProps) {
  const typeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar el audio
    const initTypeAudio = () => {
      try {
        typeAudioRef.current = new Audio('https://pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev/Type.mp3');
        typeAudioRef.current.volume = volume;
        typeAudioRef.current.preload = 'auto';
      } catch (error) {
        console.warn('No se pudo cargar el sonido de typing:', error);
      }
    };

    // Función para reproducir el sonido de typing
    const playTypeSound = () => {
      if (typeAudioRef.current) {
        try {
          typeAudioRef.current.currentTime = 0;
          typeAudioRef.current.play().catch(error => {
            console.warn('No se pudo reproducir el sonido de typing:', error);
          });
        } catch (error) {
          console.warn('Error al reproducir sonido de typing:', error);
        }
      }
    };

    // Handler para eventos de teclado
    const handleKeyPress = (event: KeyboardEvent) => {
      // Solo reproducir sonido para teclas que generan caracteres o acciones de escritura
      if (event.key.length === 1 ||
          event.key === 'Backspace' ||
          event.key === 'Delete' ||
          event.key === 'Enter' ||
          event.key === 'Tab') {

        // Verificar si el elemento activo es un input, textarea o contenteditable
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true'
        )) {
          playTypeSound();
        }
      }
    };

    // Inicializar audio
    initTypeAudio();

    // Agregar event listener global para detectar typing
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (typeAudioRef.current) {
        typeAudioRef.current = null;
      }
    };
  }, [volume]);

  // Este componente no renderiza nada visible
  return null;
}