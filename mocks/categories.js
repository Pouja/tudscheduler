module.exports = {
    '/categories': {
        GET: {
            data: [{
                id: 'unlisted',
                name: 'Selected courses',
                courses: [35297]
            }, {
                id: 1,
                name: 'Compulsory',
                courses: []
            }, {
                name: "Specialisation",
                id: 2,
                courses: []
            }, {
                name: 'Homolagation courses',
                id: 3,
                courses: []
            }, {
                id: 4,
                name: 'Free electives',
                courses: []
            }, {
                id: 5,
                name: 'Seminar',
                courses: []
            }],
            timeout: 250
        }
    }
};