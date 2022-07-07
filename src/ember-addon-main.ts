import CustomComponents, { AppInstance, getCustomComponentsFromOptions } from './custom-components';

module.exports = {
  name: 'ember-google-maps-addon',

  included(this: any, parent: any) {
    this._super.included.apply(this, arguments);

    let appInstance: AppInstance = this._findHost();
    CustomComponents.for(appInstance)
      .add(parent.name, getCustomComponentsFromOptions(parent.options));
  },
};
