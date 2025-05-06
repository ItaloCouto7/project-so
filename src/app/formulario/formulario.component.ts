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
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  userData = {
    nome: '',
    numero: '',
    duracao: ''
  };

  submitted = false;

  constructor(public schedulerService: SchedulerService) {}

  onSubmit(form: any) {
    const process: Process = {
      id: this.schedulerService.getProcesses().length + 1,
      name: this.userData.nome,
      arrivalTime: Number(this.userData.numero),
      burstTime: Number(this.userData.duracao)
    };

    this.schedulerService.addProcess(process);

    this.submitted = true;

    console.log('Dados do formulário:', this.userData);
  }

}
