import React, { lazy, Suspense } from 'react';

// Dynamic imports for better code splitting
const iconComponents = {
  zap: lazy(() => import('lucide-react').then(module => ({ default: module.Zap }))),
  flame: lazy(() => import('lucide-react').then(module => ({ default: module.Flame }))),
  shield: lazy(() => import('lucide-react').then(module => ({ default: module.Shield }))),
  bot: lazy(() => import('lucide-react').then(module => ({ default: module.Bot }))),
  'trending-up': lazy(() => import('lucide-react').then(module => ({ default: module.TrendingUp }))),
  'dollar-sign': lazy(() => import('lucide-react').then(module => ({ default: module.DollarSign }))),
  check: lazy(() => import('lucide-react').then(module => ({ default: module.Check }))),
  github: lazy(() => import('lucide-react').then(module => ({ default: module.Github }))),
  mail: lazy(() => import('lucide-react').then(module => ({ default: module.Mail }))),
  'external-link': lazy(() => import('lucide-react').then(module => ({ default: module.ExternalLink }))),
  user: lazy(() => import('lucide-react').then(module => ({ default: module.User }))),
  calendar: lazy(() => import('lucide-react').then(module => ({ default: module.Calendar }))),
  percent: lazy(() => import('lucide-react').then(module => ({ default: module.Percent }))),
  clock: lazy(() => import('lucide-react').then(module => ({ default: module.Clock }))),
};

interface LucideIconProps {
  name: string;
  size?: number | string;
  className?: string;
  color?: string;
}

export function LucideIcon({ name, size = 24, className = '', color }: LucideIconProps) {
  const IconComponent = iconComponents[name as keyof typeof iconComponents];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconComponents`);
    return null;
  }

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <IconComponent
        size={size}
        className={className}
        color={color}
      />
    </Suspense>
  );
}