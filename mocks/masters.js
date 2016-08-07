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
                        selected: true,
                        name: "Software Technology",
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
                },{
                    masterid: 2,
                    name: "Msc. Computer Engineering",
                    tracks: [{
                        trackid: 2,
                        year: "2015",
                        name: "Track core",
                        categories: [{
                            id: 6,
                            name: "Main core"
                        }, {
                            id: 7,
                            name: "Track core"
                        }, {
                            id: 8,
                            name: 'Free electives'
                        }]
                    }]
                }]
            }],
            timeout: 100
        }
    }
};
