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
    return [...this.processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  }
}
