import _ from 'lodash';

/**
 * Consists of how each attribute should be parsed (pattern) and how the result should be mapped (fn);
 */
const queryMapper = {
    _: {
        fn: function(needle, course) {
                const lowerNeedle = needle.toLowerCase();
                return course.name.toLowerCase().indexOf(lowerNeedle) !== -1 ||
                    (!!course.courseName &&
                        course.courseName.toLowerCase().indexOf(lowerNeedle) !== -1);
        }
    },
    ec: {
        fn: function(ects, course) {
            return parseInt(ects, 10) === parseInt(course.ects, 10);
        },
        pattern: /ec:([0-9]+)\b/
    },
    period: {
        fn: function(periods, course) {
            if(course['Education Period'] === undefined) {
                return false;
            }
            return course['Education Period'].indexOf(periods) !== -1;
        }, 
        pattern: /period:\s?([0-9](\s*,[0-9])*)/
    }
};

/**
 * Converts the searchString to a query object bassed on queryMapper.
 * @param {String} searchString The search string to be tokenized
 * @return {Object} A tokenized object.
 */
function tokenize(searchString) {
    let query = {
        _: searchString
    };
    Object.keys(queryMapper)
        .filter(key => key !== '_')
        .forEach(function(key){
            const result = queryMapper[key].pattern.exec(searchString);
            if(result !== null) {
                query[key] = result[1];
                query._ = query._.replace(result[0], '').trim();
            }
        });
    return query;
}

/**
 * Applies the query object to the list of courses.
 * @param {Object} query as returned by tokenize.
 * @param {Array} courses The list of courses to filter based on the query object.
 * @return {Array} A list of courses which match the query object.
 */
function applyQuery(query, courses) {
    return courses.filter(function(course){
        return Object.keys(query).every(function(key){
            return queryMapper[key].fn(query[key], course);
        });
    });
}

/**
 * Searches through the courses based on the searchString.
 * @param {String} searchString the needle for the haystack (courses).
 * @param {Array} courses A list of courses.
 * @return {Array} A list of courses that match the searchString.
 */
function search(searchString, courses) {
    if(_.isEmpty(searchString)){
        return courses;
    }
    return applyQuery(tokenize(searchString), courses);
}

/**
 * Checks is the course has the needle.
 * @param {String} searchString The needle.
 * @param {Object} course The course object which is the haystack.
 * @return {boolean} true iff the searchString applies to the course object.
 */
function hasNeedle(searchString, course) {
    return search(searchString, [course]).length === 1;
}

module.exports.hasNeedle = hasNeedle;
module.exports.tokenize = tokenize;
module.exports.search = search;