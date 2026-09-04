export type AssessmentQuestion = { id: string; correctOption: string };
export type MatchCandidate = {
  userId: string;
  teaches: string[];
  learns: string[];
  verifiedSkills: string[];
  availabilityOverlap: number;
  trustScore: number;
};
export type MatchResult = MatchCandidate & { score: number; reasons: string[] };

export function calculateAssessmentScore(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
  passMark = 70
) {
  if (!questions.length)
    return { score: 0, correct: 0, total: 0, passed: false };
  const correct = questions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correctOption ? 1 : 0),
    0
  );
  const score = Math.round((correct / questions.length) * 100);
  return { score, correct, total: questions.length, passed: score >= passMark };
}

export function findReciprocalMatches(
  current: { userId: string; teaches: string[]; learns: string[] },
  candidates: MatchCandidate[]
): MatchResult[] {
  const currentTeaches = new Set(
    current.teaches.map(skill => skill.toLowerCase())
  );
  const currentLearns = new Set(
    current.learns.map(skill => skill.toLowerCase())
  );
  return candidates
    .filter(candidate => candidate.userId !== current.userId)
    .map(candidate => {
      const candidateTeaches = new Set(
        candidate.teaches.map(skill => skill.toLowerCase())
      );
      const candidateLearns = new Set(
        candidate.learns.map(skill => skill.toLowerCase())
      );
      const learnerOverlap = Array.from(currentLearns).filter(skill =>
        candidateTeaches.has(skill)
      ).length;
      const teacherOverlap = Array.from(currentTeaches).filter(skill =>
        candidateLearns.has(skill)
      ).length;
      const verified = Array.from(currentLearns).filter(skill =>
        candidate.verifiedSkills.map(item => item.toLowerCase()).includes(skill)
      ).length;
      const score = Math.min(
        100,
        learnerOverlap * 30 +
          teacherOverlap * 25 +
          verified * 15 +
          Math.round(candidate.availabilityOverlap * 0.1) +
          Math.round(candidate.trustScore * 0.1)
      );
      const reasons = [
        learnerOverlap > 0
          ? "They teach a skill you want to learn"
          : "Related learning interests",
        teacherOverlap > 0
          ? "They want something you can share"
          : "Compatible exchange direction",
        verified > 0
          ? "Teaching skill is verified"
          : "Profile is available for review",
      ];
      return { ...candidate, score, reasons };
    })
    .filter(candidate => candidate.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function canAccessConversation(
  userId: string,
  participantIds: string[],
  matchStatus: string
) {
  return (
    matchStatus === "accepted" &&
    participantIds.length === 2 &&
    participantIds.includes(userId)
  );
}

export function isCertificateEligible(input: {
  sessionStatus: string;
  participantConfirmations: number;
  requiredConfirmations: number;
  hasOpenDispute: boolean;
  alreadyIssued: boolean;
}) {
  return (
    input.sessionStatus === "ended" &&
    input.participantConfirmations >= input.requiredConfirmations &&
    !input.hasOpenDispute &&
    !input.alreadyIssued
  );
}
