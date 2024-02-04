export type ItemType<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/** Filter object properties by value type */
export type PickByValueType<T, ValueType> = {
  [k in keyof T as T[k] extends ValueType ? k : never]: T[k];
};

// export type ValueTypes<ObjType> = ObjType extends Record<infer _K, infer V>
// ? V // ObjType[K]
// : never;
