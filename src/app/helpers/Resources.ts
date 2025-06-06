import {computed, resource, ResourceOptions, ResourceRef, Signal} from '@angular/core';

export function computedResource<T>(options: ResourceOptions<any, {}>): Signal<T> {
  const res: ResourceRef<T> = resource(options);

  return computed(() => res.asReadonly().value())
}
