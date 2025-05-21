import { Injectable } from '@angular/core';
import { Process } from '../models/process';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  private processes: Process[] = [];

  addProcess(process: Process) {
    this.processes.push(process);
  }

  getProcesses(): Process[] {
    return this.processes;
  }

  reset() {
    this.processes = [];
  }

  private cloneAndResetProcesses(): Process[] {
    return this.processes.map(p => ({
      ...p,
      startTime: undefined,
      endTime: 0,
      waitTime: undefined,
      priority: p.priority ?? 0,
    }));
  }

  fcfs(): Process[] {
    const sortedProcesses = this.cloneAndResetProcesses().sort(
      (a, b) => a.arrivalTime - b.arrivalTime
    );

    let currentTime = 0;
    sortedProcesses.forEach(process => {
      if (currentTime < process.arrivalTime) currentTime = process.arrivalTime;

      process.startTime = currentTime;
      process.endTime = process.startTime + process.burstTime;
      process.waitTime = process.startTime - process.arrivalTime;

      currentTime = process.endTime;
    });

    return sortedProcesses;
  }

  sjf(): Process[] {
  const processes = this.cloneAndResetProcesses();
  const n = processes.length;
  const completed = new Array(n).fill(false);
  const result: Process[] = [];
  let time = 0;
  let completedCount = 0;

  while (completedCount < n) {
    let idx = -1;
    let minBurst = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (!completed[i] && processes[i].arrivalTime <= time) {
        if (processes[i].burstTime < minBurst) {
          minBurst = processes[i].burstTime;
          idx = i;
        }
      }
    }

    if (idx === -1) {
      time++;
      continue;
    }

    const proc = processes[idx];
    proc.startTime = time;
    proc.endTime = proc.startTime + proc.burstTime;
    proc.waitTime = proc.startTime - proc.arrivalTime;

    time = proc.endTime;
    completed[idx] = true;
    result.push(proc);
    completedCount++;
  }

  return result;
}


  srtf(): Process[] {
    const processes = this.cloneAndResetProcesses();
    const result: Process[] = [];
    let time = 0;
    let complete = 0;
    const n = processes.length;
    const remainingTimes = processes.map(p => p.burstTime);

    while (complete !== n) {
      let minIndex = -1;
      let shortest = Number.MAX_VALUE;

      for (let i = 0; i < n; i++) {
        if (
          processes[i].arrivalTime <= time &&
          remainingTimes[i] > 0 &&
          remainingTimes[i] < shortest
        ) {
          shortest = remainingTimes[i];
          minIndex = i;
        }
      }

      if (minIndex === -1) {
        time++;
        continue;
      }

      if (processes[minIndex].startTime === undefined) {
        processes[minIndex].startTime = time;
      }

      remainingTimes[minIndex]--;
      time++;

      if (remainingTimes[minIndex] === 0) {
        complete++;
        processes[minIndex].endTime = time;
        processes[minIndex].waitTime =
          processes[minIndex].endTime -
          processes[minIndex].arrivalTime -
          processes[minIndex].burstTime;
        result.push(processes[minIndex]);
      }
    }

    return result;
  }

  roundRobin(quantum: number = 2): Process[] {
    const queue = this.cloneAndResetProcesses();
    const result: Process[] = [];
    const n = queue.length;
    const remaining = queue.map(p => p.burstTime);
    let time = 0;
    let done = 0;

    const readyQueue: number[] = [];
    let arrived = 0;

    while (done < n) {
      while (arrived < n && queue[arrived].arrivalTime <= time) {
        readyQueue.push(arrived);
        arrived++;
      }

      if (readyQueue.length === 0) {
        time++;
        continue;
      }

      const idx = readyQueue.shift()!;
      const execTime = Math.min(quantum, remaining[idx]);

      if (queue[idx].startTime === undefined) queue[idx].startTime = time;

      time += execTime;
      remaining[idx] -= execTime;

      while (arrived < n && queue[arrived].arrivalTime <= time) {
        readyQueue.push(arrived);
        arrived++;
      }

      if (remaining[idx] > 0) {
        readyQueue.push(idx);
      } else {
        queue[idx].endTime = time;
        queue[idx].waitTime =
          queue[idx].endTime - queue[idx].arrivalTime - queue[idx].burstTime;
        result.push(queue[idx]);
        done++;
      }
    }

    return result;
  }

  priorityNonPreemptive(): Process[] {
  const processes = this.cloneAndResetProcesses();
  const n = processes.length;
  const completed = new Array(n).fill(false);
  const result: Process[] = [];
  let time = 0;
  let completedCount = 0;

  while (completedCount < n) {
    let idx = -1;
    let highestPriority = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      if (!completed[i] && processes[i].arrivalTime <= time) {
        const priority = processes[i].priority ?? 0;
        if (priority < highestPriority) {
          highestPriority = priority;
          idx = i;
        }
      }
    }

    if (idx === -1) {
      time++;
      continue;
    }

    const proc = processes[idx];
    proc.startTime = time;
    proc.endTime = proc.startTime + proc.burstTime;
    proc.waitTime = proc.startTime - proc.arrivalTime;

    time = proc.endTime;
    completed[idx] = true;
    result.push(proc);
    completedCount++;
  }

  return result;
}


  priorityPreemptive(): Process[] {
    const processes = this.cloneAndResetProcesses();
    const result: Process[] = [];
    const n = processes.length;
    const remaining = processes.map(p => p.burstTime);
    let time = 0;
    let done = 0;

    while (done < n) {
      let idx = -1;
      let highestPriority = Number.MAX_VALUE;

      for (let i = 0; i < n; i++) {
        if (
          processes[i].arrivalTime <= time &&
          remaining[i] > 0 &&
          (processes[i].priority ?? 0) < highestPriority
        ) {
          highestPriority = processes[i].priority ?? 0;
          idx = i;
        }
      }

      if (idx !== -1) {
        if (processes[idx].startTime === undefined)
          processes[idx].startTime = time;

        remaining[idx]--;
        time++;

        if (remaining[idx] === 0) {
          processes[idx].endTime = time;
          processes[idx].waitTime =
            processes[idx].endTime -
            processes[idx].arrivalTime -
            processes[idx].burstTime;
          result.push(processes[idx]);
          done++;
        }
      } else {
        time++;
      }
    }

    return result;
  }
}
