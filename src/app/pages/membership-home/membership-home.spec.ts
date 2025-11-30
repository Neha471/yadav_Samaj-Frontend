import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembershipHomeComponent } from './membership-home';
import { MembershipUserService } from '../../../core/membership-user';
import { of } from 'rxjs';
import { MembershipUser } from '../../../models/MembershipUser';

describe('MembershipHomeComponent', () => {
  let component: MembershipHomeComponent;
  let fixture: ComponentFixture<MembershipHomeComponent>;
  let mockUserService: any;

  const mockUsers: MembershipUser[] = [
    { id: 1, fullName: 'John Doe', phone: '1234567890', email: 'john@example.com', dob: '1990-01-01', approved: true },
    { id: 2, fullName: 'Jane Doe', phone: '0987654321', email: 'jane@example.com', dob: '1992-05-15', approved: false }
  ];

  beforeEach(async () => {
    mockUserService = {
      getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(Promise.resolve(mockUsers))
    };

    await TestBed.configureTestingModule({
      imports: [MembershipHomeComponent],
      providers: [
        { provide: MembershipUserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MembershipHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load only approved users on init', async () => {
    await component.ngOnInit();
    expect(component.users.length).toBe(1);
    expect(component.users[0].fullName).toBe('John Doe');
  });

  it('should call getAllUsers from service', async () => {
    await component.ngOnInit();
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  });
});
