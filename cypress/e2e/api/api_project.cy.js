import { postRequestBody, putRequestBody } from '../../fixtures/example.json'

describe('API project', () => {

    const expectedValues = [postRequestBody.dob, postRequestBody.email, postRequestBody.firstName, postRequestBody.lastName]
    const expectedUpdatedValues = [putRequestBody.dob, putRequestBody.email, putRequestBody.firstName, putRequestBody.lastName]
    let id;

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
        cy.task('runQuery', `SELECT * FROM student WHERE email = \'ed_hoops@example.net\'`).then((rows) => {
            expect(rows).to.have.length(1)

            const ed = rows[0]
            expectedValues.forEach((value, index) => {
                expect(ed[index + 1]).to.equal(value)
            })
        })
    })

    it('Retrieve a specific user-created', () => {
        cy.request({
            method: "GET",
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
        })
        cy.task('runQuery', `SELECT * FROM student WHERE id = ${id}`).then((rows) => {
            expect(rows).to.have.length(1)
            const ed = rows[0]
            expectedValues.forEach((value, index) => {
                expect(ed[index + 1]).to.equal(value)
            })
        })
    })

    it('Update an existing user', () => {
        cy.request({
            method: "PUT",
            url: `${Cypress.env('baseUrl')}/${id}`,
            body: putRequestBody
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
        })
        cy.task('runQuery', `SELECT * FROM student WHERE id = ${id}`).then((rows) => {
            const edUpdated = rows[0]
            expectedUpdatedValues.forEach((value, index) => {
                expect(edUpdated[index + 1]).to.equal(value)
            })
        })
    })


    it('Retrieve a specific user created to confirm the update', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)
        })
        cy.task('runQuery', `SELECT * FROM student WHERE id = ${id}`).then((rows) => {
            const edUpdated = rows[0]
            expectedUpdatedValues.forEach((value, index) => {
                expect(edUpdated[index + 1]).to.equal(value)
            })
        })
    })

    it('Delete the user that you created', () => {
        cy.request({
            method: 'DELETE',
            url: `${Cypress.env('baseUrl')}/${id}`
        }).then((response) => {
            expect(response.status).to.be.equal(200)
            expect(response.duration).to.be.below(200)

        })
    })
    it('GET user after DELETE', () => {
        cy.request({
            method: 'GET',
            url: `${Cypress.env('baseUrl')}/${id}`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(404)
        })
    })
})