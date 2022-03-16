export const NAVIGATION: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'Dashboard',
    icon: 'fas fa-store-alt',
    exact: true,
    url: '/dashboard',
    module: 'DASHBOARD',
  },
  {
    title: 'My Applications',
    icon: 'fas fa-globe',
    exact: true,
    url: '/applications',
    module: 'WEB_POSITIONING',
  },
  {
    title: 'My documents',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/documents',
    module: 'TRANSACTION'
  },
  {
    title: 'My Ds',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/ds',
    module: 'PURCHASE'
  },
  {
    title: 'My Appointments',
    icon: 'far fa-handshake',
    exact: true,
    url: '',
    children: [
      {
        title: 'Video call',
        url: '/meet',
        exact: true,
        module: 'LEGAL'
      },
      {
        title: 'Get an Appointment',
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
    title: 'Dashboard',
    icon: 'fas fa-store-alt',
    exact: true,
    url: 'fas-dashboard',
    module: 'DASHBOARD',
  },
  {
    title: 'Applications',
    icon: 'fas fa-globe',
    exact: true,
    url: 'fas-applications',
    module: 'WEB_POSITIONING',
  },
  {
    title: 'Users',
    icon: 'fas fa-file-alt',
    exact: true,
    url: 'fas-users',
    module: 'TRANSACTION'
  },
  {
    title: 'Calendar',
    icon: 'far fa-calendar',
    exact: true,
    url: 'fas-calendar',
    module: 'LEGAL'
  }
];


