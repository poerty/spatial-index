import { Agent } from './Agent';

export class SpatialIndex<T extends Agent = Agent> {
  public add(agent: T): boolean {
    return true;
  }

  public remove(agent: T): boolean {
    return true;
  }

  public change(agent: T): boolean {
    return true;
  }

  public clean(agent: T): boolean {
    return true;
  }

  public search(): T[] {
    return [];
  }
}
