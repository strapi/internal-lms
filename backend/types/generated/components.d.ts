import type { Schema, Attribute } from '@strapi/strapi';

export interface CoursesModules extends Schema.Component {
  collectionName: 'components_courses_modules';
  info: {
    displayName: 'Modules';
    icon: 'apps';
  };
  attributes: {
    status: Attribute.String;
    progress: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 100;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    module: Attribute.Relation<
      'courses.modules',
      'oneToOne',
      'api::module.module'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'courses.modules': CoursesModules;
    }
  }
}
