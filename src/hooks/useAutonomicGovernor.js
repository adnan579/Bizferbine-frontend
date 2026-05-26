import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export const useAutonomicGovernor = () => {
  const [isCompromised, setIsCompromised] = useState(false);
  const [stabilityScore, setStabilityScore] = useState(100);
  const location = useLocation();

  // 1. Passive Telemetry: Track UI Context-Switching Load
  useEffect(() => {
    const trackContextSwitch = async () => {
      try {
        await apiClient.post('/analytics/track', {
          body: JSON.stringify({ eventType: 'CONTEXT_SWITCH', metadata: { path: location.pathname } })
        });
      } catch (err) { /* Silent fail for telemetry */ }
    };
    trackContextSwitch();
  }, [location.pathname]);

  // 2. Active Telemetry: Evaluate Clinical Stability
  useEffect(() => {
    const checkStability = async () => {
      try {
        const res = await apiClient.get('/wellness/logs');
        if (res.ok) {
          const logs = await res.json();
          if (logs.length > 0) {
            // Check if the most recent log was today
            const latestLog = logs[0];
            const logDate = new Date(latestLog.createdAt);
            const today = new Date();
            if (logDate.toDateString() === today.toDateString()) {
              const score = Number(latestLog.mood);
              if (!isNaN(score)) {
                setStabilityScore(score);
                setIsCompromised(score < 40); // 40 is the FDA-aligned critical threshold
              }
            }
          }
        }
      } catch (err) { /* Silent fail */ }
    };
    checkStability();
  }, [location.pathname]); // Re-evaluate on route change

  return { isCompromised, stabilityScore };
};