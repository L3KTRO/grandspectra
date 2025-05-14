import {computed, resource, ResourceOptions, ResourceRef} from '@angular/core';

export function computedResource<T>(options: ResourceOptions<any, {}>) {
  const res: ResourceRef<T> = resource(options);

  return computed(() => res.asReadonly().value())
}
