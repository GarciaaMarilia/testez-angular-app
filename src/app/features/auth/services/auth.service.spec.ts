import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#login', () => {
    it('should send POST request and return SessionInformation', () => {
      const mockRequest: LoginRequest = {
        email: 'test@example.com',
        password: '123456',
      };

      const mockResponse: SessionInformation = {
        token: 'abc123',
        id: 1,
        type: 'test',
        username: 'Test',
        firstName: 'Test',
        lastName: 'User',
        admin: false,
      };

      service.login(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('#register', () => {
    it('should send POST request for registration and return void', () => {
      const mockRegisterRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      service.register(mockRegisterRequest).subscribe((response) => {
        expect(response).toBeUndefined(); // void
      });

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterRequest);
      req.flush(null); // Simula void
    });
  });
});
