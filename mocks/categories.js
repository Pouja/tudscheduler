const _ = require('lodash');
module.exports = {
    "/categories/1": {
        "GET": {
            "data": [{
                "catId": "unlisted",
                "name": "Selected courses",
                "courses": [35297]
            }, {
                "catId": 1,
                "name": "Compulsory",
                "courses": []
            }, {
                "name": "Specialisation",
                "catId": 2,
                "courses": []
            }, {
                "name": "Homolagation courses",
                "catId": 3,
                "courses": []
            }, {
                "catId": 4,
                "name": "Free electives",
                "courses": []
            }, {
                "catId": 5,
                "name": "Seminar",
                "courses": []
            }],
            "timeout": 250
        },
        "POST": {
            "data": [{
                "catId": 3,
                "errors": _.sample([["More ects needed", "You have too many courses"],["a different error!"]])
            }, {
                "courseId": 35297,
                "errors": ["Not allowed here", "Some other meaningless error"]
            }, {
                "courseId": 37836,
                "errors": ["Why am I doing this course"]
            }, {
                "courseId": 35723,
                "errors": ["Testing some long ass error statement for a long course something"]
            }, {
                "catId": 5,
                "errors": ["I have no idea what", "I am ding dong dung"]
            }, {
                "masterId": 3,
                "errors": _.sample([["Max 100 ECTs for this master"],["Max 10 ECTS"]])
            }, {
                "trackId": 1,
                "errors": ["Invalid track, just kidding"]
            }]
        }
    },
    "/categories/2": {
        "GET": {
            "data": [{
                "catId": "unlisted",
                "name": "Selected courses",
                "courses": []
            }, {
                "catId": 6,
                "name": "Main core",
                "courses": [54]
            }, {
                "catId": 7,
                "name": "Track core",
                "courses": []
            }, {
                "catId": 8,
                "name": "Free electives",
                "courses": []
            }]
        }
    }
};
