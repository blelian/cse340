describe('Basic Navigation', () => {
  before(() => {
    // Replace with your local server URL and port
    cy.visit('http://localhost:5500');
  });

  it('should load the homepage', () => {
    cy.contains('Welcome'); // Replace with actual text from your homepage
  });

  it('should navigate to inventory page', () => {
    cy.get('a[href="/inventory"]').click();
    cy.url().should('include', '/inventory');
    cy.contains('Inventory'); // Adjust for actual page content
  });

  it('should require login for admin dashboard', () => {
    cy.visit('http://localhost:5500/admin/dashboard');
    cy.url().should('not.include', '/admin/dashboard'); // Redirected if unauthenticated
  });

  // Add more interactions as you want here...
});
