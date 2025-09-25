'use client';
import { useState, useEffect } from 'react';
import type { JSX, ComponentProps } from 'react';
import { motion } from 'motion/react';

interface Transform {
	x: number;
	y: number;
	rotationZ: number;
}

const transforms: Transform[] = [
	{ x: -0.2, y: -0.15, rotationZ: -8 },
	{ x: -0.05, y: -0.1, rotationZ: -2 },
	{ x: -0.01, y: 0.025, rotationZ: 3 },
	{ x: -0.01, y: -0.025, rotationZ: -2 },
	{ x: -0.025, y: 0.14, rotationZ: 1 },
	{ x: 0, y: -0.025, rotationZ: 2 },
	{ x: 0, y: 0.04, rotationZ: -3 },
	{ x: 0, y: 0.04, rotationZ: -4 },
	{ x: 0, y: -0.16, rotationZ: 2 },
	{ x: 0.025, y: 0.1, rotationZ: 3 },
	{ x: 0, y: -0.04, rotationZ: -2 },
	{ x: 0.05, y: 0.04, rotationZ: 3 },
	{ x: 0.2, y: 0.15, rotationZ: 5 },
];

type TextDisperseBlackProps = ComponentProps<'div'> & {
	/** text should be a string */
	text?: string;
	children?: string | React.ReactNode;
	onHover?: (isActive: boolean) => void;
	style?: React.CSSProperties;
};

export function TextDisperseBlack({
	text,
	children,
	onHover,
	className,
	style,
	...props
}: Omit<TextDisperseBlackProps, 'onMouseEnter' | 'onMouseLeave'>) {
	const [isAnimated, setIsAnimated] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const extractTextFromChildren = (children: any): string => {
		if (typeof children === 'string') {
			return children;
		}
		
		if (Array.isArray(children)) {
			return children.map(child => extractTextFromChildren(child)).join('');
		}
		
		if (children && typeof children === 'object') {
			// Handle React elements or Astro components
			if (children.props && children.props.children) {
				return extractTextFromChildren(children.props.children);
			}
			// Handle text nodes
			if (children.type === 'text' && children.value) {
				return children.value;
			}
		}
		
		return '';
	};

	const splitWord = (word: string) => {
		let chars: JSX.Element[] = [];
		
		word.split('').forEach((char, i) => {
			// Use modulo to cycle through transforms if word is longer than transforms array
			const transformIndex = i % transforms.length;
			// Create a stable key that won't change between server and client
			const stableKey = `char-${i}-${word.length}`;
			chars.push(
				<motion.span
					custom={i}
					variants={{
						open: (i: number) => ({
							x: transforms[transformIndex].x + 'em',
							y: transforms[transformIndex].y + 'em',
							rotateZ: transforms[transformIndex].rotationZ,
							transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
							zIndex: 1,
						}),
						closed: {
							x: 0,
							y: 0,
							rotateZ: 0,
							transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
							zIndex: 0,
						},
					}}
					animate={isClient && isAnimated ? 'open' : 'closed'}
					key={stableKey}
					className="inline-block"
					style={{
						color: 'inherit',
						fontSize: 'inherit',
						fontFamily: 'inherit',
						lineHeight: 'inherit',
						letterSpacing: 'inherit'
					}}
				>
					{char}
				</motion.span>,
			);
		});
		return chars;
	};

	const manageMouseEnter = () => {
		if (!isClient) return;
		onHover?.(true);
		setIsAnimated(true);
	};

	const manageMouseLeave = () => {
		if (!isClient) return;
		onHover?.(false);
		setIsAnimated(false);
	};

	// Use text prop if provided, otherwise extract from children
	const textToUse = text || extractTextFromChildren(children);
	
	return (
		<div
			className={`relative flex cursor-pointer justify-center md:justify-center sm:justify-start ${className || ''}`}
			onMouseEnter={manageMouseEnter}
			onMouseLeave={manageMouseLeave}
			style={{
				color: 'inherit',
				fontSize: 'inherit',
				fontFamily: 'inherit',
				lineHeight: 'inherit',
				letterSpacing: 'inherit',
				overflowX: 'visible',
				overflowY: 'visible',
				transform: 'scale(1)',
				...style
			}}
			suppressHydrationWarning={true}
			{...props}
		>
			{isClient ? splitWord(textToUse) : textToUse}
		</div>
	);
}
