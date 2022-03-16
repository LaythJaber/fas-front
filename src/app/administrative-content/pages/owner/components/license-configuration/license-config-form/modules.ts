export const MODULES: Module[] = [
  {label: 'Dashboard', value: 'DASHBOARD', selected: false},
  {
    label: 'SIDENAV.CONTACTS',
    value: 'CONTACTS',
    selected: false,
    children: [
      {label: 'SIDENAV.CLIENT', value: 'CLIENT', selected: false},
    ]
  },
  {
    label: 'SIDENAV.APP_MOBILE',
    value: 'APP_MOBILE',
    selected: false,
    children: [
      {label: 'SIDENAV.CONFIGURATIONS', value:'APP_MOBILE', selected: false},
    ]
  },
  {
    label: 'SIDENAV.PRODUCTS',
    value: 'PRODUCTS',
    selected: false,
    children: [
      {label: 'SIDENAV.EBAY_PRODUCT', value: 'EBAY_PRODUCT', selected: false},
      {label: 'SIDENAV.GOOGLE_MERCHANT_PRODUCT', value: 'GOOGLE_MERCHANT_PRODUCT', selected: false},
      {label: 'SIDENAV.AMAZON_PRODUCT', value: 'AMAZON_PRODUCT', selected: false},
      {label: 'SIDENAV.PRODUCT', value: 'PRODUCT', selected: false},
    ]
  },
  {
    label: 'SIDENAV.BLOG',
    value: 'BLOG',
    selected: false,
  },


  {
    label: 'SIDENAV.CART_MGM',
    value: 'CART_MGM',
    selected: false,
    children: [
      {label: 'SIDENAV.CART_MGM', value: 'CART_MGM', selected: false},
    ]
  },
  {
    label: 'SIDENAV.CONFIGURATION',
    value: 'CONFIGURATION',
    selected: false,
    children: [
      {label: 'SIDENAV.ADMINISTRATION', value: 'ADMINISTRATION', selected: false},
      {label: 'SIDENAV.PRODUCT_LINK', value: 'PRODUCT_LINK', selected: false},
       {label: 'SIDENAV.CAP', value: 'CAP_CONF', selected: false},
      {label: 'SIDENAV.CART_MGM', value: 'CART_MGM_CONF', selected: false},
      {label: 'SIDENAV.GENERAL_CONFIGURATION', value: 'GENERAL_CONFIGURATION', selected: false},
      {label: 'SIDENAV.COUPON', value: 'COUPON_CONF', selected: false},
      {label: 'SIDENAV.IMPORT', value: 'IMPORT_CONF', selected: false},
      {label: 'SIDENAV.LANGUAGE', value: 'LANGUAGE_CONF', selected: false},
      {label: 'SIDENAV.LOGIN_CONFIGURATION', value: 'LOGIN_CONFIGURATION', selected: false},
      {label: 'SIDENAV.PURCHASE', value: 'PURCHASE_CONF', selected: false},
      {label: 'SIDENAV.PAYMENT', value: 'PAYMENT_CONF', selected: false},
      {label: 'SIDENAV.PLUGIN', value: 'PLUGIN_CONF', selected: false},
      {label: 'SIDENAV.RETURN_PRODUCT', value: 'RETURN_PRODUCT_CONF', selected: false},
      {label: 'SIDENAV.SHIPMENT', value: 'SHIPMENT_CONF', selected: false},
      {label: 'SIDENAV.PAYMENT_TYPE', value: 'PAYMENT_TYPE_CONF', selected: false},
    ],
  },
  {
    label: 'SIDENAV.COUPON',
    value: 'COUPON',
    selected: false,
    children: [
      {label: 'SIDENAV.COUPON', value: 'COUPON', selected: false},
    ]
  },
  {
    label: 'Marketing',
    value: 'PROMOTION',
    selected: false,
    children: [
      {label: 'SIDENAV.PROMOTION', value: 'PROMOTION', selected: false},
    ]
  },
  {
    label: 'SIDENAV.MULTIMEDIA',
    value: 'MULTIMEDIA',
    selected: false,
    children: [
      {label: 'SIDENAV.HOME', value: 'HOME_SETTING', selected: false},
      {label: 'SIDENAV.INSCRIPTION', value: 'INSCRIPTION', selected: false},
      {label: 'SIDENAV.LOGIN', value: 'LOGIN', selected: false},
      {label: 'SIDENAV.THEME', value: 'THEME', selected: false},
    ]
  },
  {
    label: 'SIDENAV.PURCHASE',
    value: 'PURCHASE',
    selected: false,
    children: [
      {label: 'SIDENAV.PURCHASE', value: 'PURCHASE', selected: false},
    ]
  },
  {
    label: 'SIDENAV.LEGAL',
    value: 'LEGAL',
    selected: false,
    children: [
      {label: 'SIDENAV.PAGE_1', value: 'PAGE_1', selected: false},
      {label: 'SIDENAV.PAGE_2', value: 'PAGE_2', selected: false},
      {label: 'SIDENAV.PAGE_3', value: 'PAGE_3', selected: false},
      {label: 'SIDENAV.COOKIES', value: 'COOKIES', selected: false},
      {label: 'SIDENAV.FAQ', value: 'FAQ', selected: false},
      {label: 'SIDENAV.SIZE_GUIDE', value: 'SIZE_GUIDE', selected: false},
    ]
  },
  {
    label: 'SIDENAV.WEB_POSITIONING',
    value: 'WEB_POSITIONING',
    selected: false,
    children: [
      {label: 'SIDENAV.HOME', value: 'WEB_POSITIONING', selected: false},
      {label: 'SIDENAV.ABOUT_US', value: 'WEB_POSITIONING', selected: false},
      {label: 'SIDENAV.CONTACT', value: 'WEB_POSITIONING', selected: false},
      {label: 'SIDENAV.INSCRIPTION', value: 'WEB_POSITIONING', selected: false},
      {label: 'SIDENAV.LOGIN', value: 'WEB_POSITIONING', selected: false},
      {label: 'SIDENAV.PRODUCTS', value: 'WEB_POSITIONING', selected: false},
    ]
  },
  {
    label: 'SIDENAV.RETURN_PRODUCT',
    value: 'RETURN_PRODUCT',
    selected: false,
    children: [
      {label: 'SIDENAV.RETURN_PRODUCT', value: 'RETURN_PRODUCT', selected: false},
    ]
  },
  {
    label: 'SIDENAV.TRANSACTION',
    value: 'TRANSACTION',
    selected: false,
    children: [
      {label: 'SIDENAV.TRANSACTION', value: 'TRANSACTION', selected: false},
    ]
  }
];

export class Module {
  label: string;
  value: string;
  selected: boolean;
  children?: Module[];
}
