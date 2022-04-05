export const NAVIGATION: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'SIDENAV.DASHBOARD',
    icon: 'fas fa-store-alt',
    exact: true,
    url: '/dashboard'},
  {
    title: 'SIDENAV.MY_APPS',
    icon: 'fas fa-globe',
    exact: true,
    url: '/applications'
  },
  {
    title: 'SIDENAV.MY_DOCS',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/documents'
  },
  {
    title: 'SIDENAV.MY_DS',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/ds'
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
      },
      {
        title: 'SIDENAV.APPOINTMENT',
        url: '/calendar',
        exact: true,
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
    url: '/fas-dashboard'
  },
  {
    title: 'SIDENAV.MY_APPS',
    icon: 'fas fa-globe',
    exact: true,
    url: '/fas-applications'
  },
  {
    title: 'SIDENAV.MY_DOCS',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/fas-documents'
  },
  {
    title: 'SIDENAV.MY_DS',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/fas-ds'
  },
  {
    title: 'SIDENAV.MY_APPOINTMENTS',
    icon: 'far fa-handshake',
    exact: true,
    url: '',
    children: [
      {
        title: 'SIDENAV.VIDEO',
        url: '/fas-meet',
        exact: true,
      },
      {
        title: 'SIDENAV.APPOINTMENT',
        url: '/fas-calendar',
        exact: true,
      }
    ]
  }
];


