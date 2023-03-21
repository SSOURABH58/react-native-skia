import type { SkPoint, SkRect } from "@shopify/react-native-skia";
import { vec } from "@shopify/react-native-skia";

export const generateRectPoints = (rct: SkRect, numPoints = 10) => {
  const points: SkPoint[] = [];

  const horizontalSegmentLength = rct.width / (Math.ceil(numPoints / 4) - 1);
  const verticalSegmentLength = rct.height / (Math.ceil(numPoints / 4) - 1);

  let remainingPoints = numPoints;

  for (let i = 0; i < 4; i++) {
    const segmentPoints = Math.ceil(remainingPoints / (4 - i));
    remainingPoints -= segmentPoints;

    for (let j = 0; j < segmentPoints; j++) {
      let point: SkPoint;

      switch (i) {
        case 0:
          point = {
            x: rct.x + j * horizontalSegmentLength,
            y: rct.y,
          };
          break;
        case 1:
          point = {
            x: rct.x + rct.width,
            y: rct.y + j * verticalSegmentLength,
          };
          break;
        case 2:
          point = {
            x: rct.x + rct.width - j * horizontalSegmentLength,
            y: rct.y + rct.height,
          };
          break;
        case 3:
          point = {
            x: rct.x,
            y: rct.y + rct.height - j * verticalSegmentLength,
          };
          break;
        default:
          throw new Error("Invalid segment index");
      }

      points.push(point);
    }
  }
  return points;
};

export const generateEllipsePoints = (rct: SkRect, numPoints = 10) => {
  const a = rct.width / 2; // Semi-major axis (half of the rectangle's width)
  const b = rct.height / 2; // Semi-minor axis (half of the rectangle's height)
  const h = rct.x + a; // Center x-coordinate (half of the rectangle's width)
  const k = rct.y + b; // Center y-coordinate (half of the rectangle's height)
  const points: SkPoint[] = [];
  const tValues: number[] = Array.from(
    { length: numPoints },
    (_, i) => (2 * Math.PI * i) / numPoints
  );

  for (const t of tValues) {
    const x: number = h + a * Math.cos(t);
    const y: number = k + b * Math.sin(t);
    points.push(vec(x, y));
  }

  return points;
};

const catmullRomSpline = (
  p0: SkPoint,
  p1: SkPoint,
  p2: SkPoint,
  p3: SkPoint,
  t: number
) => {
  const t2 = t * t;
  const t3 = t2 * t;
  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);

  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

  return vec(x, y);
};

export const smoothPoints = (points: SkPoint[], splineResolution = 10) => {
  const result: SkPoint[] = [];
  const numPoints = points.length;
  for (let i = 0; i < numPoints; i++) {
    const p0 = points[(i - 1 + numPoints) % numPoints];
    const p1 = points[i];
    const p2 = points[(i + 1) % numPoints];
    const p3 = points[(i + 2) % numPoints];

    for (let j = 0; j < splineResolution; j++) {
      const t = j / splineResolution;
      const smoothedPoint = catmullRomSpline(p0, p1, p2, p3, t);
      result.push(smoothedPoint);
    }
  }

  return result;
};
