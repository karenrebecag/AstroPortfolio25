import React from 'react';
import {
  Zap,
  Flame,
  Shield,
  Bot,
  TrendingUp,
  DollarSign,
  Check,
  Github,
  Mail,
  ExternalLink,
  User,
  Calendar,
  DollarSign as Dollar,
  Percent,
  Clock
} from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number | string;
  className?: string;
  color?: string;
}

const iconMap = {
  'zap': Zap,
  'flame': Flame,
  'shield': Shield,
  'bot': Bot,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  'check': Check,
  'github': Github,
  'mail': Mail,
  'external-link': ExternalLink,
  'user': User,
  'calendar': Calendar,
  'dollar': Dollar,
  'percent': Percent,
  'clock': Clock
};

export function LucideIcon({ name, size = 24, className = '', color }: LucideIconProps) {
  const IconComponent = iconMap[name as keyof typeof iconMap];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={color}
    />
  );
}