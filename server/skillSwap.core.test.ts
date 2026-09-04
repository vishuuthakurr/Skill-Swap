import { describe, expect, it } from "vitest";
import {
  calculateAssessmentScore,
  canAccessConversation,
  findReciprocalMatches,
  isCertificateEligible,
} from "../shared/skillSwap";

describe("Skill-Swap assessment scoring", () => {
  it("scores on server-known answers and applies the pass mark", () => {
    const result = calculateAssessmentScore(
      [
        { id: "q1", correctOption: "a" },
        { id: "q2", correctOption: "b" },
        { id: "q3", correctOption: "c" },
      ],
      { q1: "a", q2: "b", q3: "x" },
      65
    );
    expect(result).toMatchObject({
      score: 67,
      correct: 2,
      total: 3,
      passed: true,
    });
  });

  it("does not pass an empty assessment", () => {
    expect(calculateAssessmentScore([], {}, 0).passed).toBe(false);
  });
});

describe("Skill-Swap reciprocal matching", () => {
  it("returns explainable candidates with reciprocal skills first", () => {
    const results = findReciprocalMatches(
      { userId: "me", teaches: ["Python"], learns: ["Photography"] },
      [
        {
          userId: "good",
          teaches: ["Photography"],
          learns: ["Python"],
          verifiedSkills: ["Photography"],
          availabilityOverlap: 80,
          trustScore: 90,
        },
        {
          userId: "one-way",
          teaches: ["Photography"],
          learns: ["Cooking"],
          verifiedSkills: ["Photography"],
          availabilityOverlap: 40,
          trustScore: 40,
        },
        {
          userId: "me",
          teaches: ["Photography"],
          learns: ["Python"],
          verifiedSkills: ["Photography"],
          availabilityOverlap: 100,
          trustScore: 100,
        },
      ]
    );
    expect(results[0]?.userId).toBe("good");
    expect(results[0]?.reasons).toContain(
      "They teach a skill you want to learn"
    );
    expect(results).not.toContainEqual(
      expect.objectContaining({ userId: "me" })
    );
  });
});

describe("Skill-Swap access and certificates", () => {
  it("allows only accepted two-person conversation participants", () => {
    expect(canAccessConversation("a", ["a", "b"], "accepted")).toBe(true);
    expect(canAccessConversation("c", ["a", "b"], "accepted")).toBe(false);
    expect(canAccessConversation("a", ["a", "b"], "pending")).toBe(false);
  });

  it("requires completion confirmations and no open dispute for a new certificate", () => {
    const base = {
      sessionStatus: "ended",
      participantConfirmations: 2,
      requiredConfirmations: 2,
      hasOpenDispute: false,
      alreadyIssued: false,
    };
    expect(isCertificateEligible(base)).toBe(true);
    expect(isCertificateEligible({ ...base, hasOpenDispute: true })).toBe(
      false
    );
    expect(isCertificateEligible({ ...base, alreadyIssued: true })).toBe(false);
  });
});
