import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LighthouseResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

interface SpeedlifyData {
  url: string;
  lighthouse: LighthouseResult;
  timestamp: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
}

interface SpeedlifyStatsProps {
  className?: string;
}

export function SpeedlifyStats({ className }: SpeedlifyStatsProps) {
  const [stats, setStats] = useState<SpeedlifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Intentar obtener datos reales de Speedlify API
        const response = await fetch('https://guileless-douhua-b2ff53.netlify.app/api/karen-portfolio.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch from Speedlify API');
        }
        
        const data = await response.json();
        
        // Transformar datos de Speedlify al formato esperado
        const speedlifyData: SpeedlifyData = {
          url: data.url,
          lighthouse: {
            performance: data.lighthouse.performance || 0,
            accessibility: data.lighthouse.accessibility || 0,
            bestPractices: data.lighthouse.bestPractices || 0,
            seo: data.lighthouse.seo || 0,
            pwa: data.lighthouse.pwa || 0
          },
          timestamp: data.timestamp,
          firstContentfulPaint: data.firstContentfulPaint || 0,
          largestContentfulPaint: data.largestContentfulPaint || 0,
          cumulativeLayoutShift: data.cumulativeLayoutShift || 0,
          totalBlockingTime: data.totalBlockingTime || 0,
          speedIndex: data.speedIndex || 0
        };
        
        setStats(speedlifyData);
      } catch (err) {
        console.error('Error fetching Speedlify stats:', err);
        
        // Fallback a datos mock si la API falla
        const mockData: SpeedlifyData = {
          url: "https://www.karenortiz.space/",
          lighthouse: {
            performance: 95,
            accessibility: 98,
            bestPractices: 92,
            seo: 100,
            pwa: 85
          },
          timestamp: Date.now(),
          firstContentfulPaint: 1.2,
          largestContentfulPaint: 2.1,
          cumulativeLayoutShift: 0.05,
          totalBlockingTime: 150,
          speedIndex: 1.8
        };
        
        setStats(mockData);
        setError('Using cached performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e'; // Green
    if (score >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-white/70 text-sm font-primary">Loading performance stats...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`text-white/50 text-sm font-primary ${className || ''}`}>
        Performance stats unavailable
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-wrap items-center gap-4 ${className || ''}`}
    >
      {/* Performance Score */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.performance),
            color: '#000'
          }}
        >
          {getScoreGrade(stats.lighthouse.performance)}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium font-primary">Performance</span>
          <span className="text-white/70 text-xs font-primary">{stats.lighthouse.performance}/100</span>
        </div>
      </div>

      {/* Accessibility Score */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.accessibility),
            color: '#000'
          }}
        >
          {getScoreGrade(stats.lighthouse.accessibility)}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium font-primary">Accessibility</span>
          <span className="text-white/70 text-xs font-primary">{stats.lighthouse.accessibility}/100</span>
        </div>
      </div>

      {/* Best Practices Score */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.bestPractices),
            color: '#000'
          }}
        >
          {getScoreGrade(stats.lighthouse.bestPractices)}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium font-primary">Best Practices</span>
          <span className="text-white/70 text-xs font-primary">{stats.lighthouse.bestPractices}/100</span>
        </div>
      </div>

      {/* SEO Score */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.seo),
            color: '#000'
          }}
        >
          {getScoreGrade(stats.lighthouse.seo)}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium font-primary">SEO</span>
          <span className="text-white/70 text-xs font-primary">{stats.lighthouse.seo}/100</span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
        <div className="flex flex-col items-center">
          <span className="text-white text-xs font-primary">LCP</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.largestContentfulPaint <= 2.5 ? '#22c55e' : '#f59e0b' }}
          >
            {stats.largestContentfulPaint}s
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white text-xs font-primary">FCP</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.firstContentfulPaint <= 1.8 ? '#22c55e' : '#f59e0b' }}
          >
            {stats.firstContentfulPaint}s
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white text-xs font-primary">CLS</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.cumulativeLayoutShift <= 0.1 ? '#22c55e' : '#f59e0b' }}
          >
            {stats.cumulativeLayoutShift}
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-1 ml-auto">
        <span className="text-white/50 text-xs font-primary">
          Updated: {new Date(stats.timestamp).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
