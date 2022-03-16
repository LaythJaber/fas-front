export const TREE_DATA: FeatureNode[] = [
  {
    name: 'Customer Management',
    value: 'CUSTOMER_MANAGEMENT',
    children: [
      {name: 'View', value: 'CUSTOMER_MANAGEMENT_R'},
      {name: 'Manage', value: 'CUSTOMER_MANAGEMENT_W'}
    ]
  },
  {
    name: 'Company Management',
    value: 'COMPANY_MANAGEMENT',
    children: [
      {name: 'View', value: 'COMPANY_MANAGEMENT_R'},
      {name: 'Manage', value: 'COMPANY_MANAGEMENT_W'}
    ]
  },
  {
    name: 'Provider Management',
    value: 'PROVIDER_MANAGEMENT',
    children: [
      {name: 'View', value: 'PROVIDER_MANAGEMENT_R'},
      {name: 'Manage', value: 'PROVIDER_MANAGEMENT_W'}
    ]
  }
];



export const AUTHORITIES: Authority[] = [
  {
    label: 'Manage contact',
    value: 'MANAGE_CONTACT'
  },
  {
    label: 'Manage configuration',
    value: 'MANAGE_CONFIGURATION'
  },
  {
    label: 'Manage product',
    value: 'MANAGE_PRODUCT'
  },
  {
    label: 'Legal docs',
    value: 'LEGAL'
  },


];

export interface Authority {
  value: string;
  label: string;
  selected?: boolean;
}

export interface FeatureNode {
  name: string;
  value: string;
  children?: FeatureNode[];
  checked?: boolean;
  indeterminate?: boolean;
  expand?: boolean;
}
