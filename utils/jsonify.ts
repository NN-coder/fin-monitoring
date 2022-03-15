import { Jsonify } from 'type-fest';

export function jsonify<T>(value: T): Jsonify<T> {
  return JSON.parse(JSON.stringify(value));
}
