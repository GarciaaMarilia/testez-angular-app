describe('Account page', () => {
  const fakeUser = {
    id: 1,
    username: 'user1',
    firstName: 'User',
    lastName: 'One',
    admin: false,
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: fakeUser,
    }).as('login');

    cy.intercept('GET', '/api/session', []).as('getSessions');

    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: fakeUser,
    }).as('getUser');
  });

  it('should login, navigate to account page and see user information', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('user@studio.com');
    cy.get('input[formControlName=password]').type('test123{enter}{enter}');

    cy.wait('@login');
    cy.wait('@getSessions');

    cy.url().should('include', '/sessions');

    cy.contains('span.link', 'Account').click();

    cy.wait('@getUser');

    cy.url().should('include', '/me');

    cy.contains('Name: User ONE').should('be.visible');
  });
});
