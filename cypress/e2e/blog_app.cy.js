describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'PetrovKarenzikov',
      username: 'petrov',
      password: 'petrovito'
    }
    const user2 = {
      name: 'MatiasMay',
      username: 'matias',
      password: 'nahui'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('petrov')
      cy.get('#password').type('petrovito')
      cy.get('#login-button').click()
      cy.contains('PetrovKarenzikov logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Wrong credentials')
      cy.get('#errormessage').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('petrov')
      cy.get('#password').type('petrovito')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('10')
      cy.contains('save').click()
      cy.contains('I created a blog in cypress Testy tester')
    })

    it('a new blog can be liked', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('10')
      cy.contains('save').click()
      cy.contains('Show').click()
      cy.get('#likebutton').click()
      cy.contains('11')
    })

    it('a new blog can be deleted', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('10')
      cy.contains('save').click()
      cy.contains('Show').click()
      cy.get('#deletebutton').click()
      cy.get('html').should('not.contain', 'I created a blog in cypress Testy tester')
    })
    it('a new blog can only be deleted by creator', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('10')
      cy.contains('save').click()
      cy.get('#logout-button').click()
      cy.wait(1000)
      cy.get('#username').type('matias')
      cy.get('#password').type('nahui')
      cy.get('#login-button').click()
      cy.contains('Show').click()
      cy.get('#deletebutton').should('have.css', 'display', 'none')
    })
    it('All blogs are ordered in most likes', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('10')
      cy.contains('save').click()
      cy.wait(1000)
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress 2')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('2')
      cy.contains('save').click()
      cy.wait(1000)
      cy.contains('Create new blog').click()
      cy.get('#title').type('I created a blog in cypress 3')
      cy.get('#author').type('Testy tester')
      cy.get('#url').type('www.Atestyurl.com')
      cy.get('#likes').type('15')
      cy.contains('save').click()
      cy.reload()
      cy.get('.blog').eq(0).should('contain', 'I created a blog in cypress 3')
      cy.get('.blog').eq(1).should('contain', 'I created a blog in cypress')
      cy.get('.blog').eq(2).should('contain', 'I created a blog in cypress 2')
    })
  })
})