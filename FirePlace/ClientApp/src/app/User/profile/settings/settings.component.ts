import { Component, inject } from "@angular/core";
import { FormsModule } from '@angular/forms';

import { UserService } from "../../../core/services/user.service";

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { EMPTY, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";


@Component({
    selector: "app-settings",
    standalone: true,
    imports: [DialogModule, PasswordModule, ButtonModule, InputTextModule, FormsModule,AsyncPipe],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {

    private readonly userService: UserService = inject(UserService);

    passwordDialog: boolean = false;
    usernameDialog: boolean = false;
    deleteDialog: boolean = false;
    photoDialog: boolean = false;

    image: string = "";
    username: string = "";
    delete: string = "";
    password = {
        newPassword: "",
        oldPassword: ""
    };

    user$: Observable<any> = EMPTY;

    ngOnInit(): void {
        this.fetchUser()
    }
    
    fetchUser(): void {
        this.user$ = this.userService.getSettingsUser();
    }

    changePassword(): void {
        this.userService.updatePassword(this.password).subscribe({
            next: resp => console.log(resp),
            error: error => console.log(error)
        })
        this.clearAll();
    }

    changePhoto(): void {
        this.userService.updatePhoto(this.image).subscribe({
            complete: () => this.fetchUser
        })
        this.clearAll();
    }

    changeUsername(): void {
        this.userService.updateUsername(this.username).subscribe({
            complete: () => this.fetchUser()
        })
        this.clearAll();
    }

    deleteUser(): void {
        this.userService.delete(this.delete).subscribe({
            complete: () => {
                localStorage.clear();
                this.userService.checkToken();
            }
        })
    }

    clearAll(): void {
        this.image = "";
        this.username = "";
        this.delete = "";
        this.password = {
            newPassword: "",
            oldPassword: ""
        };
    }

    onFileInput(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            this.image = base64String;
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    logout(): void {
        let token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            this.userService.checkToken();
        }
    }
}