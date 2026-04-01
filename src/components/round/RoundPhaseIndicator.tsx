import { Stepper, Step, StepLabel } from '@mui/material';
import { RoundStatus } from '../../types/round.types';

const STEPS = [
  { label: 'Couleur', statuses: [RoundStatus.COLOR] },
  { label: 'Cépage', statuses: [RoundStatus.GRAPE] },
  { label: 'Association', statuses: [RoundStatus.MATCHING] },
  { label: 'Résultats', statuses: [RoundStatus.SCORING, RoundStatus.DONE] },
];

interface RoundPhaseIndicatorProps {
  status: RoundStatus;
}

export default function RoundPhaseIndicator({ status }: RoundPhaseIndicatorProps) {
  const activeIndex = STEPS.findIndex((s) => s.statuses.includes(status));

  return (
    <Stepper
      activeStep={activeIndex === -1 ? 0 : activeIndex}
      alternativeLabel
      sx={{
        '& .MuiStepIcon-root.Mui-active': { color: 'secondary.main' },
        '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
      }}
    >
      {STEPS.map((step) => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
