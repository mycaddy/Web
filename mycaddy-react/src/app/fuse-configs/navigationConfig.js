const navigationConfig = [
  {
    'id': 'applications',
    'title': 'Applications',
    'type': 'group',
    'icon': 'apps',
    'children': [
      {
        'id': 'example-component',
        'title': 'Example',
        'type': 'item',
        'icon': 'whatshot',
        'url': '/example'
      },
      {
        'id'   : 'todo',
        'title': 'To-Do',
        'type' : 'item',
        'icon' : 'check_box',
        'url'  : '/apps/todo',
        'badge': {
            'title': 3,
            'bg'   : 'rgb(255, 111, 0)',
            'fg'   : '#FFFFFF'
        }
    },
    ]
  }
];

export default navigationConfig;
