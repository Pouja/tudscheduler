const _ = require('lodash');
module.exports = {
    '/categories/cd79039f-c1e3-4363-8a48-6e6124e06b94': {
    'GET': {
      'data': {
          categories: [
            {
            'catId': '9b6888d1-f07e-4ac8-bedd-7ed35acb67be',
            'courses': [
                '997dde1f-e186-4211-877c-28e7a6383809',
                'f3a2029d-4139-414f-93b5-f559b41d8cf5'
            ],
            'name': 'Common Core'
            },
            {
            'catId': '43c6c95b-be27-4dfa-a17f-7116154a4dae',
            'courses': [
                'f51f4bc7-8feb-445d-a6c9-b00116eb1f40',
                '5c93e57f-2e36-47fb-859c-6db3a467e3b0'
            ],
            'name': 'Specialisation'
            },
            {
            'catId': '06553695-88ef-4ab0-a296-be735310c00e',
            'courses': [
                '4df04641-5c10-49da-aea1-21a2ec07163d'
            ],
            'name': 'Homologation'
            },
            {
            'catId': '6adcbfcd-7891-4c39-a99d-46c9499bed1e',
            'courses': [
                'c6a92674-279d-44ab-b541-91ee99c56e76'
            ],
            'name': 'Free Electives'
            },
            {
            'catId': '0aa8e645-3801-4ee9-9a55-e4909dcfe4f4',
            'courses': [
                'fdd43aa1-5efe-4ab1-b943-05d3347c0703'
            ],
            'name': 'Seminar or Survey'
            },
            {
            'catId': 'unlisted',
            'courses': [],
            'name': 'Add to study planning'
            }],
            years: [{
                year: 2016,
                courses: ['fdd43aa1-5efe-4ab1-b943-05d3347c0703',
                '997dde1f-e186-4211-877c-28e7a6383809',
                'f3a2029d-4139-414f-93b5-f559b41d8cf5']
            }, {
                year: 2017,
                courses: ['c6a92674-279d-44ab-b541-91ee99c56e76',
                '4df04641-5c10-49da-aea1-21a2ec07163d',
                'f51f4bc7-8feb-445d-a6c9-b00116eb1f40',
                '5c93e57f-2e36-47fb-859c-6db3a467e3b0']
            }]
        },
      'timeout': 250
    },
    'POST': {
      'data': [
        {
          'masterId': 'e4f7ee3d-3fb2-4e4c-ae64-7b61796c1211',
          'errors': _.sample([[
            'Need at least 75 ECTS in courses, currently 59 ECTS.'
          ],['You have 10 EC too much']])
        },
        {
          'catId': '9b6888d1-f07e-4ac8-bedd-7ed35acb67be',
          'errors': [
            'Requires 1 additional courses.'
          ]
        },
        {
          'catId': '9b6888d1-f07e-4ac8-bedd-7ed35acb67be',
          'errors': _.sample([[
            'Minimum 25 ECTS, currently 21 ECTS, add 4 additional ECTS.'
          ],[]])
        },
        {
          'courseId': '4df04641-5c10-49da-aea1-21a2ec07163d',
          'errors': [
            'This course is not allowed in Common Core.'
          ]
        }
      ]
    }
  }
};
