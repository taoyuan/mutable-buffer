import {BaseMutableBuffer} from './mbuf';

export class MutableBuffer extends BaseMutableBuffer {
  static readonly target = 'node';
  static Buffer = Buffer;
}
