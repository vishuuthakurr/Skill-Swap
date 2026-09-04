import { describe, expect, it } from "vitest";
import {
  canAccessConversation,
  isCertificateEligible,
} from "../shared/skillSwap";

describe("Skill-Swap lifecycle invariants", () => {
  it("requires both participants before a completed certificate", () => {
    expect(
      isCertificateEligible({
        sessionStatus: "ended",
        participantConfirmations: 1,
        requiredConfirmations: 2,
        hasOpenDispute: false,
        alreadyIssued: false,
      })
    ).toBe(false);
    expect(
      isCertificateEligible({
        sessionStatus: "ended",
        participantConfirmations: 2,
        requiredConfirmations: 2,
        hasOpenDispute: false,
        alreadyIssued: false,
      })
    ).toBe(true);
  });

  it("never grants conversation access to a third user or pending match", () => {
    expect(
      canAccessConversation("member-a", ["member-a", "member-b"], "accepted")
    ).toBe(true);
    expect(
      canAccessConversation("member-c", ["member-a", "member-b"], "accepted")
    ).toBe(false);
    expect(
      canAccessConversation("member-a", ["member-a", "member-b"], "sent")
    ).toBe(false);
  });
});
