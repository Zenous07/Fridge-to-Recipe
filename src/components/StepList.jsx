import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, MessageSquare } from 'lucide-react';

export default function StepList({ instructions }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const progress = Math.round((completedSteps.size / instructions.length) * 100) || 0;

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
          <span>Progress</span>
          <span className="text-orange-600 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {instructions.map((step) => {
          const isCompleted = completedSteps.has(step.stepNumber);
          
          return (
            <div 
              key={step.stepNumber}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 ${
                isCompleted 
                  ? 'bg-slate-50 border-transparent opacity-60' 
                  : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'
              }`}
            >
              <button 
                onClick={() => toggleStep(step.stepNumber)}
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
        })}
      </div>
    </div>
  );
}
