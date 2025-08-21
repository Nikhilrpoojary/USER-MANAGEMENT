import { Component, inject, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  imports: [CommonModule, FormsModule, HighlightPipe],
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  users: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  headers: string[] = [];
  searchText: string = '';
  filteredData: any[] = [];

  displayedColumns: string[] = [];
  dataSource: Array<any> = [];
  editingCell: { rowIndex: number, column: string } | null = null;
  isEditing = false;
  clickTimeout: any = null;
  loading = true;
  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);



  ngOnInit(): void {
    this.loading = true;
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.displayedColumns = data.length > 0 ? Object.keys(data[0]) : [];
      this.dataSource = data; // <-- Add this line
      this.filteredData = data;
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }

  disableEditing(element: any): void {
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
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  applyFilter() {
    console.log("filteredData", this.filteredData);
    console.log("this.dataSource", this.dataSource);
    if (!this.searchText) {

      this.filteredData = [...this.dataSource]; // Reset data when search is cleared
    } else {
      const searchTextLower = this.searchText.toLowerCase();

      this.filteredData = this.dataSource
        .map(user => ({ ...user })) // Create a new reference for each row
        .filter(user =>
          this.displayedColumns.some(column =>
            user[column]?.toString().toLowerCase().includes(searchTextLower)
          )
        );
    }

    console.log("filteredData", this.filteredData);
    console.log("this.dataSource", this.dataSource);

  }


  onRowClick(user: any): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout); // Cancel navigation if double-click detected
      this.clickTimeout = null;
      return;
    }

    this.clickTimeout = setTimeout(() => {
      this.navigateToDetails(user);
      this.clickTimeout = null;
      console.log("user", user);

    }, 250);
  }

  navigateToDetails(user: any): void {
    this.router.navigate(['/user', user.id]);
  }

  enableEditing(element: any, column: string, event: Event): void {
    clearTimeout(this.clickTimeout);
    console.log("clear timeout");

    element.isEditing = true;

    setTimeout(() => {
      const target = event.target as HTMLElement;
      target.focus(); // Auto-focus on the cell when editing
    }, 0);
  }
  saveEdit(element: any, column: string, event: any): void {
    event.preventDefault();
    element.isEditing = false;
  }

}