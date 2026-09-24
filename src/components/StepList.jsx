import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, MessageSquare } from 'lucide-react';

export default function StepList({ prepInstructions = [], cookInstructions = [] }) {
  const [completedPrep, setCompletedPrep] = useState(new Set());
  const [completedCook, setCompletedCook] = useState(new Set());

  const togglePrepStep = (stepNumber) => {
    setCompletedPrep(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });
  };

  const toggleCookStep = (stepNumber) => {
    setCompletedCook(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });
  };

  const totalSteps = prepInstructions.length + cookInstructions.length;
  const completedCount = completedPrep.size + completedCook.size;
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const renderStep = (step, isCompleted, toggleFn) => (
    <div 
      key={step.stepNumber}
      className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 ${
        isCompleted 
          ? 'bg-slate-50 border-transparent opacity-60' 
          : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'
      }`}
    >
      <button 
        onClick={() => toggleFn(step.stepNumber)}
        className="mt-0.5 shrink-0 text-slate-400 hover:text-orange-500 focus:outline-none transition-colors"
      >
        {isCompleted ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : (
          <Circle size={24} />
        )}
      </button>
      
      <div className="flex-1">
        <p className={`text-slate-800 leading-relaxed ${isCompleted ? 'line-through text-slate-500' : ''}`}>
          <span className="font-bold text-orange-600 mr-2">Step {step.stepNumber}</span>
          {step.instruction}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          {step.timerMinutes ? (
            <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
              <Clock size={14} className="mr-2 text-slate-400" />
              {step.timerMinutes} mins
            </div>
          ) : <div></div>}
          
          <button className="text-xs font-medium text-slate-400 flex items-center hover:text-orange-600 transition-colors">
            <MessageSquare size={14} className="mr-1" />
            Clarify
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Overall Progress</span>
          <span className="text-orange-600 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-8">
        {prepInstructions.length > 0 && (
          <div>
            <h4 className="text-md font-bold text-slate-700 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
              Preparation
            </h4>
            <div className="space-y-4">
              {prepInstructions.map(step => renderStep(step, completedPrep.has(step.stepNumber), togglePrepStep))}
            </div>
          </div>
        )}

        {cookInstructions.length > 0 && (
          <div>
            <h4 className="text-md font-bold text-slate-700 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
              Cooking Process
            </h4>
            <div className="space-y-4">
              {cookInstructions.map(step => renderStep(step, completedCook.has(step.stepNumber), toggleCookStep))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
