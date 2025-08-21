import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  imports: [CommonModule]
})
export class UserDetailsComponent implements OnInit {
  user: any;
  isLoading = true;
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.userService.getUsers().subscribe(users => {
      this.user = users.find(u => u.id == userId);
      this.isLoading = false;
    });
  }
  get userKeys(): string[] {
    return this.user ? Object.keys(this.user) : [];
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
