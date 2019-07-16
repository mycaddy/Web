const navigationConfig = [
  {
    'id': 'golf-course',
    'title': '골프코스 관리',
    'type': 'collapse',
    'icon': 'golf_course',
    'url': '/apps/golf-course',
    'children': [
      {
        'id': 'golf-course-countries',
        'title': 'Countries',
        'type': 'item',
        'url': '/apps/golf-course/countries',
        'exact': true,
        'badge': {
          'title': '11,511',
          'bg'   : '#525E8A',
          'fg'   : '#FFFFFF'
        }
      },
      {
        'id': 'golf-course-clubs',
        'title': 'Clubs',
        'type': 'item',
        'url': '/apps/golf-course/clubs',
        'exact': true,
        'badge': {
          'title': '11,511',
          'bg'   : '#525E8A',
          'fg'   : '#FFFFFF'
        }
      },
      {
        'id': 'golf-course-courses',
        'title': 'Courses',
        'type': 'item',
        'url': '/apps/golf-course/courses',
        'exact': true,
        'badge': {
          'title': '11,511',
          'bg'   : '#525E8A',
          'fg'   : '#FFFFFF'
        }
      },
    ]
  },
  {
    'id': 'administrator',
    'title': '관리항목',
    'type': 'group',
    'icon': 'apps',
    'children': [
      {
        'id'   : 'club',
        'title': 'Club',
        'type' : 'item',
        'icon' : 'flag',
        'url'  : '/apps/club',
        'badge': {
            'title': '11,511',
            'bg'   : 'rgb(255, 111, 0)',
            'fg'   : '#FFFFFF'
        }
      },      
    ]
  },
];

export default navigationConfig;
