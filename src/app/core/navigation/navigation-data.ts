export const NAVIGATION: any[] = [
  {
    heading: true,
    title: 'MENU'
  },
  {
    title: 'Dashboard',
    icon: 'fas fa-store-alt',
    exact: true,
    url: '/dashboard'},
  {
    title: 'My Applications',
    icon: 'fas fa-globe',
    exact: true,
    url: '/applications'
  },
  {
    title: 'My documents',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/documents'
  },
  {
    title: 'My Ds',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/ds'
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
      },
      {
        title: 'Get an Appointment',
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
    title: 'Dashboard',
    icon: 'fas fa-store-alt',
    exact: true,
    url: '/fas-dashboard'
  },
  {
    title: 'My Applications',
    icon: 'fas fa-globe',
    exact: true,
    url: '/fas-applications'
  },
  {
    title: 'My documents',
    icon: 'fas fa-file-alt',
    exact: true,
    url: '/fas-documents'
  },
  {
    title: 'My Ds',
    icon: 'fab fa-artstation',
    exact: true,
    url: '/fas-ds'
  },
  {
    title: 'My Appointments',
    icon: 'far fa-handshake',
    exact: true,
    url: '',
    children: [
      {
        title: 'Video call',
        url: '/fas-meet',
        exact: true,
      },
      {
        title: 'Get an Appointment',
        url: '/fas-calendar',
        exact: true,
      }
    ]
  }
];


