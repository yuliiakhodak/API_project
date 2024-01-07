import { postRequestBody, putRequestBody, patchRequestBody, defaulUserName } from '../../fixtures/example.json'

describe("API Project02", () => {
    let id;
    it('Retrieve a list of all users', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('baseUrl')
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            const students = response.body
            expect(students.length).to.be.gte(2)
            expect(students[1].firstName).to.be.equal(defaulUserName.firstName)
            expect(students[1].lastName).to.be.equal(defaulUserName.lastName)
        })
    })
    it('Create a new user', () => {
        cy.request({
            method: 'POST',
            url: Cypress.env('baseUrl'),
            body: postRequestBody
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            id = response.body.id
            cy.validateResponse(response, postRequestBody)
        })
    })

    it('Retrieve a specific user-created', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, postRequestBody)
        })
    })
    it('Update an existing user', () => {
        cy.request({
            method: 'PUT',
            url: `${Cypress.env('baseUrl')}/${id}`,
            body: putRequestBody
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, putRequestBody)
        })
    })
    it("Partially update an existing User", () => {
        cy.request({
            method: 'PATCH',
            url: `${Cypress.env('baseUrl')}/${id}`,
            body: patchRequestBody
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, patchRequestBody)
        })
    })
    it("Retrieve a list of all users again", () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('baseUrl')
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            const students = response.body
            expect(students.length).to.be.gte(3)
        })
    })
    it("Retrieve a specific user created to confirm the update.", () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
            cy.validateResponse(response, patchRequestBody)
            expect(response.body.firstName).to.be.equal(putRequestBody.firstName)
            expect(response.body.lastName).to.be.equal(putRequestBody.lastName)
        })
    })
    it("Delete the user that you created.", () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
        })
    })
})
