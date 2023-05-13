import { useCallback } from 'react';
import { useGlobalState } from '.';
import { MockProgressEvent } from 'src/utils';

interface ProgressProps {
  progress?: number;
}

export const useProgress = () => {
  const [progressPercentage, setProgressPercentage] = useGlobalState<number>('progressPercentage', 0);

  const getProgressGage = useCallback(
    (data: MockProgressEvent) => {
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
