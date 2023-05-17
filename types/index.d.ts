declare type normalPropertyKey = string | number | symbol;

interface normalPropertyObject {
  [key: normalPropertyKey]: any;
}

type utilForEachCallFunction = (
  arg1: any,
  arg2: string | number,
  obj: normalPropertyObject | Array<unknown>
) => void;

type utilForEachEntryCallFunction = (arg1: any, arg2: unknown) => unknown;

type utilToFlatObjectFilter = (arg1: any, arg2: unknown) => boolean;
type utilToFlatObjectPropFilter = (
  arg1: any,
  arg2: unknown,
  arg3: unknown
) => boolean;

type reduceDescriptorsCallFunction = (
  descriptor: PropertyDescriptor,
  name: PropertyKey,
  obj: normalPropertyObject
) => boolean;
