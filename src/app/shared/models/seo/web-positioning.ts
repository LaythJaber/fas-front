export interface WebPositioning {
  page: PageType;
  robotsMetaTags: RobotsMetaTags[];
  metaTagsTrans: {id: number,
    langCodeId: number,
    langCode: string,
    title: string,
    description: string,
  }[];
}

export type PageType = 'HOME' |
  'ABOUT_US' |
  'CONTACT' |
  'INSCRIPTION' |
  'LOGIN' |
  'PRODUCTS' |
  'PAGE_1' |
  'PAGE_2' |
  'PAGE_3' |
  'COOKIES' |
  'FAQ';

export type RobotsMetaTags = 'index' |
  'noindex' |
  'none' |
  'follow' |
  'nofollow' |
  'noarchive' |
  'nosnippet' |
  'noodp' |
  'noydir' |
  'noimageindex';
