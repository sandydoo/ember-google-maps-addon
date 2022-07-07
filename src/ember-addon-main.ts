import CustomComponents, { AppInstance, getCustomComponentsFromOptions } from './custom-components';

export = {
  name: 'ember-google-maps-addon',

  included(this: any, parent: any) {
    this._super.included.apply(this, arguments);

    let appInstance: AppInstance = this._findHost();
    let config = appInstance.options['ember-google-maps'] || {};
    CustomComponents.for(appInstance)
      .useMergeTactic(config.mergeCustomComponents)
      .add(parent.name, getCustomComponentsFromOptions(parent.options));
  },
};
