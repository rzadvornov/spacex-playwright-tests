import { Locator, Page, PlaywrightTestArgs } from "@playwright/test";
import { DestinationsSteps } from "../../step-definitions/ui/humanspaceflight/DestinationsSteps";
import { FooterSteps } from "../../step-definitions/ui/humanspaceflight/FooterSteps";
import { SharedPageSteps } from "../../step-definitions/ui/SharedPageSteps";
import { MediaCarouselSteps } from "../../step-definitions/ui/humanspaceflight/MediaCarouselSteps";
import { OurMissionsSteps } from "../../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsSteps";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { ViewportUtility } from "../../utils/ViewportUtility";
import { AboutPageSteps } from "../../step-definitions/ui/AboutPageSteps";
import { CareersPageSteps } from "../../step-definitions/ui/CareersPageSteps";
import { DragonPageSteps } from "../../step-definitions/ui/DragonPageSteps";
import { Falcon9PageSteps } from "../../step-definitions/ui/Falcon9PageSteps";
import { FalconHeavyPageSteps } from "../../step-definitions/ui/FalconHeavyPageSteps";
import { MissionsSteps } from "../../step-definitions/ui/MissionsPageSteps";
import { RidesharePageSteps } from "../../step-definitions/ui/RidesharePageSteps";
import { StarshieldPageSteps } from "../../step-definitions/ui/starshield/StarshieldPageSteps";
import { UpdatesPageSteps } from "../../step-definitions/ui/UpdatesPageSteps";
import { AboutPage } from "../../services/ui/AboutPage";
import { CareersPage } from "../../services/ui/CareersPage";
import { DragonPage } from "../../services/ui/DragonPage";
import { Falcon9Page } from "../../services/ui/Falcon9Page";
import { FalconHeavyPage } from "../../services/ui/FalconHeavyPage";
import { HomePage } from "../../services/ui/HomePage";
import { HumanSpaceflightPage } from "../../services/ui/HumanSpaceflightPage";
import { MissionsPage } from "../../services/ui/MissionsPage";
import { RidesharePage } from "../../services/ui/RidesharePage";
import { StarshieldPage } from "../../services/ui/StarshieldPage";
import { StarshipPage } from "../../services/ui/StarshipPage";
import { SuppliersPage } from "../../services/ui/SuppliersPage";
import { UpdatesPage } from "../../services/ui/UpdatesPage";
import { HomePageCoreSteps } from "../../step-definitions/ui/home/HomePageCoreSteps";
import { HomePageInteractionSteps } from "../../step-definitions/ui/home/HomePageInteractionSteps";
import { HomePageMobileSteps } from "../../step-definitions/ui/home/HomePageMobileSteps";
import { HomePageNavigationSteps } from "../../step-definitions/ui/home/HomePageNavigationSteps";
import { HomePageTechnicalSteps } from "../../step-definitions/ui/home/HomePageTechnicalSteps";
import { AccessibilityMobileSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/AccessibilityMobileSteps";
import { FormAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/FormAccessibilitySteps";
import { KeyboardAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/KeyboardAccessibilitySteps";
import { MediaAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/MediaAccessibilitySteps";
import { NavigationAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/NavigationAccessibilitySteps";
import { ResponsiveAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveAccessibilitySteps";
import { ResponsiveCommonSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveCommonSteps";
import { ResponsiveComponentSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveComponentSteps";
import { ResponsiveImageSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveImageSteps";
import { ResponsiveInteractionSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveInteractionSteps";
import { ResponsiveLayoutSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveLayoutSteps";
import { ResponsiveNavigationSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveNavigationSteps";
import { ResponsiveTypographySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveTypographySteps";
import { ResponsiveViewportSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/ResponsiveViewportSteps";
import { SeoMetaTagsSteps } from "../../step-definitions/ui/humanspaceflight/accessibility/SeoMetaTagsSteps";
import { StructuralAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/StructuralAccessibilitySteps";
import { VisualElementAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/accessibility/VisualElementAccessibilitySteps";
import { OurMissionsContentSteps } from "../../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsContentSteps";
import { OurMissionsPerformanceSteps } from "../../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsPerformanceSteps";
import { OurMissionsTabSteps } from "../../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsTabSteps";
import { OurMissionsVisualSteps } from "../../step-definitions/ui/humanspaceflight/ourmissions/OurMissionsVisualSteps";
import { ContentSeoSteps } from "../../step-definitions/ui/humanspaceflight/performance/ContentSeoSteps";
import { ImageOptimizationSteps } from "../../step-definitions/ui/humanspaceflight/performance/ImageOptimizationSteps";
import { PerformanceMetricsSteps } from "../../step-definitions/ui/humanspaceflight/performance/PerformanceMetricsSteps";
import { ResponsivePerformanceSteps } from "../../step-definitions/ui/humanspaceflight/performance/ResponsivePerformanceSteps";
import { TheSuitesCoreSteps } from "../../step-definitions/ui/humanspaceflight/suites/TheSuitesCoreSteps";
import { TheSuitesHotspotSteps } from "../../step-definitions/ui/humanspaceflight/suites/TheSuitesHotspotSteps";
import { TheSuitesInteractionSteps } from "../../step-definitions/ui/humanspaceflight/suites/TheSuitesInteractionSteps";
import { TheSuitesVisualSteps } from "../../step-definitions/ui/humanspaceflight/suites/TheSuitesVisualSteps";
import { VehicleAccessibilitySteps } from "../../step-definitions/ui/humanspaceflight/vehicle/VehicleAccessibilitySteps";
import { VehicleBaseSteps } from "../../step-definitions/ui/humanspaceflight/vehicle/VehicleBaseSteps";
import { VehiclePerformanceSteps } from "../../step-definitions/ui/humanspaceflight/vehicle/VehiclePerformanceSteps";
import { HumanSpaceflightCoreSteps } from "../../step-definitions/ui/humanspaceflight/HumanSpaceflightCoreSteps";
import { HumanSpaceflightHeaderSteps } from "../../step-definitions/ui/humanspaceflight/HumanSpaceflightHeaderSteps";
import { HumanSpaceflightInteractionSteps } from "../../step-definitions/ui/humanspaceflight/HumanSpaceflightInteractionSteps";
import { HumanSpaceflightMobileSteps } from "../../step-definitions/ui/humanspaceflight/HumanSpaceflightMobileSteps";
import { HumanSpaceflightPerformanceSteps } from "../../step-definitions/ui/humanspaceflight/HumanSpaceflightPerformanceSteps";
import { StarshieldContentSteps } from "../../step-definitions/ui/starshield/StarshieldContentSteps";
import { StarshieldErrorHandlingSteps } from "../../step-definitions/ui/starshield/StarshieldErrorHandlingSteps";
import { StarshieldFormSteps } from "../../step-definitions/ui/starshield/StarshieldFormSteps";
import { StarshieldNavigationSteps } from "../../step-definitions/ui/starshield/StarshieldNavigationSteps";
import { StarshieldPerformanceSteps } from "../../step-definitions/ui/starshield/StarshieldPerformanceSteps";
import { StarshieldTechnicalSteps } from "../../step-definitions/ui/starshield/StarshieldTechnicalSteps";
import { StarshipBasicSteps } from "../../step-definitions/ui/starship/StarshipBasicSteps";
import { StarshipMissionsSteps } from "../../step-definitions/ui/starship/StarshipMissionsSteps";
import { StarshipPropulsionSteps } from "../../step-definitions/ui/starship/StarshipPropulsionSteps";
import { StarshipResponsiveSteps } from "../../step-definitions/ui/starship/StarshipResponsiveSteps";
import { SuppliersPageBasicSteps } from "../../step-definitions/ui/suppliers/SuppliersPageBasicSteps";
import { SuppliersPageRegistrationSteps } from "../../step-definitions/ui/suppliers/SuppliersPageRegistrationSteps";
import { SuppliersPageResourcesSteps } from "../../step-definitions/ui/suppliers/SuppliersPageResourcesSteps";
import { SuppliersPageTechnicalSteps } from "../../step-definitions/ui/suppliers/SuppliersPageTechnicalSteps";
import { TimelineContentSteps } from "../../step-definitions/ui/timeline/TimelineContentSteps";
import { TimelineCoreSteps } from "../../step-definitions/ui/timeline/TimelineCoreSteps";
import { TimelineNavigationSteps } from "../../step-definitions/ui/timeline/TimelineNavigationSteps";
import { TimelineResponsiveSteps } from "../../step-definitions/ui/timeline/TimelineResponsiveSteps";
import { TimelineVisualSteps } from "../../step-definitions/ui/timeline/TimelineVisualSteps";
import { HomePageMetadataSteps } from "../../step-definitions/ui/home/HomePageMetadataSteps";
import { StarlinkSteps } from "../../step-definitions/api/StarlinkSteps";
import { ShipsSteps } from "../../step-definitions/api/ShipsSteps";
import { APISharedSteps } from "../../step-definitions/api/APISharedSteps";
import { RocketsSteps } from "../../step-definitions/api/RocketsSteps";
import { RoadsterSteps } from "../../step-definitions/api/RoadsterSteps";

export type CoreRequirement = Element & Requirement;
export type CoreValue = Element & Value;
export type HotspotContent = CriticalContent & Requirement;
export type MetadataItem = Element & Content;
export type MissionMetric = Metric & Value;
export type RequirementMetric = Metric & Requirement;
export type PerformanceMetricResolver = (value: PerformanceMetrics) => void;

export interface MobileRequirement {
  Requirement: string;
}

export interface RequiredMobileOptimizationResult {
  textReadable: boolean | number;
  touchTargetsSize: boolean | number;
  noInterstitials: boolean | number;
  pageScaling: boolean | number;
}

export interface FilterStrategy {
  applyFilter(
    careersPage: CareersPage,
    value: string,
    additionalValue?: string
  ): Promise<void>;
}

export interface SpecVerificationStrategy {
  validate(spec: any): Promise<boolean>;
  getErrorMessage(spec: any): string;
}

export interface LayoutSpacingStyleValidator {
  validate(footer: HumanSpaceflightPage["footer"]): Promise<void>;
}

export interface InteractiveStateStrategy {
  validate(): Promise<void>;
}

export interface InputAccessibilityRequirement extends Requirement {
  Status: string;
}

export interface HomeCoreRequirementStrategy {
  validate(
    requirement: CoreRequirement,
    steps: HomePageCoreSteps
  ): Promise<void>;
}

export interface CriticalContentStrategy {
  validate(content: CriticalContent, steps: HomePageCoreSteps): Promise<void>;
}

export interface SpecValidationStrategy {
  validate(field: string, detail: string): Promise<boolean>;
}

export interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface ResourceTimingInfo {
  name: string;
  duration: number;
}

export interface UniquenessCheck {
  "Check Type": string;
}

export interface CoreRequirementStrategy {
  validate(requirement: CoreValue): Promise<void>;
}

export interface HeaderElementStrategy {
  validate(element: Element): Promise<void>;
}

export interface PerformanceMetricStrategy {
  validate(metric: RequirementMetric): Promise<void>;
}

export interface MetadataStrategy {
  validate(item: MetadataItem): Promise<void>;
}

export interface MobileActionStrategy {
  execute(action: MobileAction): Promise<void>;
}

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

export interface FormElementExpectation {
  "Element Type": string;
  "Label Type": string;
  Requirements: string;
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

export interface SortStrategy {
  verify(cards: Locator[]): Promise<void>;
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
  expectedPageTitle?: string;
  initialCursor?: string;
  testimonialCards?: Locator;
  selectedDepartment?: string;
  selectedType?: string;
  selectedVehicles?: string[];
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

export interface VisualElementExpectation {
  "Element Type": string;
  "Attribute Required": string;
  "Content Type": string;
}

export type TwoColumnTable =
  | any[]
  | { Role: string; Detail: string }[]
  | { MilestoneCategory: string; Detail: string }[];
export type AchievementTable = {
  "Achievement Metric": string;
  "Value Format": string;
}[];
export type FacilityTable = {
  "Facility Name": string;
  "Location/Purpose": string;
}[];
export type InitiativeTable = { "Initiative Focus": string; Detail: string }[];
export type PartnershipTable = {
  "Partner Type": string;
  "Example Detail": string;
}[];
export type DivisionTable = {
  "Division Name": string;
  "Primary Focus": string;
}[];
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
export type MerlinSpecTable = {
  "Specification Field": string;
  "Value Detail": string;
}[];
export type ResponsiveRequirements = Record<string, string>;
export type AnyObject = Record<string, any>;
export type TechnicalSpecTable = {
  Attribute: string;
  "Metric Value": string;
  "Imperial Value": string;
}[];

export type AttributeDetailTable = {
  Attribute: string;
  Detail: string;
}[];

export type RedirectionTable = {
  "Link Text": string;
  "Expected Path": string;
}[];

export type PerformanceTable = {
  Metric: string;
  "Max Value (ms)": string;
}[];

export type TechnicalRequirementsTable = {
  "Requirement Name": string;
  Status: string;
}[];

export type MetadataTable = {
  "Meta Name/Property": string;
  "Value Contains": string;
  Purpose: string;
}[];

export type MobileMenuTable = {
  "Behavior Check": string;
  "Expected Outcome": string;
}[];

export type RideshareSpecTable = {
  "Plate Configuration": string;
  "Bolt Pattern": string;
  "Included Mass": string;
}[];

export type DocumentationTable = {
  "Documentation Name": string;
  Status: string;
}[];

export type FalconSpecTable = {
  Attribute: string;
  Detail: string;
}[];

export interface Requirement {
  Requirement: string;
}

export interface HeadingExpectation {
  Level: string;
  Content: string;
  Count: string;
}

export interface LandmarkExpectation {
  Type: string;
  Role?: string;
}

export function parseAccessibilityRequirements(data: any[]): Requirement[] {
  return data.map((row) => ({
    Requirement: row["Requirement"] || row["requirement"],
  }));
}

export function parseHeadingExpectations(data: any[]): HeadingExpectation[] {
  return data.map((row) => ({
    Level: row["Level"] || row["level"],
    Content: row["Content"] || row["content"],
    Count: row["Count"] || row["count"],
  }));
}

export function parseLandmarkExpectations(data: any[]): LandmarkExpectation[] {
  return data.map((row) => ({
    Type: row["Type"] || row["type"],
    Role: row["Role"] || row["role"],
  }));
}

export interface FormElementMatcher {
  matches(tagName: string, inputType: string | null): boolean;
}

export interface CueValidator {
  hasCue(element: any): Promise<boolean>;
}

export interface StateChecker {
  hasState(element: any): Promise<boolean>;
}

export interface BrowserPreferenceHandler {
  setPreference(setting: string): Promise<void>;
}

export interface AdaptationChecker {
  hasAdapted(element: any): Promise<boolean>;
}

export interface AccessibilityResult {
  altTextPresent: boolean;
  ariaLabelsUsed: boolean;
  keyboardNavigable: boolean;
  semanticHTMLUsed: boolean;
  languageSpecified: boolean;
}

export interface BddFixtures {
  aboutPage: AboutPage;
  aboutPageSteps: AboutPageSteps;
  accessibilityMobileSteps: AccessibilityMobileSteps;
  formAccessibilitySteps: FormAccessibilitySteps;
  keyboardAccessibilitySteps: KeyboardAccessibilitySteps;
  mediaAccessibilitySteps: MediaAccessibilitySteps;
  navigationAccessibilitySteps: NavigationAccessibilitySteps;
  responsiveAccessibilitySteps: ResponsiveAccessibilitySteps;
  responsiveCommonSteps: ResponsiveCommonSteps;
  responsiveComponentSteps: ResponsiveComponentSteps;
  responsiveImageSteps: ResponsiveImageSteps;
  responsiveInteractionSteps: ResponsiveInteractionSteps;
  responsiveLayoutSteps: ResponsiveLayoutSteps;
  responsiveNavigationSteps: ResponsiveNavigationSteps;
  responsiveTypographySteps: ResponsiveTypographySteps;
  responsiveViewportSteps: ResponsiveViewportSteps;
  seoMetaTagsSteps: SeoMetaTagsSteps;
  structuralAccessibilitySteps: StructuralAccessibilitySteps;
  visualElementAccessibilitySteps: VisualElementAccessibilitySteps;
  ourMissionsContentSteps: OurMissionsContentSteps;
  ourMissionsPerformanceSteps: OurMissionsPerformanceSteps;
  ourMissionsTabSteps: OurMissionsTabSteps;
  ourMissionsVisualSteps: OurMissionsVisualSteps;
  contentSeoSteps: ContentSeoSteps;
  imageOptimizationSteps: ImageOptimizationSteps;
  performanceMetricsSteps: PerformanceMetricsSteps;
  responsivePerformanceSteps: ResponsivePerformanceSteps;
  theSuitesCoreSteps: TheSuitesCoreSteps;
  theSuitesHotspotSteps: TheSuitesHotspotSteps;
  theSuitesInteractionSteps: TheSuitesInteractionSteps;
  theSuitesVisualSteps: TheSuitesVisualSteps;
  vehicleAccessibilitySteps: VehicleAccessibilitySteps;
  vehicleBaseSteps: VehicleBaseSteps;
  vehiclePerformanceSteps: VehiclePerformanceSteps;
  humanSpaceflightCoreSteps: HumanSpaceflightCoreSteps;
  humanSpaceflightHeaderSteps: HumanSpaceflightHeaderSteps;
  humanSpaceflightInteractionSteps: HumanSpaceflightInteractionSteps;
  humanSpaceflightMobileSteps: HumanSpaceflightMobileSteps;
  humanSpaceflightPerformanceSteps: HumanSpaceflightPerformanceSteps;
  careersPage: CareersPage;
  careersPageSteps: CareersPageSteps;
  destinationsSteps: DestinationsSteps;
  dragonPage: DragonPage;
  dragonPageSteps: DragonPageSteps;
  footerSteps: FooterSteps;
  homePage: HomePage;
  homePageCoreSteps: HomePageCoreSteps;
  homePageInteractionSteps: HomePageInteractionSteps;
  homePageMobileSteps: HomePageMobileSteps;
  homePageNavigationSteps: HomePageNavigationSteps;
  homePageTechnicalSteps: HomePageTechnicalSteps;
  homePageMetadataSteps: HomePageMetadataSteps;
  humanSpaceflightPage: HumanSpaceflightPage;
  falcon9Page: Falcon9Page;
  falcon9PageSteps: Falcon9PageSteps;
  falconHeavyPage: FalconHeavyPage;
  falconHeavyPageSteps: FalconHeavyPageSteps;
  mediaCarouselSteps: MediaCarouselSteps;
  missionsPage: MissionsPage;
  missionsSteps: MissionsSteps;
  ourMissionsSteps: OurMissionsSteps;
  ridesharePage: RidesharePage;
  ridesharePageSteps: RidesharePageSteps;
  sharedContext: SharedContext;
  sharedPageSteps: SharedPageSteps;
  starshieldPage: StarshieldPage;
  starshieldContentSteps: StarshieldContentSteps;
  starshieldErrorHandlingSteps: StarshieldErrorHandlingSteps;
  starshieldFormSteps: StarshieldFormSteps;
  starshieldNavigationSteps: StarshieldNavigationSteps;
  starshieldPerformanceSteps: StarshieldPerformanceSteps;
  starshieldTechnicalSteps: StarshieldTechnicalSteps;
  starshieldPageSteps: StarshieldPageSteps;
  starshipPage: StarshipPage;
  starshipBasicSteps: StarshipBasicSteps;
  starshipMissionsSteps: StarshipMissionsSteps;
  starshipPropulsionSteps: StarshipPropulsionSteps;
  starshipResponsiveSteps: StarshipResponsiveSteps;
  suppliersPage: SuppliersPage;
  suppliersPageBasicSteps: SuppliersPageBasicSteps;
  suppliersPageRegistrationSteps: SuppliersPageRegistrationSteps;
  suppliersPageResourcesSteps: SuppliersPageResourcesSteps;
  suppliersPageTechnicalSteps: SuppliersPageTechnicalSteps;
  apiSharedSteps: APISharedSteps;
  starlinkSteps: StarlinkSteps;
  shipsSteps: ShipsSteps;
  rocketsSteps: RocketsSteps;
  roadsterSteps: RoadsterSteps;
  timelineContentSteps: TimelineContentSteps;
  timelineCoreSteps: TimelineCoreSteps;
  timelineNavigationSteps: TimelineNavigationSteps;
  timelineResponsiveSteps: TimelineResponsiveSteps;
  timelineVisualSteps: TimelineVisualSteps;
  updatesPage: UpdatesPage;
  updatesPageSteps: UpdatesPageSteps;
  assertionHelper: AssertionHelper;
  viewportUtility: ViewportUtility;
}
