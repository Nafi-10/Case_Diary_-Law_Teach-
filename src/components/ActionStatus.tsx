import { actionHighlight } from "../domain";
import { todayISO } from "../data/demo";

export function ActionStatus({ done, due }: { done: boolean; due: string }) {
  const state = actionHighlight(done, due, todayISO());
  return (
    <span className="record-status" data-tone={state.tone}>
      {state.label}
    </span>
  );
}
