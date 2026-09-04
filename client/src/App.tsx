import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import {
  CertificateVerify,
  HowItWorks,
  InfoPage,
  SkillDetail,
  Skills,
} from "./pages/PublicPages";
import {
  ForgotPassword,
  Login,
  Onboarding,
  Register,
  ResetPassword,
  VerifyEmail,
} from "./pages/AuthPages";
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
} from "./pages/Workspace";
import {
  AdminActivity,
  AdminDashboard,
  AdminManagement,
  AdminReports,
  AdminUsers,
} from "./pages/AdminPages";
import {
  ScheduleSession,
  LiveVideoSession,
  SessionDetail,
} from "./pages/SessionPages";
import { SkillAssessmentPage } from "./pages/AssessmentPages";
import NotFound from "./pages/NotFound";
import { FileCheck2, LockKeyhole } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/skills" component={Skills} />
      <Route path="/skills/:slug">
        {params => <SkillDetail slug={params.slug} />}
      </Route>
      <Route path="/verify-certificate" component={CertificateVerify} />
      <Route path="/about">
        <InfoPage type="contact" />
      </Route>
      <Route path="/help">
        <InfoPage type="help" />
      </Route>
      <Route path="/contact">
        <InfoPage type="contact" />
      </Route>
      <Route path="/privacy">
        <InfoPage type="privacy" />
      </Route>
      <Route path="/terms">
        <InfoPage type="terms" />
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/onboarding" component={Onboarding} />

      <Route path="/app/dashboard" component={MemberDashboard} />
      <Route path="/app/profile" component={Profile} />
      <Route path="/app/profile/edit" component={Profile} />
      <Route path="/app/my-skills" component={MySkills} />
      <Route path="/app/assessments/:skillId">
        {(params) => <SkillAssessmentPage skillId={params.skillId} />}
      </Route>
      <Route path="/app/assessments">
        {() => <SkillAssessmentPage skillId="python" />}
      </Route>
      <Route path="/app/matches/discover" component={DiscoverMatches} />
      <Route path="/app/matches/requests">
        <SimpleMemberPage
          title="Match requests"
          copy="See requests you have sent, received, accepted, declined, or let expire."
          icon={FileCheck2}
        />
      </Route>
      <Route path="/app/matches/:matchId">
        <SimpleMemberPage
          title="Match details"
          copy="A protected view of the shared skills, availability, and next steps for this exchange."
          icon={FileCheck2}
        />
      </Route>
      <Route path="/app/messages" component={Messages} />
      <Route path="/app/messages/:conversationId" component={Messages} />
      <Route path="/app/sessions" component={Sessions} />
      <Route path="/app/sessions/new" component={ScheduleSession} />
      <Route path="/app/sessions/:sessionId/live">
        {(params) => <LiveVideoSession sessionId={params.sessionId} />}
      </Route>
      <Route path="/app/sessions/:sessionId">
        {(params) => <SessionDetail sessionId={params.sessionId} />}
      </Route>
      <Route path="/app/certificates" component={Certificates} />
      <Route path="/app/recordings">
        <SimpleMemberPage
          title="Recordings"
          copy="Private recording references from completed exchanges, protected by signed Cloudinary access."
          icon={LockKeyhole}
        />
      </Route>
      <Route path="/app/notifications" component={Notifications} />
      <Route path="/app/settings" component={Profile} />
      <Route path="/app/help">
        <SimpleMemberPage
          title="Help & report"
          copy="Get support, report a concern, or review the safety guidance for thoughtful exchanges."
          icon={LockKeyhole}
        />
      </Route>

      <Route path="/admin/login" component={Login} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/users/:userId" component={AdminUsers} />
      <Route path="/admin/activity" component={AdminActivity} />
      <Route path="/admin/skills">
        <AdminManagement section="skills" />
      </Route>
      <Route path="/admin/questions">
        <AdminManagement section="skills" />
      </Route>
      <Route path="/admin/assessments">
        <AdminManagement section="assessments" />
      </Route>
      <Route path="/admin/matches">
        <AdminManagement section="matches" />
      </Route>
      <Route path="/admin/communications">
        <AdminManagement section="communications" />
      </Route>
      <Route path="/admin/sessions">
        <AdminManagement section="sessions" />
      </Route>
      <Route path="/admin/recordings">
        <AdminManagement section="recordings" />
      </Route>
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/certificates">
        <AdminManagement section="certificates" />
      </Route>
      <Route path="/admin/announcements">
        <AdminManagement section="announcements" />
      </Route>
      <Route path="/admin/support">
        <AdminManagement section="support" />
      </Route>
      <Route path="/admin/settings">
        <AdminManagement section="settings" />
      </Route>
      <Route path="/admin/audit-logs">
        <AdminManagement section="audit" />
      </Route>
      <Route path="/admin/profile">
        <AdminManagement section="settings" />
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
