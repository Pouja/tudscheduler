module.exports = {
    '/masters': {
        GET: {
            data: [{
                facultyId: 1,
                name: 'EWI',
                masters: [{
                    masterid: 3,
                    name: "cs",
                    tracks: [{
                        trackid: 1,
                        year: "2015",
                        name: "ST",
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
            }],
            timeout: 100
        }
    }
}
