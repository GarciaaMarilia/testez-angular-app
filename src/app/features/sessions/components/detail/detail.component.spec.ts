import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  // Mocks dos serviços usados no componente
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const mockSessionApiService = {
    detail: jest.fn(),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn(),
  };

  const mockTeacherService = {
    detail: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('session-id'),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [DetailComponent],
      providers: [
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher on init', () => {
    const sessionMock = {
      id: 'session-id',
      teacher_id: 123,
      users: [1, 2, 3],
    };
    const teacherMock = { id: 123, name: 'Teacher Name' };

    mockSessionApiService.detail.mockReturnValue(of(sessionMock));
    mockTeacherService.detail.mockReturnValue(of(teacherMock));

    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('session-id');
    // Precisa disparar a subscription, então detectChanges pode ajudar
    fixture.detectChanges();

    expect(component.session).toEqual(sessionMock);
    expect(component.isParticipate).toBe(true); // porque 1 está na lista de users
    expect(mockTeacherService.detail).toHaveBeenCalledWith('123');
    expect(component.teacher).toEqual(teacherMock);
  });

  it('should open snackbar and navigate after delete', () => {
    mockSessionApiService.delete.mockReturnValue(of({}));
    component.sessionId = 'session-id';

    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('session-id');
    // Como é assincrono, chamamos detectChanges para disparar subscriptions
    fixture.detectChanges();

    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  // Adicione testes para participate e unParticipate similares, se quiser.
});
