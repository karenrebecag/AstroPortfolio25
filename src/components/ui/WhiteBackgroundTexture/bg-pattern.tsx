import React, { useState, useEffect } from 'react';
import styles from './bg-pattern.module.css';

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
type BGMaskType =
	| 'fade-center'
	| 'fade-edges'
	| 'fade-top'
	| 'fade-bottom'
	| 'fade-left'
	| 'fade-right'
	| 'fade-x'
	| 'fade-y'
	| 'none';

type BGPatternProps = React.ComponentProps<'div'> & {
	variant?: BGVariantType;
	mask?: BGMaskType;
	size?: number;
	fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
	'fade-edges': styles.fadeEdges,
	'fade-center': styles.fadeCenter,
	'fade-top': styles.fadeTop,
	'fade-bottom': styles.fadeBottom,
	'fade-left': styles.fadeLeft,
	'fade-right': styles.fadeRight,
	'fade-x': styles.fadeX,
	'fade-y': styles.fadeY,
	none: styles.none,
};

function getBgImage(variant: BGVariantType, fill: string, size: number) {
	switch (variant) {
		case 'dots':
			return `radial-gradient(${fill} 1px, transparent 1px)`;
		case 'grid':
			return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
		case 'diagonal-stripes':
			return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
		case 'horizontal-lines':
			return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
		case 'vertical-lines':
			return `linear-gradient(to right, transparent, ${fill} 0.5px, transparent)`;
		case 'checkerboard':
			return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
		default:
			return undefined;
	}
}

// Custom hook para detectar dark mode
const useDarkMode = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Función para verificar dark mode
		const checkDarkMode = () => {
			const hasDarkClass = document.documentElement.classList.contains('dark-mode') || 
							   document.body.classList.contains('dark-mode');
			setIsDark(hasDarkClass);
		};

		// Verificar al montar
		checkDarkMode();

		// Observer para cambios en las clases
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, { 
			attributes: true, 
			attributeFilter: ['class'] 
		});
		observer.observe(document.body, { 
			attributes: true, 
			attributeFilter: ['class'] 
		});

		return () => observer.disconnect();
	}, []);

	return isDark;
};

const BGPattern = ({
	variant = 'vertical-lines',
	mask = 'fade-edges',
	size = 24,
	fill,
	className,
	style,
	...props
}: BGPatternProps) => {
	const isDarkMode = useDarkMode();
	
	// Colores dinámicos basados en el tema
	const dynamicFill = fill || (isDarkMode 
		? 'rgba(255, 255, 255, 0.08)' // Patrón blanco semitransparente en dark mode
		: 'rgba(0, 0, 0, 0.08)'       // Patrón negro semitransparente en light mode
	);
	
	const bgSize = `${size}px ${size}px`;
	const backgroundImage = getBgImage(variant, dynamicFill, size);

	return (
		<div
			className={`${styles.bgPattern} ${maskClasses[mask]} ${className || ''}`}
			style={{
				backgroundImage,
				backgroundSize: bgSize,
				...style,
			}}
			{...props}
		/>
	);
};

BGPattern.displayName = 'BGPattern';
export { BGPattern };