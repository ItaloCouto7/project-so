export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  startTime?: number;
  endTime: number;
  waitTime?: number;
}
