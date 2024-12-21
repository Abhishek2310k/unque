// cypress/e2e/professor.test.js

describe('Professor API Tests', () => {

    // Test for registering a new professor
    it('should register a professor', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/professor',
            body: {
                username: 'testuser',
                password: 'testpassword123'
            },
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if response status is 200 and message contains username
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('testuser');
        });
    });

    // Test for successful login with correct credentials
    it('should login a professor successfully', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/professor',
            body: {
                username: 'testuser',
                password: 'testpassword123'
            },
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if login was successful
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('fine');
        });
    });

    // Test for failed login with incorrect password
    it('should fail if incorrect password is provided', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/professor',
            body: {
                username: 'testuser',
                password: 'wrongpassword'
            },
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if password is incorrect
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('Password incorrect');
        });
    });

    // Test for login failure when user does not exist
    it('should return 404 if user does not exist', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/professor',
            body: {
                username: 'nonexistentuser',
                password: 'password123'
            },
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if user does not exist
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('user does not exist');
        });
    });

});


// cypress/e2e/getAppointments.test.js

describe('Get Appointments API Tests', () => {

    // Test for valid professor username
    it('should return appointments for valid professor username', () => {
        cy.request({
            method: 'GET',
            url: '/student/get_appointments',
            qs: { prof_username: 'testuser' }  // Send query parameter 'prof_username'
        }).then((response) => {
            // Check if response status is 200 and response contains the appointment string
            expect(response.status).to.eq(200);
            expect(response.body.data).to.eq('000000000000000000000000'); // Replace with expected result
        });
    });

    // Test for missing prof_username query parameter
    it('should return 400 if prof_username is missing', () => {
        cy.request({
            method: 'GET',
            url: '/student/get_appointments',
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if the response contains the expected error message for missing username
            expect(response.status).to.eq(400);
            expect(response.body.data).to.eq('prof_username is required');
        });
    });

    // Test for non-existent professor username
    it('should return 404 if professor username does not exist', () => {
        cy.request({
            method: 'GET',
            url: '/student/get_appointments',
            qs: { prof_username: 'nonexistentProfessor' },  // Non-existent username
            failOnStatusCode: false // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Check if the response contains the expected error message for non-existent user
            expect(response.status).to.eq(404);
            expect(response.body.data).to.eq('Professor not found');
        });
    });

});


describe('student 1 booking the slot', () => {


    // Test for successfully booking an available slot (orig_string[interval_index] === '0')
    it('should return 201 if the appointment is successfully booked', () => {
        cy.request({
            method: 'PUT',
            url: '/student/book_appointment',
            body: {
                prof_username: 'testuser',    // Existing professor username
                student_username: 'abhishek',    // Existing student username
                interval_index: 5                    // Index of the available slot ('0')
            }
        }).then((response) => {
            // Ensure the response status is 201 and success message is returned
            expect(response.status).to.eq(201);
            expect(response.body.error).to.eq(false);
            expect(response.body.data).to.eq('Appointment booked');
        });
    });

});



describe('student 2 booking the slot', () => {


    // Test for successfully booking an available slot (orig_string[interval_index] === '0')
    it('should return 201 if the appointment is successfully booked', () => {
        cy.request({
            method: 'PUT',
            url: '/student/book_appointment',
            body: {
                prof_username: 'testuser',    // Existing professor username
                student_username: 'abhishek1',    // Existing student username
                interval_index: 7                // Index of the available slot ('0')
            }
        }).then((response) => {
            // Ensure the response status is 201 and success message is returned
            expect(response.status).to.eq(201);
            expect(response.body.error).to.eq(false);
            expect(response.body.data).to.eq('Appointment booked');
        });
    });

});

describe('p1 cancelling the appointment with s1', () => {

    // Test for successfully canceling a slot
    it('should return 200 if the appointment slot is successfully canceled by professor', () => {
        cy.request({
            method: 'PUT',
            url: '/professor/modify_appointments',
            body: {
                username: 'testuser',         // Existing professor username
                appointment_index: 1,               // Index of the appointment slot to cancel
                task: true,                         // Task is true for canceling the slot
                appointment_id: 2                // ID of the appointment to be deleted
            }
        }).then((response) => {
            // Ensure the response status is 200 and success message is returned
            expect(response.status).to.eq(200);
            expect(response.body.error).to.eq(false);
            expect(response.body.data).to.eq("appointments_updated");
        });
    });

    // Test for when the professor tries to cancel an appointment but the professor doesn't exist
    it('should return 404 if the professor is not found', () => {
        cy.request({
            method: 'PUT',
            url: 'professor/modify_appointments',
            body: {
                username: 'nonExistentProfessor', // Non-existent professor username
                appointment_index: 4,             // Index of the appointment slot to cancel
                task: true,                       // Task is true for canceling the slot
                appointment_id: 1234              // ID of the appointment to be deleted
            },
            failOnStatusCode: false  // Prevent Cypress from failing on 4xx/5xx status
        }).then((response) => {
            // Ensure the response status is 404 and appropriate error message is returned
            expect(response.status).to.eq(404);
            expect(response.body.error).to.eq(true);
            expect(response.body.data).to.eq('Professor not found');
        });
    });
});


