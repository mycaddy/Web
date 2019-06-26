const navigationConfig = [
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
  }
];

export default navigationConfig;
