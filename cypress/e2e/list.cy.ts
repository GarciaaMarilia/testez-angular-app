describe('ListComponent', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('login');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Yoga Morning',
          date: '2025-07-20T10:00:00Z',
          description: 'Morning yoga session for beginners',
        },
        {
          id: 2,
          name: 'Yoga Evening',
          date: '2025-07-21T18:00:00Z',
          description: 'Evening yoga session for relaxation',
        },
      ],
    }).as('getSessions');

    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.wait('@login');
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
  });

  it('Should display the list of sessions', () => {
    cy.contains('Rentals available').should('be.visible');
    cy.get('.item').should('have.length', 2);

    cy.get('.item')
      .first()
      .within(() => {
        cy.contains('Yoga Morning');
        cy.contains('Morning yoga session for beginners');
      });
  });

  it('Should show "Create" and "Edit" buttons if user is admin', () => {
    cy.contains('button', 'Create').should('be.visible');

    cy.get('.item')
      .first()
      .within(() => {
        cy.contains('Edit').should('be.visible');
      });
  });

  it('Should navigate to session detail when clicking "Detail"', () => {
    cy.get('.item').first().contains('Detail').click();
    cy.url().should('include', '/sessions/detail/1');
  });

  it('Should navigate to session update when clicking "Edit" as admin', () => {
    cy.get('.item').first().contains('Edit').click();
    cy.url().should('include', '/sessions/update/1');
  });
});

describe('ListComponent (non-admin user)', () => {
  it('Should not show "Create" and "Edit" buttons if user is not admin', () => {
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
          name: 'Yoga Morning',
          date: '2025-07-20T10:00:00Z',
          description: 'Morning yoga session for beginners',
        },
      ],
    }).as('getSessions');

    cy.clearLocalStorage();

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('user@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.wait('@login');
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.contains('button', 'Create').should('not.exist');
    cy.get('.item')
      .first()
      .within(() => {
        cy.contains('Edit').should('not.exist');
      });
  });
});
