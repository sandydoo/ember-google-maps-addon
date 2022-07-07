import get from 'lodash/get';
import { AppInstance as EmbroiderAppInstance } from '@embroider/shared-internals';

type GlobalSharedState = WeakMap<AppInstance, Map<string, ComponentDeclaration>>;
type MergeTactic = (customComponents: Map<any, any>) => ComponentDeclaration;
type ComponentDeclaration = { [key: string]: string };

export interface AppInstance extends EmbroiderAppInstance {
  name: string
}

/* global global */

function getGlobalStore() {
  let g = global as any as { __ember_google_maps_custom_components__: GlobalSharedState | undefined };
  if (!g.__ember_google_maps_custom_components__) {
    g.__ember_google_maps_custom_components__ = new WeakMap();
  }

  return g.__ember_google_maps_custom_components__;
}

export function getCustomComponentsFromOptions(options: ComponentDeclaration): ComponentDeclaration {
  return get(options, ['ember-google-maps', 'customComponents'], {});
}

export default class CustomComponents {
  static for(appInstance: AppInstance): CustomComponents {
    let globalStore = getGlobalStore();

    let customComponents = globalStore.get(appInstance) ?? new Map();

    if (!globalStore.has(appInstance)) {
      globalStore.set(appInstance, customComponents);
    }

    return new CustomComponents(appInstance.name, customComponents);
  }

  private hostAppName: string;
  private mergeTactic?: MergeTactic;
  private customComponents: Map<string, ComponentDeclaration>;

  constructor(hostAppName: string, customComponents: Map<string, ComponentDeclaration>) {
    this.hostAppName = hostAppName;
    this.customComponents = customComponents;
  }

  useMergeTactic(tactic: MergeTactic) {
    if (tactic && typeof tactic !== 'function') {
      throw new Error('mergeCustomComponents has to be a function');
    }

    this.mergeTactic = tactic;

    return this;
  }

  add(fromAddon: string, components: ComponentDeclaration) {
    this.customComponents.set(fromAddon, components);
    return this;
  }

  merge() {
    if (this.mergeTactic) {
      // TODO Verify that the output is correct?
      return this.mergeTactic(this.customComponents);
    }

    let mergedCustomComponents = {};
    for (let [addonName, customComponents] of this.customComponents) {
      // Skip the host app and add it in the end
      if (addonName === this.hostAppName) continue;
      Object.assign(mergedCustomComponents, customComponents);
    }

    // Give preference to the host app's custom components.
    let hostCustomComponents = this.customComponents.get(this.hostAppName);
    return Object.assign(mergedCustomComponents, hostCustomComponents);
  }
}
