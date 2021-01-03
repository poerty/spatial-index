import { BaseAgent } from './Agent';

export abstract class SpatialIndex<T extends BaseAgent, U> {
  public add(agent: T): boolean {
    return true;
  }

  public remove(agent: T): boolean {
    return true;
  }

  // public change(agent: T): boolean {
  //   return true;
  // }

  // public clean(agent: T): boolean {
  //   return true;
  // }

  public search(search_args: U): T[] {
    return [];
  }

  // public getPossibleCollisionList(): Array<[T, T]> {
  //   return [];
  // }
}
