describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('Should show validation errors when submitting empty form', () => {
    cy.get('form').submit();

    cy.get('input[formControlName="firstName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formControlName="lastName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName="password"]').should(
      'have.class',
      'ng-invalid'
    );
  });

  it('Should validate email format and min/max length for names and password', () => {
    cy.get('input[formControlName="firstName"]').type('ab');
    cy.get('input[formControlName="lastName"]').type('a'.repeat(21));
    cy.get('input[formControlName="email"]').type('invalid-email').blur();
    cy.get('input[formControlName="password"]').type('12');

    cy.get('form').submit();

    cy.get('input[formControlName="firstName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formControlName="lastName"]').should(
      'have.class',
      'ng-invalid'
    );
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName="password"]').should(
      'have.class',
      'ng-invalid'
    );
  });

  it('Should register successfully with valid data and redirect to /login', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    }).as('registerRequest');

    cy.get('input[formControlName="firstName"]').type('Marilia');
    cy.get('input[formControlName="lastName"]').type('Garcia');
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('securePassword123');

    cy.get('form').submit();

    cy.wait('@registerRequest');

    cy.url().should('include', '/login');
  });

  it('Should show error message if backend returns error', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { message: 'Registration failed' },
    }).as('registerRequestError');

    cy.get('input[formControlName="firstName"]').type('Marilia');
    cy.get('input[formControlName="lastName"]').type('Garcia');
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('securePassword123');

    cy.get('form').submit();

    cy.wait('@registerRequestError');

    cy.get('.error').should('be.visible');
  });
});
