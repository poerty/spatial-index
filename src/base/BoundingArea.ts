export interface BoundingArea {
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
}

export const isUnitBoundingArea = (bounding_area: BoundingArea): boolean => {
  return bounding_area.max_x - bounding_area.min_x <= 1
    || bounding_area.max_y - bounding_area.min_y <= 1;
};
