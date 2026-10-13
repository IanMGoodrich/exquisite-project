import { describe, expect, it } from "vitest";
import { dueStage } from "./schedule";

const turnStartedAt = new Date("2026-01-01T00:00:00Z");
const hoursAfterStart = (hours: number) =>
  new Date(turnStartedAt.getTime() + hours * 60 * 60 * 1000);

describe("dueStage", () => {
  it("returns no stage before 24 hours", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(23), 0)).toBeNull();
  });

  it("returns stage 1 at 24 hours", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(24), 0)).toBe(1);
  });

  it("does not repeat a reminder stage that was already sent", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(30), 1)).toBeNull();
  });

  it("returns stage 2 at 3 days", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(72), 1)).toBe(2);
  });

  it("jumps to the highest overdue stage", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(120), 0)).toBe(2);
  });

  it("returns stage 3 at 8 days", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(192), 2)).toBe(3);
  });

  it("returns no stage after all reminders were sent", () => {
    expect(dueStage(turnStartedAt, hoursAfterStart(720), 3)).toBeNull();
  });
});