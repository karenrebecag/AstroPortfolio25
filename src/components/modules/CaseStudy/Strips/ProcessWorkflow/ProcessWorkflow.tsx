'use client';
import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface WorkflowCardProps {
  step: number;
  description: string;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ step, description }) => {
  const cardStyle: React.CSSProperties = {
    width: '80vw',
    minWidth: '500px',
    height: '500px',
    padding: '50px 80px',
    background: '#FBFBFB',
    borderTopLeftRadius: '100px',
    borderTopRightRadius: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '10px',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const stepStyle: React.CSSProperties = {
    fontFamily: 'Median, serif',
    fontSize: '48px',
    lineHeight: '50px',
    color: '#1F1F1F',
    transition: 'color 0.3s',
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'Inter Tight, sans-serif',
    fontSize: '18px',
    color: '#1F1F1F',
    transition: 'color 0.3s',
  };

  return (
    <div style={cardStyle} className="workflow-card">
      <style>{`
        .workflow-card:hover {
          background: black;
          color: white;
        }
        .workflow-card:hover .step-text,
        .workflow-card:hover .description-text {
          color: white;
        }
      `}</style>
      <div style={stepStyle} className="step-text">Step {step}</div>
      <div style={descriptionStyle} className="description-text">{description}</div>
    </div>
  );
};

export interface WorkflowStep {
  step: number;
  description: string;
}

export interface ProcessWorkflowProps {
  steps: WorkflowStep[];
}

export const ProcessWorkflow: React.FC<ProcessWorkflowProps> = ({ steps }) => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(steps.length - 1) * 85}vw`]);

  return (
    <section ref={targetRef} className="relative">
      <div className="sticky top-0 flex  pt-[50vh] items-end overflow-hidden">
        <motion.div style={{ x }} className="flex items-end ">
          {steps.map((step) => (
            <WorkflowCard
              key={step.step}
              step={step.step}
              description={step.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
