import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let sessionServiceMock: any;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };
    sessionServiceMock = {
      logIn: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    const router = TestBed.inject(Router);
    routerNavigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when fields are empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('form should be valid with correct email and password', () => {
    component.form.setValue({ email: 'user@test.com', password: '1234' });
    expect(component.form.valid).toBe(true);
  });

  it('submit should not call login if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.submit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  // it('submit should call authService.login and navigate on success', fakeAsync(() => {
  //   const fakeResponse = { token: '123abc', user: { name: 'Marília' } };

  //   authServiceMock.login.mockReturnValue(of(fakeResponse));
  //   component.form.setValue({ email: 'user@test.com', password: '1234' });

  //   component.submit();
  //   tick(); // simula passagem de tempo para o subscribe acontecer

  //   expect(authServiceMock.login).toHaveBeenCalledWith({
  //     email: 'user@test.com',
  //     password: '1234',
  //   });
  //   expect(sessionServiceMock.logIn).toHaveBeenCalledWith(fakeResponse);
  //   expect(routerNavigateSpy).toHaveBeenCalledWith(['/sessions']);
  //   expect(component.onError).toBe(false);
  // }));

  it('submit should set onError to true if login fails', fakeAsync(() => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new Error('Authentication error'))
    );

    component.form.setValue({ email: 'user@test.com', password: '1234' });
    component.submit();

    tick();

    expect(component.onError).toBe(true);
    expect(sessionServiceMock.logIn).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  }));

  it('form should be invalid if password is less than 3 characters', () => {
    component.form.setValue({ email: 'user@test.com', password: '12' });
    expect(component.form.invalid).toBe(true);
  });
});
