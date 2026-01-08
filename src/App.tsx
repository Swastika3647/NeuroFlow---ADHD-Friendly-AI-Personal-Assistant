import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task } from './db';
import { parseInputToTask } from './aiScheduler';
import { Trash2, Send, Calendar, GripVertical, Ban, Zap, X, CheckCircle, Clock, RotateCcw, RefreshCw, ArrowRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { DndContext, type DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';

// --- CONFIGURATION ---
const LANE_CONFIG: Record<string, { limit: number; time: string; minutes: number }> = {
  red:    { limit: 3, time: '25-45 min', minutes: 25 },
  yellow: { limit: 2, time: '45-60 min', minutes: 45 },
  green:  { limit: 1, time: 'Anytime',   minutes: 15 },
  gray:   { limit: 999, time: 'Storage', minutes: 0 }
};

// --- COMPONENT: WEEKLY RESET WIZARD ---
const WeeklyReset = ({ tasks, onClose }: { tasks: Task[], onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const activeTasks = tasks.filter(t => t.lane !== 'gray');
  const redTasks = tasks.filter(t => t.lane === 'red');

  const moveTask = (id: number, lane: 'gray' | 'yellow') => {
    db.tasks.update(id, { lane });
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom-10 font-sans">
      {/* Header */}
      <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Weekly Reset Ritual</h1>
          <p className="text-gray-500 text-sm font-medium">10 minutes. Once a week. Clear the noise.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        
        {/* STEP 1: THE PURGE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Step 1: The Purge</h2>
              <p className="text-gray-600">Look at your active lanes. Be honest: <strong>What can move to ⚫ GRAY?</strong></p>
            </div>
            
            <div className="grid gap-3">
              {activeTasks.length === 0 && <p className="text-center text-gray-400 italic py-10">No active tasks! You are clean.</p>}
              {activeTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${task.lane === 'red' ? 'bg-red-100 text-red-700' : task.lane === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {task.lane}
                    </span>
                    <span className="font-medium text-gray-800">{task.title}</span>
                  </div>
                  <button 
                    onClick={() => moveTask(task.id, 'gray')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Move to Gray <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: REALITY CHECK */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-2">Step 2: Reality Check</h2>
              <p className="text-red-600">Look at your 🔴 RED tasks. <strong>What is falsely labeled Urgent but is actually just Important (Yellow)?</strong></p>
            </div>

            <div className="grid gap-3">
              {redTasks.length === 0 && <p className="text-center text-gray-400 italic py-10">No Red tasks found. Good discipline!</p>}
              {redTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-xl shadow-sm">
                  <span className="font-bold text-gray-800">{task.title}</span>
                  <button 
                    onClick={() => moveTask(task.id, 'yellow')}
                    className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ChevronDown size={16} /> Downgrade to Yellow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: CELEBRATION */}
        {step === 3 && (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 py-10">
            <div className="inline-flex p-6 bg-green-100 text-green-600 rounded-full mb-4 ring-8 ring-green-50">
              <CheckCircle size={64} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reset Complete!</h1>
            <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
              "Celebrate completion, not effort."<br/>
              You have cleared the noise. You are ready for the week.
            </p>
            <div className="pt-8">
              <button 
                onClick={onClose}
                className="bg-black text-white text-lg font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95"
              >
                Back to Focus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      {step < 3 && (
        <div className="p-6 border-t bg-white flex justify-end sticky bottom-0">
          <button 
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Next Step <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: FOCUS MODE (TIME CONTAINER) ---
const FocusMode = ({ task, duration, onClose, onComplete, onReschedule }: any) => {
  const [seconds, setSeconds] = useState(duration * 60);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s: number) => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmtTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300 font-sans">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"><X size={20} /> Close</button>
      <div className="max-w-md w-full text-center space-y-8">
        <div className="bg-indigo-500/20 text-indigo-200 px-4 py-2 rounded-full border border-indigo-500/30 inline-block text-sm font-medium animate-pulse">Time Container: {task.lane.toUpperCase()}</div>
        <div><h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">{task.title}</h1><p className="text-gray-400 italic">"No guilt if you stop when the timer ends."</p></div>
        <div className={`text-8xl md:text-9xl font-mono font-thin tabular-nums tracking-tighter ${seconds === 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{fmtTime(seconds)}</div>
        <div className="grid grid-cols-2 gap-4 w-full">
           <button onClick={() => onComplete(task.id)} className="py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><CheckCircle size={20} /> Finished</button>
           <button onClick={() => onReschedule(task.id)} className="py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><RotateCcw size={20} /> Reschedule</button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: DRAGGABLE CARD ---
const TaskCard = ({ task, onStart }: any) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id.toString(), data: { task } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`bg-white p-3.5 rounded-lg shadow-sm border border-gray-100 group hover:shadow-md transition-all touch-none cursor-grab active:cursor-grabbing relative ${isDragging ? 'shadow-xl ring-2 ring-indigo-500 rotate-2' : ''}`}>
      <div className="flex justify-between items-start mb-2"><div className="font-medium text-gray-800 leading-snug pr-6">{task.title}</div><GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 absolute top-3 right-3" /></div>
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2">{task.dueDate && (<div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400"><Calendar size={10} /> {format(task.dueDate, 'MMM d')}</div>)}</div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onPointerDown={(e) => { e.stopPropagation(); onStart(task); }} className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold transition-colors"><Clock size={10} /> START</button>
           <button onPointerDown={(e) => { e.stopPropagation(); db.tasks.delete(task.id); }} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: DROPPABLE LANE ---
const Lane = ({ title, subtitle, color, laneId, tasks, onStartTask }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id: laneId });
  const config = LANE_CONFIG[laneId];
  const isFull = tasks.length >= config.limit;
  const slotsRemaining = config.limit - tasks.length;
  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[280px] p-4 rounded-2xl shadow-sm flex flex-col gap-3 h-full transition-all border-t-4 ${color} ${isOver ? 'ring-2 ring-indigo-400 bg-white/60' : ''} ${isFull && laneId !== 'gray' ? 'bg-opacity-50' : ''}`}>
      <div className="pb-3 border-b border-black/5">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-black text-gray-800 uppercase tracking-wider text-sm">{title}</h2>
          <div className="flex gap-2">
            {laneId !== 'gray' && (<span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500"><Clock size={10} /> {config.time}</span>)}
            {laneId !== 'gray' && (<span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isFull ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-gray-500 border-gray-200'}`}>{tasks.length}/{config.limit}</span>)}
          </div>
        </div>
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {tasks.map((task: any) => <TaskCard key={task.id} task={task} onStart={onStartTask} />)}
        {laneId !== 'gray' && !isFull && Array.from({ length: slotsRemaining }).map((_, i) => (<div key={i} className="h-12 border-2 border-dashed border-gray-300/50 rounded-lg flex items-center justify-center group"><span className="text-gray-300 font-bold text-sm group-hover:text-indigo-400">+ Add Task</span></div>))}
      </div>
    </div>
  );
};

export default function App() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isResetMode, setResetMode] = useState(false); // WEEKLY RESET STATE
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];

  const lanes = {
    red: tasks.filter(t => t.lane === 'red'),
    yellow: tasks.filter(t => t.lane === 'yellow'),
    green: tasks.filter(t => t.lane === 'green'),
    gray: tasks.filter(t => t.lane === 'gray'),
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const newTask = parseInputToTask(input);
      const limit = LANE_CONFIG[newTask.lane].limit;
      const currentCount = lanes[newTask.lane as keyof typeof lanes]?.length || 0;
      if (currentCount >= limit && newTask.lane !== 'gray') {
        setError(`${newTask.lane.toUpperCase()} is full. Finish one first.`);
        return; 
      }
      await db.tasks.add(newTask as Task);
      setInput(''); setError(null);
    } catch (error) { console.error(error); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = parseInt(active.id as string);
    const newLane = over.id as keyof typeof lanes;
    const currentLane = active.data.current?.task.lane;
    if (currentLane === newLane) return; 
    const limit = LANE_CONFIG[newLane].limit;
    if (lanes[newLane].length >= limit && newLane !== 'gray') {
      setError(`${newLane.toUpperCase()} is full!`);
      return; 
    }
    if (taskId) { await db.tasks.update(taskId, { lane: newLane }); setError(null); }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans relative">
        {error && (<div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-top-5"><Ban size={20} className="text-red-400" /><p className="text-sm font-medium">{error}</p><button onClick={() => setError(null)} className="ml-4 opacity-60 hover:opacity-100">×</button></div>)}
        
        {/* OVERLAYS */}
        {activeTask && (<FocusMode task={activeTask} duration={LANE_CONFIG[activeTask.lane].minutes} onClose={() => setActiveTask(null)} onComplete={async (id:number) => { await db.tasks.delete(id); setActiveTask(null); }} onReschedule={async (id:number) => { await db.tasks.update(id, { lane: 'gray' }); setActiveTask(null); }} />)}
        
        {/* WEEKLY RESET WIZARD */}
        {isResetMode && <WeeklyReset tasks={tasks} onClose={() => setResetMode(false)} />}

        <header className="px-8 py-6 bg-white border-b flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div><h1 className="text-2xl font-black text-gray-800 tracking-tight">NeuroFlow</h1><p className="text-xs text-gray-400 font-medium mt-0.5">Time Container System</p></div>
          
          <div className="flex gap-3">
            {/* WEEKLY RESET BUTTON */}
            <button 
              onClick={() => setResetMode(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full font-bold shadow-sm transition-all active:scale-95"
            >
              <RefreshCw size={16} className="text-gray-400" />
              <span>Weekly Reset</span>
            </button>

            {/* ANXIETY RESET BUTTON */}
            <button onClick={() => lanes.red.length > 0 && setActiveTask(lanes.red[0])} disabled={lanes.red.length === 0} className="flex items-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-full font-bold shadow-lg transition-all active:scale-95">
              <Zap size={18} className={lanes.red.length > 0 ? "text-yellow-400 fill-current" : ""} />
              <span>Anxiety Reset</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-8">
          <div className="flex gap-8 h-full min-w-max">
            <Lane laneId="red" title="🔴 RED" subtitle="Urgent. Do first." color="bg-red-50/50 border-red-500" tasks={lanes.red} onStartTask={setActiveTask} />
            <Lane laneId="yellow" title="🟡 YELLOW" subtitle="Important progress." color="bg-amber-50/50 border-amber-400" tasks={lanes.yellow} onStartTask={setActiveTask} />
            <Lane laneId="green" title="🟢 GREEN" subtitle="Restore energy." color="bg-emerald-50/50 border-emerald-500" tasks={lanes.green} onStartTask={setActiveTask} />
            <Lane laneId="gray" title="⚫ GRAY" subtitle="The Parking Lot." color="bg-gray-100 border-gray-400" tasks={lanes.gray} onStartTask={setActiveTask} />
          </div>
        </main>

        <footer className="p-6 bg-white border-t sticky bottom-0 z-20">
          <form onSubmit={handleAddTask} className="relative max-w-2xl mx-auto group">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a task... (e.g., 'Report due tomorrow urgent')" className="w-full pl-6 pr-14 py-4 rounded-full bg-gray-100 focus:bg-white border-2 border-transparent focus:border-indigo-600 outline-none transition-all shadow-sm" />
            <button type="submit" disabled={!input.trim()} className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all"><Send size={18} /></button>
          </form>
        </footer>
      </div>
    </DndContext>
  );
}