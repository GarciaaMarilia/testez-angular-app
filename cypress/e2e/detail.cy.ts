describe('DetailComponent - Admin', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'adminUser',
        firstName: 'Admin',
        lastName: 'User',
        admin: true,
      },
    }).as('login');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Yoga Morning',
          teacher_id: 10,
          date: '2025-07-20T10:00:00Z',
          description: 'Admin detail test',
        },
      ],
    }).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Yoga Morning',
        teacher_id: 10,
        users: [1],
        date: '2025-07-20T10:00:00Z',
        description: 'Admin detail test',
        createdAt: '2025-07-01T10:00:00Z',
        updatedAt: '2025-07-10T10:00:00Z',
      },
    }).as('getSession');

    cy.intercept('GET', '/api/teacher/10', {
      statusCode: 200,
      body: {
        id: 10,
        firstName: 'Jane',
        lastName: 'Doe',
      },
    }).as('getTeacher');

    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
    }).as('deleteSession');

    cy.intercept('PUT', '/api/session/1', {
      statusCode: 201,
      body: {},
    }).as('updateSession');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('admin@studio.com');
    cy.get('input[formControlName=password]').type('admin123{enter}{enter}');
    cy.wait('@login');

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
  });

  it('displays session details and allows admin to delete', () => {
    cy.contains('Yoga Morning').should('be.visible');
    cy.contains('button', 'Detail').should('be.visible').click();

    cy.url().should('include', '/sessions/detail/1');
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.contains('Yoga Morning').should('be.visible');
    cy.contains('Jane DOE').should('be.visible');
    cy.contains('Admin detail test').should('be.visible');

    cy.contains('Delete').should('be.visible').click();
    cy.wait('@deleteSession');

    cy.url().should('include', '/sessions');
  });

  it('edits a session as admin', () => {
    cy.contains('Yoga Morning').should('be.visible');
    cy.contains('Admin detail test').should('be.visible');

    cy.contains('Edit').should('be.visible').click();

    cy.url().should('include', '/sessions/update/1');
    cy.wait('@getSession');

    cy.get('input[formControlName=name]').clear().type('Yoga Sunrise');

    cy.contains('button', 'Save').click();
    cy.wait('@updateSession');

    cy.url().should('include', '/sessions');
  });
});

describe('DetailComponent - Non-admin user', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 2,
        username: 'regularUser',
        firstName: 'Regular',
        lastName: 'User',
        admin: false,
      },
    }).as('login');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Yoga Evening',
          teacher_id: 11,
          users: [],
          date: '2025-07-21T18:00:00Z',
          description: 'User detail test',
          createdAt: '2025-07-02T10:00:00Z',
          updatedAt: '2025-07-12T10:00:00Z',
        },
      ],
    }).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Yoga Evening',
        teacher_id: 11,
        users: [],
        date: '2025-07-21T18:00:00Z',
        description: 'User detail test',
        createdAt: '2025-07-02T10:00:00Z',
        updatedAt: '2025-07-12T10:00:00Z',
      },
    }).as('getSessionDetail');

    cy.intercept('GET', '/api/teacher/11', {
      statusCode: 200,
      body: {
        id: 11,
        firstName: 'John',
        lastName: 'Smith',
      },
    }).as('getTeacher');

    cy.intercept('POST', '/api/session/1/participate/2', {
      statusCode: 200,
    }).as('participate');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('user@studio.com');
    cy.get('input[formControlName=password]').type('user123{enter}{enter}');
    cy.wait('@login');
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.contains('Yoga Evening');

    cy.contains('Detail').should('be.visible').click();

    cy.url().should('include', '/sessions/detail/1');
    cy.wait('@getSessionDetail');
    cy.wait('@getTeacher');
  });

  it('displays session details and allows participation', () => {
    cy.contains('Yoga Evening').should('be.visible');
    cy.contains('John SMITH').should('be.visible');
    cy.contains('User detail test').should('be.visible');

    cy.contains('Participate').should('be.visible').click();
    cy.wait('@participate');
  });
});
