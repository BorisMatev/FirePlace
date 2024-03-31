import { Component, inject } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

import { AdminService } from '../core/services/admin.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TabViewModule, TableModule, InputTextModule, FormsModule,DialogModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly adminService: AdminService = inject(AdminService);
  private readonly messageService: MessageService = inject(MessageService);

  users: any = [];
  category: string = "";

  deleteDialog: boolean = false;
  deleteId: number = 0;

  ngOnInit(): void {
    this.fetchUsers();
  }

  showDialog(id: number): void{
    this.deleteDialog = true;
    this.deleteId = id;
  }
  
  successMesage(message: string) {
    this.messageService.add({ 
      key: 'toast', 
      severity: 'success', 
      summary: 'Успех', 
      detail: message 
    });
  }

  fetchUsers(): void {
    this.adminService.User.subscribe({
      next: resp => this.users = resp
    })
  }

  update(id: number): void {
    this.adminService.changeRole(id).subscribe({
      complete: () => {
        this.successMesage("Ролята е обновена успешно!");
      }
    });
  }

  delete(): void {
    this.adminService.delete(this.deleteId).subscribe({
      complete: () => {
        this.fetchUsers();
        this.successMesage("Потребителя е изтрит успешно!");
      }
    })
  }

  addCategory(): void {
    this.adminService.addCategory(this.category).subscribe({
      complete: () => {
        this.successMesage("Категорията е добавена успешно!");
      }
    })
    this.category = "";
  }
}
