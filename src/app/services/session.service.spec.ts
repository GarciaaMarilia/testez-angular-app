import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockSession: SessionInformation = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    id: 1,
    username: 'marilia',
    firstName: 'Marília',
    lastName: 'Garcia',
    admin: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have isLogged = false', (done) => {
    service.$isLogged().subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should log in correctly', (done) => {
    service.logIn(mockSession);

    expect(service.sessionInformation).toEqual(mockSession);
    expect(service.isLogged).toBe(true);

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should log out correctly', (done) => {
    service.logIn(mockSession); // Primeiro login
    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);

    service.$isLogged().subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
});
