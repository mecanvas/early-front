import { useCallback, useState } from 'react';

interface ProgressProps {
  progress?: number;
}

export const useProgress = () => {
  const [progressPercentage, setProgressPercentage] = useState(0);

  const getProgressGage = useCallback((data: ProgressEvent) => {
    const percentage = Math.round((100 * data.loaded) / data.total);
    setProgressPercentage(percentage);
  }, []);

  const ProgressBar = ({ progress }: ProgressProps) => {
    return <div>{!progress ? progressPercentage : progress}</div>;
  };

  return { ProgressBar, getProgressGage, progressPercentage };
};
