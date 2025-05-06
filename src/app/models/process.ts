export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  startTime?: number;
  endTime?: number;
  waitTime?: number;
}
