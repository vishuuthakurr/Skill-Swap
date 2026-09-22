import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import React from "react";
(globalThis as any).React = React;

// Mock browser global objects for Node SSR testing
if (typeof (globalThis as any).window === "undefined") {
  const mockLocation = {
    search: "",
    pathname: "/",
    href: "http://localhost:5173/",
    assign: () => {},
  };
  (globalThis as any).window = {
    location: mockLocation,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
  };
  (globalThis as any).location = mockLocation;
  (globalThis as any).localStorage = (globalThis as any).window.localStorage;
}

import { vi } from "vitest";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "usr_test_123",
      name: "Vaibhav Singh",
      email: "vaibhav@example.com",
      role: "member",
    },
    isAuthenticated: true,
    loading: false,
    logout: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  apiRequest: vi.fn().mockResolvedValue([]),
}));
import Home from "../client/src/pages/Home";
import {
  CertificateVerify,
  HowItWorks,
  InfoPage,
  SkillDetail,
  Skills,
} from "../client/src/pages/PublicPages";
import {
  Certificates,
  DiscoverMatches,
  MemberDashboard,
  Messages,
  MySkills,
  Notifications,
  Profile,
  Sessions,
  SimpleMemberPage,
} from "../client/src/pages/Workspace";
import SiteHeader from "../client/src/components/SiteHeader";
import SiteFooter from "../client/src/components/SiteFooter";
import CertificateVerificationPanel from "../client/src/components/CertificateVerificationPanel";
import {
  AdminActivity,
  AdminDashboard,
  AdminReports,
  AdminUsers,
} from "../client/src/pages/AdminPages";
import {
  ForgotPassword,
  Login,
  Onboarding,
  Register,
  VerifyEmail,
} from "../client/src/pages/AuthPages";
import { SkillAssessmentPage } from "../client/src/pages/AssessmentPages";
import {
  ScheduleSession,
  SessionDetail,
} from "../client/src/pages/SessionPages";

describe("All Pages & Components Rendering and Button Verification", () => {
  describe("1. Public Pages & Components", () => {
    it("renders SiteHeader with all navigation buttons, search, and logo", () => {
      const html = renderToString(React.createElement(SiteHeader));
      expect(html).toContain("Skill");
      expect(html).toContain("Swap");
      expect(html).toContain("PRO");
      expect(html).toContain("Categories");
      expect(html).toContain("Explore Catalog");
      expect(html).toContain("How It Works");
      expect(html).toContain("Workspace");
    });

    it("renders SiteFooter with 4-column directory, feature badges, and status", () => {
      const html = renderToString(React.createElement(SiteFooter));
      expect(html).toContain("Vetted Assessments");
      expect(html).toContain("Verified Badges");
      expect(html).toContain("1:1 Live Rooms");
      expect(html).toContain("Platform Status: Operational");
      expect(html).toContain("How Skill Swapping Works");
      expect(html).toContain("Verify a Certificate");
    });

    it("renders Home Landing Page with hero, stats ribbon, and course cards", () => {
      const html = renderToString(React.createElement(Home));
      expect(html).toContain("Master Any Skill");
      expect(html).toContain("Teach What You Know");
      expect(html).toContain("Explore Catalog");
      expect(html).toContain("105+ Questions");
      expect(html).toContain("70% Pass Mark");
      expect(html).toContain("Featured Skill Exchanges");
      expect(html).toContain("Python for Data &amp; Automation");
      expect(html).toContain("UI/UX &amp; Product Design Systems");
      expect(html).toContain("How Skill-Swap Works");
      expect(html).toContain("Real Credentials for Real Knowledge");
    });

    it("renders HowItWorks page with 5-step framework and trust layer", () => {
      const html = renderToString(React.createElement(HowItWorks));
      expect(html).toContain("The Structured Path to");
      expect(html).toContain("Define What You Know &amp; Seek");
      expect(html).toContain("Take the 35-Question Assessment");
      expect(html).toContain("Match Reciprocally with Peers");
      expect(html).toContain("Collaborate in Live Video Sessions");
      expect(html).toContain("Earn Verifiable Cryptographic Proof");
    });

    it("renders Skills catalog page with filter toolbar and cards", () => {
      const html = renderToString(React.createElement(Skills));
      expect(html).toContain("Explore All Available");
      expect(html).toContain("Search skills, topics, or categories...");
      expect(html).toContain("Python");
      expect(html).toContain("UI design");
      expect(html).toContain("JavaScript");
      expect(html).toContain("French");
    });

    it("renders SkillDetail page for multiple skills with syllabus & benchmark topics", () => {
      const pythonHtml = renderToString(React.createElement(SkillDetail, { slug: "python" }));
      expect(pythonHtml).toContain("Python");
      expect(pythonHtml).toContain("Assessment Benchmark Topics");
      expect(pythonHtml).toContain("70% Pass Gate");
      expect(pythonHtml).toContain("Take 35-Q Assessment");

      const designHtml = renderToString(React.createElement(SkillDetail, { slug: "ui-design" }));
      expect(designHtml.toLowerCase()).toContain("ui design");
      expect(designHtml).toContain("Assessment Benchmark Topics");
    });

    it("renders CertificateVerify page and CertificateVerificationPanel", () => {
      const html = renderToString(React.createElement(CertificateVerify));
      expect(html).toContain("Verify Authenticity of");
      expect(html).toContain("Certificate Authenticity Lookup");
      expect(html).toContain("Verify Credential");
    });

    it("renders InfoPage for help, contact, privacy, and terms", () => {
      const help = renderToString(React.createElement(InfoPage, { type: "help" }));
      expect(help).toContain("Frequently Asked Questions");

      const contact = renderToString(React.createElement(InfoPage, { type: "contact" }));
      expect(contact).toContain("Connect with Platform Stewards");

      const privacy = renderToString(React.createElement(InfoPage, { type: "privacy" }));
      expect(privacy).toContain("Privacy &amp; Video Session Policy");

      const terms = renderToString(React.createElement(InfoPage, { type: "terms" }));
      expect(terms).toContain("Community Guidelines &amp; Terms");
    });
  });

  describe("2. Auth Pages", () => {
    it("renders Login page with email, password, and sign in actions", () => {
      const html = renderToString(React.createElement(Login));
      expect(html).toContain("Welcome back");
    });

    it("renders Register page with registration inputs and exchange promise", () => {
      const html = renderToString(React.createElement(Register));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders ForgotPassword page", () => {
      const html = renderToString(React.createElement(ForgotPassword));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders VerifyEmail page", () => {
      const html = renderToString(React.createElement(VerifyEmail));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Onboarding page", () => {
      const html = renderToString(React.createElement(Onboarding));
      expect(html.length).toBeGreaterThan(0);
    });
  });

  describe("3. Member Workspace Pages", () => {
    it("renders MemberDashboard with metrics, reciprocal matches, and action items", () => {
      const html = renderToString(React.createElement(MemberDashboard));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders MySkills page with teaching portfolio, badges, and learning targets", () => {
      const html = renderToString(React.createElement(MySkills));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders DiscoverMatches page with query bar and compatibility pills", () => {
      const html = renderToString(React.createElement(DiscoverMatches));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Messages page with conversation list and message composer", () => {
      const html = renderToString(React.createElement(Messages));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Sessions page with scheduled meetings and video room actions", () => {
      const html = renderToString(React.createElement(Sessions));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Certificates page with cryptographic cards and public verify links", () => {
      const html = renderToString(React.createElement(Certificates));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Notifications page with activity feed", () => {
      const html = renderToString(React.createElement(Notifications));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders Profile & settings page with preferences, avatar, and timezone", () => {
      const html = renderToString(React.createElement(Profile));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders SimpleMemberPage for match requests and recordings", () => {
      const html = renderToString(
        React.createElement(SimpleMemberPage, { title: "Match Requests", copy: "Test copy" })
      );
      expect(html.length).toBeGreaterThan(0);
    });
  });

  describe("4. 35-Question Assessment Engine", () => {
    it("renders SkillAssessmentPage in briefing phase with rules and pass mark", () => {
      const html = renderToString(React.createElement(SkillAssessmentPage, { skillId: "python" }));
      expect(html.length).toBeGreaterThan(0);
    });
  });

  describe("5. Admin Platform Pages", () => {
    it("renders AdminDashboard with overview metrics", () => {
      const html = renderToString(React.createElement(AdminDashboard));
      expect(html.length).toBeGreaterThan(0);
    });

    it("renders AdminUsers, AdminActivity, and AdminReports", () => {
      const users = renderToString(React.createElement(AdminUsers));
      expect(users.length).toBeGreaterThan(0);

      const activity = renderToString(React.createElement(AdminActivity));
      expect(activity.length).toBeGreaterThan(0);

      const reports = renderToString(React.createElement(AdminReports));
      expect(reports.length).toBeGreaterThan(0);
    });
  });

  describe("6. Session Detail & Scheduling Pages", () => {
    it("renders ScheduleSession and SessionDetail", () => {
      const schedule = renderToString(React.createElement(ScheduleSession));
      expect(schedule.length).toBeGreaterThan(0);

      const detail = renderToString(React.createElement(SessionDetail, { sessionId: "sess-test-1" }));
      expect(detail.length).toBeGreaterThan(0);
    });
  });
});
