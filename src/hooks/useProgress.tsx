import { useCallback } from 'react';
import { useGlobalState } from '.';

interface ProgressProps {
  progress?: number;
}

export const useProgress = () => {
  const [progressPercentage, setProgressPercentage] = useGlobalState<number>('progressPercentage', 0);

  const getProgressGage = useCallback(
    (data: ProgressEvent) => {
      const percentage = Math.round((100 * data.loaded) / data.total);
      setProgressPercentage(percentage);
    },
    [setProgressPercentage],
  );

  const ProgressBar = ({ progress }: ProgressProps) => {
    return <div>{!progress ? progressPercentage : progress}</div>;
  };

  return { ProgressBar, getProgressGage, progressPercentage };
};
