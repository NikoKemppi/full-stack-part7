describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      username: 'mattim', password: 'salaisuus', name: 'Matti Meikalainen'
    }
    const user2 = {
      username: 'tanataro', password: 'himitsu', name: 'Tanaka Taro'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login').click()
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mattim')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()
      cy.contains('Matti Meikalainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('johnny123')
      cy.get('#password').type('miumau')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'Error: wrong username or password').and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Matti Meikalainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // cy.login({ username: 'mattim', password: 'salaisuus' })
      cy.get('#username').type('mattim')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.contains('create new')
      cy.get('#newblogtitle').type('Hunting Bigfoot')
      cy.get('#newblogauthor').type('Bigfoot Hunter')
      cy.get('#newblogurl').type('www.blogit.com/bigfoot')
      cy.get('#create-button').click()
      cy.contains('a new blog Hunting Bigfoot by Bigfoot Hunter added')
      cy.contains('Hunting Bigfoot Bigfoot Hunter')
    })

    describe('And at least one blog exists', function() {
      beforeEach(function() {
        cy.contains('create new blog').click()
        // cy.createBlog({ title: 'Hunting Bigfoot', author: 'Bigfoot Hunter', url: 'www.blogit.com/bigfoot' })
        cy.get('#newblogtitle').type('Hunting Bigfoot')
        cy.get('#newblogauthor').type('Bigfoot Hunter')
        cy.get('#newblogurl').type('www.blogit.com/bigfoot')
        cy.get('#create-button').click()
        cy.contains('logout').click()
        // cy.login({ username: 'tanataro', password: 'himitsu' })
        cy.get('#username').type('tanataro')
        cy.get('#password').type('himitsu')
        cy.get('#login-button').click()
        cy.contains('create new blog').click()
        // cy.createBlog({ title: 'Visiting Temples', author: 'Butsuno Shindo', url: 'www.blogit.com/temples' })
        cy.get('#newblogtitle').type('Visiting Temples')
        cy.get('#newblogauthor').type('Butsuno Shindo')
        cy.get('#newblogurl').type('www.blogit.com/temples')
        cy.get('#create-button').click()
      })

      it('Users can like blogs', function() {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.get('#like-button').click()
        cy.contains('likes 1')
      })

      it('Blogs created by a user can be removed', function() {
        cy.contains('Visiting Temples Butsuno Shindo').contains('view').click()
        cy.contains('remove')
        cy.get('#remove-button').click()

        cy.get('html').should('not.contain', 'Visiting Temples Butsuno Shindo')
      })

      it('Only the creator can see the delete button of a blog', function() {
        cy.contains('Visiting Temples Butsuno Shindo').contains('view').click()
        cy.contains('remove')
        cy.contains('hide').click()

        cy.contains('Hunting Bigfoot Bigfoot Hunter').contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('Blogs are ordered by the number of likes', function() {
        cy.get('.blog').eq(0).should('contain', 'Hunting Bigfoot Bigfoot Hunter')
        cy.get('.blog').eq(1).should('contain', 'Visiting Temples Butsuno Shindo')

        cy.contains('Hunting Bigfoot Bigfoot Hunter').contains('view').click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
        cy.contains('hide').click()
        cy.contains('Visiting Temples Butsuno Shindo').contains('view').click()
        cy.get('#like-button').click()
        cy.get('#like-button').click()
        cy.get('#like-button').click()
        cy.contains('likes 3')
        cy.contains('hide').click()

        cy.get('.blog').eq(0).should('contain', 'Visiting Temples Butsuno Shindo')
        cy.get('.blog').eq(1).should('contain', 'Hunting Bigfoot Bigfoot Hunter')
      })
    })
  })
})