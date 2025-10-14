import { Locator, Page, PlaywrightTestArgs } from "@playwright/test";
import { DestinationsSteps } from "../../step-definitions/ui/DestinationsSteps";
import { FooterSteps } from "../../step-definitions/ui/FooterSteps";
import { HomePageSteps } from "../../step-definitions/ui/HomePageSteps";
import { HumanSpaceflightSteps } from "../../step-definitions/ui/HumanSpaceflightSteps";
import { SharedPageSteps } from "../../step-definitions/ui/SharedPageSteps";
import { HomePage } from "../ui/HomePage";
import { HumanSpaceflightPage } from "../ui/HumanSpaceflightPage";
import { AccessibilitySteps } from "../../step-definitions/ui/AccessibilitySteps";
import { MediaCarouselSteps } from "../../step-definitions/ui/MediaCarouselSteps";
import { OurMissionsSteps } from "../../step-definitions/ui/OurMissionsSteps";
import { PerformanceSeoSteps } from "../../step-definitions/ui/PerformanceSeoSteps";
import { ResponsiveDesignSteps } from "../../step-definitions/ui/ResponsiveDesignSteps";
import { TheSuitesSteps } from "../../step-definitions/ui/TheSuitesSteps";
import { TimelineSteps } from "../../step-definitions/ui/TimelineSteps";
import { VehiclesSteps } from "../../step-definitions/ui/VehiclesSteps";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { AboutPageSteps } from "../../step-definitions/ui/AboutPageSteps";
import { AboutPage } from "../ui/AboutPage";
import { CareersPage } from "../ui/CareersPage";
import { CareersSteps } from "../../step-definitions/ui/CareersSteps";
import { DragonPage } from "../ui/DragonPage";
import { DragonPageSteps } from "../../step-definitions/ui/DragonPageSteps";
import { Falcon9Page } from "../ui/Falcon9Page";
import { Falcon9PageSteps } from "../../step-definitions/ui/Falcon9PageSteps";

export type CoreRequirement = Element & Requirement;
export type CoreValue = Element & Value;
export type HotspotContent = CriticalContent & Requirement;
export type MetadataItem = Element & Content;
export type MissionMetric = Metric & Value;
export type RequirementMetric = Metric & Requirement;

export interface AccessibilityCompliance {
  [key: string]: string | number;
  contrast: string;
  textScaling: string;
  touchTargets: number;
  zoomSupport: string;
}

export interface AccessibilityStandard extends Requirement {
  Feature: string;
  "Success Criteria": string;
}

export interface AccessibilityStatus {
  announceChanges: boolean;
  hasAriaLabels: boolean;
  isKeyboardNavigable: boolean;
}

export interface AssetOptimization {
  CSS: string;
  Fonts: string;
  Images: string;
  JS: string;
}

export interface AssistiveTechRequirement {
  "Support Type": string;
}

export interface BoundingBox extends Position {
  height: number;
  width: number;
}

export interface CardAdaptation extends Element {
  Behavior: string;
}

export interface CardComponent {
  Component: string;
  "Required Content": string;
}

export interface CardsConsistency {
  hasConsistentHeight: boolean;
  hasConsistentWidth: boolean;
  hasUniformSpacing: boolean;
}

export interface CardSpacing {
  horizontal: boolean;
  vertical: boolean;
}

export interface CarouselResponsiveness {
  arePaginationDotsAccessible: boolean;
  areTouchTargetsSized: boolean;
  isFullWidth: boolean;
  isSingleSlide: boolean;
}

export interface ConsoleErrorFixture {
  consoleErrors: string[];
}

export interface Content {
  Content: string;
}

export interface CoreElement extends Element {
  Content?: string;
  Description?: string;
  State?: string;
}

export interface CriticalContent {
  "Content Type": string;
}

export interface CustomTestArgs
  extends PlaywrightTestArgs,
    BddFixtures,
    ConsoleErrorFixture {}

export interface DestinationInfo {
  Destination: string;
  "Element Type"?: string;
  Path?: string;
}

export interface DuplicateContentResult {
  duplicateParagraphs: number;
  totalParagraphs: number;
}

export interface EarthImageStyles {
  bottom: string;
  left: string;
  opacity: string;
  position: string;
  transform: string;
}

export interface Element {
  Element: string;
}

export interface ElementAccessibilityInfo {
  hasFocusIndicator: boolean;
  isFocusable: boolean;
  isOperable: boolean;
}

export interface FooterResponsiveness {
  areLinksTappable: boolean;
  isTextReadable: boolean;
  isVerticalLayout: boolean;
}

export interface HeadingExpectation extends Content {
  Count: string;
  Level: string;
}

export interface HeadingInfo {
  tag: string;
  text: string;
}

export interface HotspotDistribution {
  lower: number;
  upper: number;
}

export interface HotspotInteraction {
  Action: string;
  "Expected Result": string;
}

export interface HotspotRequirement extends Requirement {
  Specification: string;
}

export interface ImageInfo {
  format: string;
  hasSrcset: boolean;
  hasWebp: boolean;
  loading: string | null;
  size: number;
}

export interface InteractionPatterns {
  [key: string]: string | number | boolean;
  errorHandling: string;
  feedback: string;
  inputMethod: string;
  responseTime: number;
  visualCues: boolean;
}

export interface InteractiveState {
  State: string;
}

export interface LandmarkExpectation {
  Type: string;
}

export interface LayoutConsistency extends CoreRequirement {
  Measurement?: string;
}

export interface LayoutRequirement extends Element {
  Position: string;
}

export interface LayoutTransition {
  endState: string;
  startState: string;
  transition: string;
}

export interface LayoutTransitions {
  Grid: LayoutTransition;
  Navigation: LayoutTransition;
  Spacing: LayoutTransition;
  Typography: LayoutTransition;
}

export interface LinkInfo {
  href: string;
  text: string;
}

export interface MediaAccessibilityInfo {
  hasCaptions: boolean;
  hasControls: boolean;
  isKeyboardAccessible: boolean;
}

export interface MediaOptimization {
  "Media Type": string;
  Optimization: string;
}

export interface MediaStandard extends CoreRequirement {
  Validation?: string;
}

export interface MediaTile {
  "Media Type"?: string;
  Title: string;
  Type?: string;
}

export interface Metric {
  Metric: string;
}

export interface Milestone {
  achievement: string;
  year: string;
}

export interface MissionTab {
  Order: string;
  "Tab Name": string;
}

export interface MobileAction {
  Action: string;
  Verification: string;
}

export interface MobileOptimizationResult {
  noInterstitials: boolean;
  textReadable: boolean;
  touchTargetsSize: boolean;
}

export interface MobileRequirements {
  contentFlow: string;
  layout: string;
  textSize: number;
  touchTargets: number;
}

export interface MobileResponsiveness {
  areArrowsSized: boolean;
  areDotsTappable: boolean;
  isFullWidth: boolean;
}

export interface NavigationLink {
  "Primary Links": string;
  "Secondary Elements": string;
}

export interface NavigationMethod {
  "Expected Behavior": string;
  Method: string;
}

export interface NavigationRequirement {
  Form?: string;
  "Page Title"?: string;
  URL?: string;
}

export interface PerformanceMetric extends RequirementMetric {
  Priority: string;
}

export interface PerformanceMetrics {
  animationFps?: number;
  cls?: number;
  fcp?: number;
  fid?: number;
  imageLoading?: string;
  lcp?: number;
  resizeResponse?: number;
  ttfb?: number;
}

export interface PerformanceTarget extends Metric {
  Priority: string;
  Target: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Requirement {
  Requirement: string;
}

export interface ResearchEmphasis {
  Aspect: string;
  Details: string;
}

export interface ResourceInfo {
  cacheControl?: string;
  protocol: string;
  size: number;
  status: number;
  transferSize: number;
  type: string;
  url: string;
}

export interface ResourceOptimization {
  "Optimization Strategy": string;
  "Resource Type": string;
  Validation?: string;
}

export interface ResponsiveChecks {
  [key: string]: boolean;
  hasHorizontalScroll: boolean;
  isContentSingleColumn: boolean;
  textZoomRequired: boolean;
  touchTargetsSized: boolean;
}

export interface ResponsiveImages {
  hasLazyLoading: boolean;
  hasSizes: boolean;
  hasSrcset: boolean;
  preservesAspectRatio: boolean;
}

export interface SectionAdaptation {
  areButtonsTappable: boolean;
  isContentReadable: boolean;
  isLayoutAdapted: boolean;
}

export interface SharedContext {
  apiData: any;
  currentFocusedElement?: Locator | null;
  initialViewport?: Partial<BoundingBox>;
  mediaType?: string;
  newPage?: Page;
  newTabPromise?: Promise<Page>;
  performanceMetrics?: any;
  startTime: number;
}

export interface SocialMediaTag {
  Platform: string;
}

export interface SpacingRequirement {
  "Spacing Type": string;
}

export interface StateChange extends Element {
  "State Change": string;
}

export interface StyleRequirement {
  "Style Element": string;
}

export interface StructureCheck extends Element {
  "Default Tab"?: string;
}

export interface SuitInfo {
  "Required Information": string;
  "Suit Type": string;
}

export interface TabletLayout {
  areElementsAccessible: boolean;
  areImagesProperlySize: boolean;
  hasAppropriateColumns: boolean;
}

export interface TextReadability {
  hasNoOverflow: boolean;
  hasSufficientContrast: boolean;
  isTextReadable: boolean;
  isYearVisible: boolean;
}

export interface TextScenario extends Requirement {
  Scenario: string;
  Validation?: string;
}

export interface TypographyRequirement extends Element {
  "Contrast Requirements": string;
  "Font Properties": string;
}

export interface Value {
  Value: string;
}

export interface VehicleCard {
  description: string;
  learnMoreLink: string;
  title: string;
}

export interface VisualStandard extends CoreRequirement {
  Details?: string;
}

export type TwoColumnTable =
  | any[]
  | { Role: string; Detail: string }[]
  | { MilestoneCategory: string; Detail: string }[];
export type AchievementTable = {
  "Achievement Metric": string;
  "Value Format": string;
}[];
export type FacilityTable = { "Facility Name": string; "Location/Purpose": string }[];
export type InitiativeTable = { "Initiative Focus": string; Detail: string }[];
export type PartnershipTable = { "Partner Type": string; "Example Detail": string }[];
export type DivisionTable = { "Division Name": string; "Primary Focus": string }[];
export type ResourceTable = { "Resource Name": string; Availability: string }[];
export type ValueTable = { "Core Value": string; Status: string }[];
export type BenefitTable = { "Benefit Category": string; Status: string }[];
export type CategoryTable = { "Job Category": string; Status: string }[];
export type OptionTable = { "Work Option": string; Status: string }[];
export type DevTable = { "Development Opportunity": string; Status: string }[];
export type FAQTable = { "FAQ Topic": string; Status: string }[];
export type DracoSpecTable = {
  "Specification Field": string;
  "Value Detail": string;
}[];
export type MerlinSpecTable = { "Specification Field": string; "Value Detail": string }[];
export type ResponsiveRequirements = Record<string, string>;
export type AnyObject = Record<string, any>;

export interface BddFixtures {
  aboutPage: AboutPage;
  aboutPageSteps: AboutPageSteps;
  accessibilitySteps: AccessibilitySteps;
  careersPage: CareersPage;
  careersSteps: CareersSteps;
  destinationsSteps: DestinationsSteps;
  dragonPage: DragonPage;
  dragonPageSteps: DragonPageSteps;
  footerSteps: FooterSteps;
  homePage: HomePage;
  homePageSteps: HomePageSteps;
  humanSpaceflightPage: HumanSpaceflightPage;
  humanSpaceflightSteps: HumanSpaceflightSteps;
  falcon9Page: Falcon9Page; 
  falcon9PageSteps: Falcon9PageSteps;
  mediaCarouselSteps: MediaCarouselSteps;
  ourMissionsSteps: OurMissionsSteps;
  performanceSeoSteps: PerformanceSeoSteps;
  responsiveDesignSteps: ResponsiveDesignSteps;
  theSuitesSteps: TheSuitesSteps;
  timelineSteps: TimelineSteps;
  vehiclesSteps: VehiclesSteps;
  sharedContext: SharedContext;
  sharedPageSteps: SharedPageSteps;
  assertionHelper: AssertionHelper;
  viewportUtility: ViewportUtility;
}