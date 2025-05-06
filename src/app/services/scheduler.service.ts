import { Injectable } from '@angular/core';
import { Process } from '../models/process';

@Injectable({
  providedIn: 'root'
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

  fcfs(): Process[] {
    const sortedProcesses = [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let totalWaitTime = 0;

    sortedProcesses.forEach((process, index) => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }

      process.startTime = currentTime;
      process.endTime = process.startTime + process.burstTime;
      process.waitTime = process.startTime - process.arrivalTime;
      totalWaitTime += process.waitTime;

      currentTime = process.endTime;
    });

    return sortedProcesses;
  }
}
