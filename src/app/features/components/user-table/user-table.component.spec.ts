import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTableComponent } from './user-table.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of([{ id: 1, name: 'John Doe' }]))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [UserTableComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    expect(userServiceMock.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('John Doe');
  });

  it('should sort data correctly', () => {
    component.sortData('name');
    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');
  });

  it('should apply filter correctly', () => {
    component.searchText = 'John';
    component.applyFilter();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('John Doe');
  });

  it('should navigate to user details on row click', () => {
    const user = { id: 1, name: 'John Doe' };
    component.onRowClick(user);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/user', user.id]);
  });

  it('should enable editing on double-click', () => {
    const element = { isEditing: false };
    const event = new Event('dblclick');
    component.enableEditing(element, 'name', event);
    expect(element.isEditing).toBe(true);
  });

  it('should save edit and disable editing', () => {
    const element = { isEditing: true };
    const event = new Event('submit');
    component.saveEdit(element, 'name', event);
    expect(element.isEditing).toBe(false);
  });
});
