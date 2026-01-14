import * as chrono from 'chrono-node';
import type { Task } from './db';

const RED_KEYWORDS = ['urgent', 'asap', 'deadline', 'important', 'due', 'immediately'];
const GREEN_KEYWORDS = ['relax', 'gym', 'read', 'walk', 'meditate', 'break', 'lunch'];

export function parseInputToTask(input: string): Omit<Task, 'id'> {
  // 1. NLP Date Extraction
  const parsedDate = chrono.parseDate(input);
  
  // 2. Clean the title (remove the date text)
  const dateResults = chrono.parse(input);
  let title = input;
  if (dateResults.length > 0) {
    title = input.replace(dateResults[0].text, '').trim();
  }

  // 3. Heuristic Priority Assignment
  let lane: Task['lane'] = 'yellow'; // Default
  const lowerInput = input.toLowerCase();
  
  if (RED_KEYWORDS.some(k => lowerInput.includes(k))) {
    lane = 'red';
  } else if (GREEN_KEYWORDS.some(k => lowerInput.includes(k))) {
    lane = 'green';
  } else if (lowerInput.includes('later') || lowerInput.includes('maybe')) {
    lane = 'gray';
  }

  // 4. Smart Defaults: If Urgent (Red) but no date, assume Today.
  const finalDate = parsedDate || (lane === 'red' ? new Date() : null);

  return {
    title,
    lane,
    dueDate: finalDate,
    createdAt: new Date(),
  };
}
// Define the interface to match your Python Pydantic model
export interface AITask {
  title: string;
  category: 'red' | 'yellow' | 'green';
  duration: number;
  reasoning: string;
}

export async function processBrainDump(rawText: string): Promise<AITask[]> {
  try {
   const response = await fetch('/api/process-brain-dump', { 
  method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw_text: rawText }),
    });

    if (!response.ok) {
      throw new Error('AI processing failed');
    }

    const data = await response.json();
    return data.tasks; // Returns the clean array of tasks
  } catch (error) {
    console.error("Error processing brain dump:", error);
    return [];
  }
}