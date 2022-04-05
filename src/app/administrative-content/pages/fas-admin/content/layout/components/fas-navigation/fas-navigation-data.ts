export const NAVIGATION: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'SIDENAV.DASHBOARD',
    icon: 'fas fa-store-alt',
    exact: true,
    url: '/dashboard',
    module: 'DASHBOARD',
  },
  {
    title: 'SIDENAV.MY_APPS',
    icon: 'fas fa-globe',
    exact: true,
    url: '/applications',
    module: 'WEB_POSITIONING',
  },
  {
    title: 'SIDENAV.MY_DOCS',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/documents',
    module: 'TRANSACTION'
  },
  {
    title: 'SIDENAV.MY_DS',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/ds',
    module: 'PURCHASE'
  },
  {
    title: 'SIDENAV.MY_APPOINTMENTS',
    icon: 'far fa-handshake',
    exact: true,
    url: '',
    children: [
      {
        title: 'SIDENAV.VIDEO',
        url: '/meet',
        exact: true,
        module: 'LEGAL'
      },
      {
        title: 'SIDENAV.APPOINTMENT',
        url: '/calendar',
        exact: true,
        module: 'LEGAL'
      }
    ]
  }
];


export const FASNAVIGATION: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'SIDENAV.DASHBOARD',
    icon: 'fas fa-store-alt',
    exact: true,
    url: 'fas-dashboard',
    module: 'DASHBOARD',
  },
  {
    title: 'SIDENAV.APPS',
    icon: 'fas fa-globe',
    exact: true,
    url: 'fas-applications',
    module: 'WEB_POSITIONING',
  },
  {
    title: 'SIDENAV.USERS',
    icon: 'fas fa-file-alt',
    exact: true,
    url: 'fas-users',
    module: 'TRANSACTION'
  },
  {
    title: 'SIDENAV.CALENDAR',
    icon: 'far fa-calendar',
    exact: true,
    url: 'fas-calendar',
    module: 'LEGAL'
  }
];


