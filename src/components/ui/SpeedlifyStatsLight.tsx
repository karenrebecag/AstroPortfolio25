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

interface SpeedlifyStatsLightProps {
  className?: string;
}

export function SpeedlifyStatsLight({ className }: SpeedlifyStatsLightProps) {
  const [stats, setStats] = useState<SpeedlifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Speedlify API base URL
        const speedlifyBaseUrl = 'https://guileless-douhua-b2ff53.netlify.app';
        const targetUrl = 'https://www.karenortiz.space/'; // URL que queremos monitorear
        
        // Step 1: Get URLs list to find the hash for our target URL
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const urlsResponse = await fetch(`${speedlifyBaseUrl}/api/urls.json`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!urlsResponse.ok) {
          throw new Error(`URLs API HTTP ${urlsResponse.status}: ${urlsResponse.statusText}`);
        }
        
        const urlsData = await urlsResponse.json();
        
        // Find the hash for our target URL
        const urlEntry = urlsData[targetUrl];
        if (!urlEntry || !urlEntry.hash) {
          throw new Error(`No data found for URL: ${targetUrl}`);
        }
        
        // Step 2: Get the actual performance data using the hash
        const dataResponse = await fetch(`${speedlifyBaseUrl}/api/${urlEntry.hash}.json`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!dataResponse.ok) {
          throw new Error(`Data API HTTP ${dataResponse.status}: ${dataResponse.statusText}`);
        }
        
        const data = await dataResponse.json();
        
        // Log real data in development to verify it's working
        if (process.env.NODE_ENV === 'development') {
          console.group('✅ Speedlify Real Data Retrieved (Light Mode)');
          console.log('Hash used:', urlEntry.hash);
          console.log('Timestamp:', new Date(data.timestamp).toLocaleString());
          console.log('Performance scores:', data.lighthouse);
          console.log('Core Web Vitals:', {
            LCP: data.largestContentfulPaint,
            FCP: data.firstContentfulPaint,
            CLS: data.cumulativeLayoutShift
          });
          console.groupEnd();
        }
        
        // Transform Speedlify data to our expected format
        const speedlifyData: SpeedlifyData = {
          url: data.url || targetUrl,
          lighthouse: {
            performance: Math.round((data.lighthouse?.performance || 0) * 100),
            accessibility: Math.round((data.lighthouse?.accessibility || 0) * 100),
            bestPractices: Math.round((data.lighthouse?.bestPractices || 0) * 100),
            seo: Math.round((data.lighthouse?.seo || 0) * 100),
            pwa: Math.round((data.lighthouse?.pwa || 0) * 100)
          },
          timestamp: data.timestamp || Date.now(),
          firstContentfulPaint: parseFloat((data.firstContentfulPaint || 0).toFixed(3)),
          largestContentfulPaint: parseFloat((data.largestContentfulPaint || 0).toFixed(3)),
          cumulativeLayoutShift: parseFloat((data.cumulativeLayoutShift || 0).toFixed(3)),
          totalBlockingTime: data.totalBlockingTime || 0,
          speedIndex: data.speedIndex || 0
        };
        
        setStats(speedlifyData);
        setError(null);
        setIsRealData(true); // Mark as real data
      } catch (err) {
        // Log detailed error information in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🚨 Speedlify API Error (Light Mode)');
          console.error('Error details:', err);
          console.log('Speedlify URL:', 'https://guileless-douhua-b2ff53.netlify.app');
          console.log('Target URL:', 'https://www.karenortiz.space/');
          console.log('Expected API endpoints:');
          console.log('  - URLs: https://guileless-douhua-b2ff53.netlify.app/api/urls.json');
          console.log('  - Data: https://guileless-douhua-b2ff53.netlify.app/api/{hash}.json');
          console.groupEnd();
        }
        
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
          firstContentfulPaint: 1.200,
          largestContentfulPaint: 2.100,
          cumulativeLayoutShift: 0.050,
          totalBlockingTime: 150,
          speedIndex: 1.8
        };
        
        setStats(mockData);
        setError(null); // Don't show error to user, just use fallback data
        setIsRealData(false); // Mark as mock data
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#16a34a'; // Green-600 (darker for light mode)
    if (score >= 50) return '#ea580c'; // Orange-600 (darker for light mode)
    return '#dc2626'; // Red-600 (darker for light mode)
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
        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div>
        <span className="text-gray-600 text-sm font-primary">Loading performance stats...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`text-gray-500 text-sm font-primary ${className || ''}`}>
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
      <div className="flex items-center gap-2" data-cursor-text="How fast the site loads and responds">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.performance),
            color: '#fff'
          }}
        >
          {getScoreGrade(stats.lighthouse.performance)}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium font-primary">Performance</span>
          <span className="text-gray-600 text-xs font-primary">{stats.lighthouse.performance}/100</span>
        </div>
      </div>

      {/* Accessibility Score */}
      <div className="flex items-center gap-2" data-cursor-text="How easy it is for everyone to use this site">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.accessibility),
            color: '#fff'
          }}
        >
          {getScoreGrade(stats.lighthouse.accessibility)}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium font-primary">Accessibility</span>
          <span className="text-gray-600 text-xs font-primary">{stats.lighthouse.accessibility}/100</span>
        </div>
      </div>

      {/* Best Practices Score */}
      <div className="flex items-center gap-2" data-cursor-text="How well the site follows web standards">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.bestPractices),
            color: '#fff'
          }}
        >
          {getScoreGrade(stats.lighthouse.bestPractices)}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium font-primary">Best Practices</span>
          <span className="text-gray-600 text-xs font-primary">{stats.lighthouse.bestPractices}/100</span>
        </div>
      </div>

      {/* SEO Score */}
      <div className="flex items-center gap-2" data-cursor-text="How easy it is to find this site on Google">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: getScoreColor(stats.lighthouse.seo),
            color: '#fff'
          }}
        >
          {getScoreGrade(stats.lighthouse.seo)}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 text-sm font-medium font-primary">SEO</span>
          <span className="text-gray-600 text-xs font-primary">{stats.lighthouse.seo}/100</span>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
        <div className="flex flex-col items-center" data-cursor-text="Time to load main content (lower is better)">
          <span className="text-gray-900 text-xs font-primary">LCP</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.largestContentfulPaint <= 2.5 ? '#16a34a' : '#ea580c' }}
          >
            {stats.largestContentfulPaint}s
          </span>
        </div>
        <div className="flex flex-col items-center" data-cursor-text="Time to show first text or image (lower is better)">
          <span className="text-gray-900 text-xs font-primary">FCP</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.firstContentfulPaint <= 1.8 ? '#16a34a' : '#ea580c' }}
          >
            {stats.firstContentfulPaint}s
          </span>
        </div>
        <div className="flex flex-col items-center" data-cursor-text="How much the page jumps while loading (lower is better)">
          <span className="text-gray-900 text-xs font-primary">CLS</span>
          <span 
            className="text-xs font-bold font-primary"
            style={{ color: stats.cumulativeLayoutShift <= 0.1 ? '#16a34a' : '#ea580c' }}
          >
            {stats.cumulativeLayoutShift}
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 ml-auto">
        {isRealData ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-xs font-primary font-medium">
              Live Data
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-orange-600 text-xs font-primary font-medium">
              Demo Data
            </span>
          </div>
        )}
        <span className="text-gray-500 text-xs font-primary">
          {new Date(stats.timestamp).toLocaleDateString()}
        </span>
        <a
          href="https://github.com/zachleat/speedlify/#deploy-to-netlify"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 text-xs font-primary transition-colors duration-300"
          data-cursor-text="Learn about Speedlify"
        >
          Powered by Speedlify
        </a>
      </div>
    </motion.div>
  );
}
