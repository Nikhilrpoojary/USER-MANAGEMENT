import { Component, inject, NgModule, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  imports: [CommonModule, FormsModule, HighlightPipe],
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  protected users: Array<User> = [];
  protected sortColumn: string = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';
  protected headers: string[] = [];
  protected searchText: string = '';
  protected filteredData: Array<User> = [];
  protected displayedColumns: string[] = [];
  protected dataSource: Array<User> = [];
  protected editingCell: { rowIndex: number, column: string } | null = null;
  protected isEditing: boolean = false;
  protected clickTimeout: ReturnType<typeof setTimeout> | null = null;
  protected loading: WritableSignal<boolean> = signal(true);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.displayedColumns = data.length > 0 ? Object.keys(data[0]) : [];
      this.dataSource = data;
      this.filteredData = data;
      this.loading.set(false)
    }, error => {
      this.loading.set(false)
    });

  }

  disableEditing(element: User): void {
    element.isEditing = false;
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }


    this.filteredData.sort((a, b) => {
      const valueA: string | number | boolean = a[column];
      const valueB: string | number | boolean = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {

        return this.sortDirection === 'asc' ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
      }

    });
  }

  applyFilter() {
    if (!this.searchText) {

      this.filteredData = [...this.dataSource];
    } else {
      const searchTextLower = this.searchText.toLowerCase();

      this.filteredData = this.dataSource
        .map(user => ({ ...user }))
        .filter(user =>
          this.displayedColumns.some(column =>
            user[column]?.toString().toLowerCase().includes(searchTextLower)
          )
        );
    }

  }


  onRowClick(user: User): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      return;
    }

    this.clickTimeout = setTimeout(() => {
      this.navigateToDetails(user);
      this.clickTimeout = null;

    }, 250);
  }

  navigateToDetails(user: User): void {
    this.router.navigate(['/user', user.id]);
  }

  enableEditing(element: User, column: string, event: Event): void {
    if (this.clickTimeout) {

      clearTimeout(this.clickTimeout);
    }

    element.isEditing = true;

    setTimeout(() => {
      const target = event.target as HTMLElement;
      target.focus();
    }, 0);
  }
  saveEdit(element: User, column: string, event: Event): void {
    event.preventDefault();
    element.isEditing = false;
  }

}

