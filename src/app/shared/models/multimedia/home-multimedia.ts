import {OtherOptionsTransInfo} from "./other-options-trans-info";

export interface HomeMultimedia {
  id: number;
  uuid: string;
  logo: string;
  favicon: string;
  cartIcon: string;
  productDefaultImage: string;
  categoryDefaultImage: string;
  couponDefaultImage: string;
  firstStepIcon: string;
  secondStepIcon: string;
  thirdStepIcon: string;
  carouselImages: CarouselImage[];
  serviceSectionDisplay: boolean;
  blogDisplay: boolean;
  parallaxDisplay: boolean;
  parallaxUrl: string;
  newsletterDisplay: boolean;
  socialIconsDisplay: boolean;
  paymentCardsDisplay: boolean;
  transInfo: OtherOptionsTransInfo[];
  storeInfo: {address; email; phone; fax;}
  secondarySlides: SecondarySlide[];
  brandsLogos: BrandLogo[];
}
export interface CarouselImage {
  id;
  link;
  url;
  index;
}
export interface SecondarySlide {
  active: boolean;
  id;
  imageUrl;
  index;
  categoryId;
}
export interface BrandLogo {
  id: number;
  uuid: string;
  logoUrl: string;
  brandId: number;
}
