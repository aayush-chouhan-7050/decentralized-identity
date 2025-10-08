// src/components/ui/StepIndicator.jsx
import { CheckCircle } from 'lucide-react';

export const StepIndicator = ({ step, label, isActive, isCompleted }) => (
  <div className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
    <div className="step-circle">{isCompleted ? <CheckCircle size={20} /> : step}</div>
    <span className="step-label">{label}</span>
  </div>
);