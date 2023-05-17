const { toString: _toString } = Object.prototype;
const { getPrototypeOf } = Object;

const hasOwnProperty = (
  ({ hasOwnProperty }) =>
  (obj: object, prop: any) =>
    hasOwnProperty.call(obj, prop)
)(Object.prototype);

const kindOf = ((cache) => (thing: any) => {
  const str = _toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type: string) => {
  type = type.toLowerCase();
  return (thing: any) => kindOf(thing) === type;
};

const typeOfTest = (type: string) => (thing: any) => typeof thing === type;

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest("string");

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest("number");

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = (thing: unknown) => thing === true || thing === false;

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest("Date");

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest("File");

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest("Blob");

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest("FileList");

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val: any) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing: any) => {
  let kind;
  return (
    thing &&
    ((typeof FormData === "function" && thing instanceof FormData) ||
      (isFunction(thing.append) &&
        ((kind = kindOf(thing)) === "formdata" ||
          // detect form-data instance
          (kind === "object" &&
            isFunction(thing.toString) &&
            thing.toString() === "[object FormData]"))))
  );
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest("URLSearchParams");

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str: string) =>
  str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const { isArray } = Array;

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing: any) => thing !== null && typeof thing === "object";

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val: any) => {
  if (kindOf(val) !== "object") {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in val) &&
    !(Symbol.iterator in val)
  );
};

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest("undefined");

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest("function");

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val: any) {
  return (
    val !== null &&
    !isUndefined(val) &&
    val.constructor !== null &&
    !isUndefined(val.constructor) &&
    isFunction(val.constructor.isBuffer) &&
    val.constructor.isBuffer(val)
  );
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest("ArrayBuffer");

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val: any) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */

function forEach(
  obj: unknown,
  fn: utilForEachCallFunction,
  { allOwnKeys = false } = {}
) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== "object") {
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys
      ? Object.getOwnPropertyNames(obj)
      : Object.keys(obj as object);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(
        null,
        (obj as normalPropertyObject)[key],
        key,
        obj as normalPropertyObject
      );
    }
  }
}

function findKey(obj: object, key: string) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : global;
})();

const isContextDefined = (context: any) =>
  !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */

function merge(this: any, ...arg: any[]) {
  const { caseLess } = (isContextDefined(this) && this) || {};
  const result: normalPropertyObject = {};
  const assignValue = (val: unknown, key: unknown) => {
    const targetKey = (caseLess && findKey(result, key as string)) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arg.length; i < l; i++) {
    arg[i] && forEach(arg[i], assignValue);
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function bind(fn: Function, thisArg: unknown) {
  return function wrap(...argArray: any[]) {
    return fn.apply(thisArg, argArray);
  };
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (
  a: normalPropertyObject,
  b: normalPropertyObject,
  thisArg: unknown,
  { allOwnKeys = false } = {}
) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        a[key] = bind(val as Function, thisArg);
      } else {
        a[key] = val;
      }
    },
    { allOwnKeys }
  );
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content: string) => {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  superConstructor: Function,
  props: PropertyDescriptorMap,
  descriptors: PropertyDescriptorMap
) => {
  constructor.prototype = Object.create(
    superConstructor.prototype,
    descriptors
  );
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype,
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (
  sourceObj: normalPropertyObject,
  destObj: normalPropertyObject,
  filter: utilToFlatObjectFilter | boolean,
  propFilter?: utilToFlatObjectPropFilter
) => {
  let props;
  let i;
  let prop;
  const merged: normalPropertyObject = {};

  destObj = destObj || {};
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (
        (!propFilter || propFilter(prop, sourceObj, destObj)) &&
        !merged[prop]
      ) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (
    sourceObj &&
    (!filter || (filter as utilToFlatObjectFilter)(sourceObj, destObj)) &&
    sourceObj !== Object.prototype
  );

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (
  str: string,
  searchString: string,
  position: number | undefined
): boolean => {
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};

/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = <T>(thing: ArrayLike<T>) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
const isTypedArray = ((TypedArray) => {
  return (thing: unknown) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = <T>(
  obj: Iterable<T>,
  fn: utilForEachEntryCallFunction
) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, (pair as Array<unknown>)[0], (pair as Array<unknown>)[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp: RegExp, str: string) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest("HTMLFormElement");

const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    });
};

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest("RegExp");

/**
 * Descriptor used to filter objects
 * @param obj
 * @param reducer
 */
const reduceDescriptors = (
  obj: normalPropertyObject,
  reducer: reduceDescriptorsCallFunction
) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors: PropertyDescriptorMap = {};

  forEach(descriptors, (descriptor: PropertyDescriptor, name: PropertyKey) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj: normalPropertyObject) => {
  reduceDescriptors(
    obj,
    (descriptor: PropertyDescriptor, name: PropertyKey) => {
      // skip restricted props in strict mode
      if (
        isFunction(obj) &&
        ["arguments", "caller", "callee"].indexOf(String(name)) !== -1
      ) {
        return false;
      }

      const value = obj[name];

      if (!isFunction(value)) return true;

      descriptor.enumerable = false;

      if ("writable" in descriptor) {
        descriptor.writable = false;
        return true;
      }

      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error(
            "Can not rewrite read-only method '" + String(name) + "'"
          );
        };
      }

      return true;
    }
  );
};

/**
 *
 * @param arrayOrString
 * @param delimiter
 * @returns
 */
const toObjectSet = (arrayOrString: unknown, delimiter: string) => {
  const obj: normalPropertyObject = {};

  const define = (arr: unknown[]) => {
    arr.forEach((value) => {
      obj[value as string] = true;
    });
  };

  isArray(arrayOrString)
    ? define(arrayOrString)
    : define(String(arrayOrString).split(delimiter));

  return obj;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const toFiniteNumber = (value: number, defaultValue: unknown) => {
  return Number.isFinite(value) ? value : defaultValue;
};
/**
 * Randomly generate a string
 */
const ALPHA = "abcdefghijklmnopqrstuvwxyz";

const DIGIT = "0123456789";

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT,
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[(Math.random() * length) | 0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing: normalPropertyObject) {
  return !!(
    thing &&
    isFunction(thing.append) &&
    thing[Symbol.toStringTag] === "FormData" &&
    thing[Symbol.iterator]
  );
}

/**
 * Generate JSON from objects
 * @param obj
 * @returns
 */
const toJSONObject = (obj: unknown) => {
  const stack = new Array(10);

  const visit = (source: unknown, i: number) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if (!("toJSON" in (source as normalPropertyObject))) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) &&
            ((target as normalPropertyObject)[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest("AsyncFunction");

const isThenable = (thing: Promise<unknown>) =>
  thing &&
  (isObject(thing) || isFunction(thing)) &&
  isFunction(thing.then) &&
  isFunction(thing.catch);

export default {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
};
