describe('Create Session - Full Flow', () => {
  const testSession = {
    name: 'Yoga for Beginners',
    date: '2025-08-10',
    teacherId: '1',
    description: 'This is a basic yoga class for beginners.',
  };

  const sessionMock = {
    id: '123',
    name: 'Updated Class',
    date: '2025-07-21',
    teacher_id: '2',
    description: 'Updated description',
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        admin: true,
      },
    }).as('login');

    cy.intercept('GET', '/api/session/123', {
      statusCode: 200,
      body: sessionMock,
    }).as('getSession');

    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [
        { id: '1', firstName: 'John', lastName: 'Doe' },
        { id: '2', firstName: 'Jane', lastName: 'Smith' },
      ],
    }).as('getTeachers');

    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {},
    }).as('createSession');
  });

  it('should login and create a new session', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('admin@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.wait('@login');

    cy.url().should('include', '/sessions');

    cy.contains('button', 'Create').click();

    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    cy.get('input[formControlName="name"]').type(testSession.name);
    cy.get('input[formControlName="date"]').type(testSession.date);
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('John Doe').click();
    cy.get('textarea[formControlName="description"]').type(
      testSession.description
    );

    cy.contains('button', 'Save')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait('@createSession');
    cy.contains('Session created !').should('exist');
    cy.url().should('include', '/sessions');
  });
});
