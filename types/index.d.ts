declare type normalPropertyKey = string | number | symbol;

interface normalPropertyObject {
  [key: normalPropertyKey]: any;
}

interface likeArray {
  [key: normalPropertyKey]: any;
  readonly length:number
}
