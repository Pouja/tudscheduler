module.exports = {
    '/categories/1': {
        GET: {
            data: [{
                catId: 'unlisted',
                name: 'Selected courses',
                courses: [35297]
            }, {
                catId: 1,
                name: 'Compulsory',
                courses: []
            }, {
                name: "Specialisation",
                catId: 2,
                courses: []
            }, {
                name: 'Homolagation courses',
                catId: 3,
                courses: []
            }, {
                catId: 4,
                name: 'Free electives',
                courses: []
            }, {
                catId: 5,
                name: 'Seminar',
                courses: []
            }],
            timeout: 250
        }
    },
    '/categories/2': {
        GET: {
            data: [{
                catId: 'unlisted',
                name: 'Selected courses',
                courses: []
            }, {
                catId: 6,
                name: "Main core",
                courses: [54]
            }, {
                catId: 7,
                name: "Track core",
                courses: []
            }, {
                catId: 8,
                name: 'Free electives',
                courses: []
            }]
        }
    }
};
