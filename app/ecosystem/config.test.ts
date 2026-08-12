import assert from "node:assert/strict";
import test from "node:test";
import { pagesBySurface, surfaceIds, surfaceMeta } from "./config";

test("master specification surface counts are complete", () => {
  assert.equal(pagesBySurface.patient.length, 28);
  assert.equal(pagesBySurface.clinic.length, 32);
  assert.equal(pagesBySurface.admin.length, 16);
  assert.equal(pagesBySurface.annotation.length, 10);
  assert.equal(pagesBySurface.engage.length, 7);
});

test("all product routes and specification IDs are unique", () => {
  const routes = surfaceIds.flatMap((surface) => pagesBySurface[surface].map((page) => `/${surface}/${page.slug}`));
  const ids = surfaceIds.flatMap((surface) => pagesBySurface[surface].map((page) => page.id));
  assert.equal(new Set(routes).size, routes.length);
  assert.equal(new Set(ids).size, ids.length);
});

test("each surface has a valid home route and safety copy", () => {
  for (const surface of surfaceIds) {
    assert.ok(pagesBySurface[surface].some((page) => page.slug === surfaceMeta[surface].homeSlug));
    for (const page of pagesBySurface[surface]) {
      assert.equal(page.features.length, 3);
      assert.ok(page.description.length > 20);
    }
  }
});
