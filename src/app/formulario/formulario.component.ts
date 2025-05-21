import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SchedulerService } from '../services/scheduler.service';
import { Process } from '../models/process';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent {
  userData = {
    nome: '',
    numero: '',
    duracao: '',
  };

  schedulingAlgorithms = [
    'FCFS',
    'SJF',
    'SRTF',
    'Round Robin',
    'Priority (No Preemptive)',
    'Priority (Preemptive)',
  ];

  selectedAlgorithm = 'FCFS';

  orderedProcesses: Process[] = [];

  submitted = false;

  constructor(public schedulerService: SchedulerService) {}

  onSubmit(form: any) {
    const process: Process = {
      id: this.schedulerService.getProcesses().length + 1,
      name: this.userData.nome,
      arrivalTime: Number(this.userData.numero),
      burstTime: Number(this.userData.duracao),
      endTime: 0
    };

    this.schedulerService.addProcess(process);

    this.submitted = true;

    switch (this.selectedAlgorithm) {
      case 'FCFS':
        this.orderedProcesses = this.schedulerService.fcfs();
        break;
      case 'SJF':
        this.orderedProcesses = this.schedulerService.sjf();
        break;
      case 'SRTF':
        this.orderedProcesses = this.schedulerService.srtf();
        break;
      case 'Round Robin':
        this.orderedProcesses = this.schedulerService.roundRobin();
        break;
      case 'Priority (No Preemptive)':
        this.orderedProcesses = this.schedulerService.priorityNonPreemptive();
        break;
      case 'Priority (Preemptive)':
        this.orderedProcesses = this.schedulerService.priorityPreemptive();
        break;
      default:
        this.orderedProcesses = [];
        break;
    }
  }
}
