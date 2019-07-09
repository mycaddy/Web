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
  {
    'id': 'e-commerce',
    'title': 'E-Commerce',
    'type': 'collapse',
    'icon': 'shopping_cart',
    'url': '/apps/e-commerce',
    'children': [
      {
        'id': 'e-commerce-products',
        'title': 'Products',
        'type': 'item',
        'url': '/apps/e-commerce/products',
        'exact': true
      },
      {
        'id': 'e-commerce-product-detail',
        'title': 'Product Detail',
        'type': 'item',
        'url': '/apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print',
        'exact': true
      },
      {
        'id': 'e-commerce-new-product',
        'title': 'New Product',
        'type': 'item',
        'url': '/apps/e-commerce/products/new',
        'exact': true
      },
      {
        'id': 'e-commerce-orders',
        'title': 'Orders',
        'type': 'item',
        'url': '/apps/e-commerce/orders',
        'exact': true
      },
      {
        'id': 'e-commerce-order-detail',
        'title': 'Order Detail',
        'type': 'item',
        'url': '/apps/e-commerce/orders/1',
        'exact': true
      }
    ]
  },
];

export default navigationConfig;
