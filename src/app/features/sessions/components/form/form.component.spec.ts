import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let routerMock: any;
  let sessionApiServiceMock: any;
  let sessionServiceMock: any;
  let teacherServiceMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    routerMock = {
      url: '/sessions/create',
      navigate: jest.fn(),
    };

    sessionApiServiceMock = {
      create: jest.fn(),
      update: jest.fn(),
      detail: jest.fn(),
    };

    sessionServiceMock = {
      sessionInformation: { admin: true },
    };

    teacherServiceMock = {
      all: jest.fn().mockReturnValue(of([])),
    };

    snackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'abc',
              },
            },
          },
        },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should redirect if user is not admin', () => {
    sessionServiceMock.sessionInformation.admin = false;
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form in creation mode', () => {
    routerMock.url = '/sessions/create'; // garantir que url é create
    component.ngOnInit();
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.valid).toBe(false);
  });

  it('should initialize form in update mode and fill it with session data', fakeAsync(() => {
    routerMock.url = '/sessions/update/abc'; // garantir que url contém 'update'

    const session = {
      name: 'Test Session',
      date: '2025-07-10',
      teacher_id: '123',
      description: 'Updated description',
    };

    sessionApiServiceMock.detail.mockReturnValue(of(session));

    component.ngOnInit();
    tick();

    expect(component.onUpdate).toBe(true);
    expect(sessionApiServiceMock.detail).toHaveBeenCalledWith('abc');
    expect(component.sessionForm?.value.name).toBe('Test Session');
    expect(component.sessionForm?.value.description).toBe(
      'Updated description'
    );
  }));

  it('should submit and create a session', () => {
    const session = {
      name: 'New Session',
      date: '2025-07-15',
      teacher_id: '321',
      description: 'A description',
    };

    component.onUpdate = false;
    component.sessionForm = component['fb'].group(session);
    sessionApiServiceMock.create.mockReturnValue(of(session));

    component.submit();

    expect(sessionApiServiceMock.create).toHaveBeenCalledWith(session);
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit and update a session', () => {
    const session = {
      name: 'Updated Session',
      date: '2025-07-15',
      teacher_id: '111',
      description: 'Updated description',
    };

    component.onUpdate = true;
    component['id'] = 'session-id';
    component.sessionForm = component['fb'].group(session);
    sessionApiServiceMock.update.mockReturnValue(of(session));

    component.submit();

    expect(sessionApiServiceMock.update).toHaveBeenCalledWith(
      'session-id',
      session
    );
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 }
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
