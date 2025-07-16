import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create an account successfully', () => {
    const formData = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'secret123',
    };

    component.form.setValue(formData);
    expect(component.form.valid).toBe(true);
    authServiceMock.register.mockReturnValue(of(undefined));

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith(formData);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });

  it('should show an error if a required field is missing', () => {
    component.form.patchValue({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });

    component.submit();

    expect(authServiceMock.register).not.toHaveBeenCalled();
    expect(component.form.invalid).toBe(true);
  });

  it('should set onError to true if registration fails', () => {
    const formData = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'secret123',
    };

    component.form.setValue(formData);
    expect(component.form.valid).toBe(true);

    component.onError = false;

    authServiceMock.register.mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.submit();

    expect(authServiceMock.register).toHaveBeenCalledWith(formData);
    expect(component.onError).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should execute error callback when registration fails', fakeAsync(() => {
    const formData = {
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'secret123',
    };

    component.form.setValue(formData);
    component.onError = false;

    authServiceMock.register.mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.submit();
    tick();

    expect(component.onError).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));
});
