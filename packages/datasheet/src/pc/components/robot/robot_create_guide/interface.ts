export interface IStepProps {
  goNextStep: () => void;
  isActive: boolean;
  robotId?: string;
  setRobotId: (robotId?: string) => void;
}
