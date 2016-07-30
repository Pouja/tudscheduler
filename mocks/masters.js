module.exports = {
    '/masters': {
        GET: {
            data: [{
                facultyid: 1,
                name: 'EWI',
                masters: [{
                    masterid: 3,
                    name: "Msc. Computer Science",
                    tracks: [{
                        trackid: 1,
                        year: "2015",
                        name: "Software Technology",
                        selected: "true",
                        categories: [{
                            id: 1,
                            name: "compulsory"
                        }, {
                            id: 2,
                            name: "Specialisation"
                        }, {
                            id: 3,
                            name: 'Homolagation courses'
                        }, {
                            id: 4,
                            name: 'Free electives'
                        }, {
                            id: 5,
                            name: 'Seminar'
                        }]
                    }]
                }]
            }, {
                facultyid: 2,
                name: 'AWE',
                masters: []
            }],
            timeout: 100
        }
    }
};
