import { Component, inject } from '@angular/core';

import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { AdminService } from '../core/services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TabViewModule, TableModule, InputTextModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly adminService: AdminService = inject(AdminService);

  users: any = [];
  category: string = "";

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.adminService.User.subscribe({
      next: resp => this.users = resp
    })
  }

  update(id: number): void {
    this.adminService.changeRole(id);
  }

  delete(id: number): void {
    this.adminService.delete(id).subscribe({
      complete: () => this.fetchUsers()
    })
  }

  addCategory(): void {
    this.adminService.addCategory(this.category).subscribe(resp => {
      console.log(resp)
    })
  }
}
