import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square } from 'lucide-react';

export default function StepTimer({ initialMinutes }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isDone = timeLeft === 0;

  return (
    <div className={`flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
      isDone ? 'bg-green-50 text-green-700 border-green-200' 
      : isRunning ? 'bg-orange-50 text-orange-700 border-orange-200' 
      : 'bg-slate-100 text-slate-600 border-transparent'
    }`}>
      <Clock size={14} className={isDone ? 'text-green-500' : isRunning ? 'text-orange-500' : 'text-slate-400'} />
      <span className="w-12 text-center tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      
      <div className="flex items-center border-l pl-2 space-x-1 border-current opacity-60">
        <button 
          onClick={toggleTimer}
          disabled={isDone}
          className="p-1 hover:bg-black/5 rounded disabled:opacity-50"
        >
          {isRunning ? <Pause size={14} /> : <Play size={14} />}
        </button>
        {(timeLeft < initialMinutes * 60) && (
          <button 
            onClick={resetTimer}
            className="p-1 hover:bg-black/5 rounded"
          >
            <Square size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
