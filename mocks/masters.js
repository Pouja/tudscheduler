module.exports = {
    '/masters': {
        GET: {
            data: [{
                facultyId: 1,
                name: 'EWI',
                masters: [{
                    masterId: 3,
                    name: "Msc. Computer Science",
                    tracks: [{
                        trackId: 1,
                        year: "2015",
                        selected: true,
                        name: "Software Technology",
                    }]
                },{
                    masterId: 2,
                    name: "Msc. Computer Engineering",
                    tracks: [{
                        trackId: 2,
                        year: "2015",
                        name: "Track core"
                    }]
                }]
            }],
            timeout: 100
        }
    }
};
