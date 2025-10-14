import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { Page } from "@playwright/test";
import { AboutPage } from "../../pages/ui/AboutPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { DataTable } from "playwright-bdd";
import { SharedPageSteps } from "./SharedPageSteps";

type TwoColumnTable =
  | any[]
  | { Role: string; Detail: string }[]
  | { MilestoneCategory: string; Detail: string }[];
type AchievementTable = {
  "Achievement Metric": string;
  "Value Format": string;
}[];
type FacilityTable = { "Facility Name": string; "Location/Purpose": string }[];
type InitiativeTable = { "Initiative Focus": string; Detail: string }[];
type PartnershipTable = { "Partner Type": string; "Example Detail": string }[];
type DivisionTable = { "Division Name": string; "Primary Focus": string }[];
type ResourceTable = { "Resource Name": string; Availability: string }[];

@Fixture("aboutPageSteps")
export class AboutPageSteps {
  constructor(
    private page: Page,
    private aboutPage: AboutPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("a user navigates to the About page")
  async aUserNavigatesToTheAboutPage() {
    await this.aboutPage.open();
  }

  @When("the page loads successfully")
  async thePageLoadsSuccessfully() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.isPageLoadedSuccessfully(),
      "The About page did not load successfully (Title check failed)."
    );
  }

  @Then("the user should see SpaceX's **mission statement** and core vision")
  async theUserShouldSeeSpaceXSMissionStatementAndCoreVision() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.missionStatementText.isVisible(),
      "The mission statement text is not visible on the page."
    );
  }

  @Then(
    "the mission to make **humanity multiplanetary** should be prominently featured"
  )
  async theMissionToMakeHumanityMultiplanetaryShouldBeProminentlyFeatured() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.humanityMultiplanetaryText.isVisible(),
      "The multiplanetary mission statement is not prominently featured."
    );
  }

  @Then(
    "the page should highlight the company's core values and long-term objectives"
  )
  async thePageShouldHighlightTheCoreValuesAndLongTermObjectives() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.missionStatementText.isVisible(),
      "Core values/objectives section is not highlighted."
    );
  }

  @When("the user reviews the company history section")
  async theUserReviewsTheCompanyHistorySection() {
    await this.aboutPage.historySection.scrollIntoViewIfNeeded();
  }

  @Then("the following key milestones should be displayed chronologically:")
  async theFollowingKeyMilestonesShouldBeDisplayedChronologically(
    dataTable: DataTable
  ) {
    const milestones = dataTable.hashes() as TwoColumnTable;
    for (const milestone of milestones) {
      const detail = milestone["Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isMilestoneDetailDisplayed(detail),
        `Milestone detail "${detail}" is not displayed.`
      );
    }
  }

  @Then(
    "the company's **approach to reusability** should be emphasized throughout the history"
  )
  async theCompanysApproachToReusabilityShouldBeEmphasized() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.isReusabilityEmphasized(),
      "The reusability emphasis text is not displayed."
    );
  }

  @When("the user scrolls to the leadership team section")
  async theUserScrollsToTheLeadershipTeamSection() {
    await this.aboutPage.leadershipSection.scrollIntoViewIfNeeded();
  }

  @Then("the leadership team photos and short biographies should be present")
  async theLeadershipTeamPhotosAndShortBiographiesShouldBePresent() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.checkLeaderPhotosAndBiographies(),
      "The leadership team section does not contain a sufficient number of photos/bios."
    );
  }

  @Then("key executive roles should be accurately listed:")
  async keyExecutiveRolesShouldBeAccuratelyListed(dataTable: any) {
    const roles = dataTable.hashes() as TwoColumnTable;
    for (const role of roles) {
      const roleName = role["Role"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isKeyExecutiveRoleListed(roleName),
        `Key executive role "${roleName}" is not accurately listed.`
      );
    }
  }

  @When("the user examines the achievements section")
  async theUserExaminesTheAchievementsSection() {
    await this.aboutPage.achievementsSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should display an overview of major achievements and their **metrics**:"
  )
  async thePageShouldDisplayAnOverviewOfMajorAchievements(dataTable: any) {
    const metrics = dataTable.hashes() as AchievementTable;
    for (const metric of metrics) {
      const metricName = metric["Achievement Metric"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isAchievementMetricDisplayed(metricName),
        `Achievement metric "${metricName}" is not displayed or correct.`
      );
    }
  }

  @When("the user looks at the operational facilities section")
  async theUserLooksAtTheOperationalFacilitiesSection() {
    await this.aboutPage.facilitiesSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "key operational locations and facilities should be described, including:"
  )
  async keyOperationalLocationsAndFacilitiesShouldBeDescribed(dataTable: any) {
    const facilities = dataTable.hashes() as FacilityTable;
    for (const facility of facilities) {
      const facilityName = facility["Facility Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isFacilityInfoDisplayed(facilityName),
        `Facility info for "${facilityName}" is not displayed.`
      );
    }
  }

  @When("the user reviews the sustainability section")
  async theUserReviewsTheSustainabilitySection() {
    await this.aboutPage.sustainabilitySection.scrollIntoViewIfNeeded();
  }

  @Then("the company should detail its sustainability initiatives and goals:")
  async theCompanyShouldDetailItsSustainabilityInitiatives(dataTable: any) {
    const initiatives = dataTable.hashes() as InitiativeTable;
    for (const initiative of initiatives) {
      const detail = initiative["Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isSustainabilityDetailDescribed(detail),
        `Sustainability initiative detail "${detail}" is not described.`
      );
    }
  }

  @When("the user reviews the partnerships section")
  async theUserReviewsThePartnershipsSection() {
    await this.aboutPage.partnershipsSection.scrollIntoViewIfNeeded();
  }

  @Then("major long-standing partnerships should be listed, including:")
  async majorLongStandingPartnershipsShouldBeListed(dataTable: any) {
    const partnerships = dataTable.hashes() as PartnershipTable;
    for (const partnership of partnerships) {
      const detail = partnership["Example Detail"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isPartnerDetailListed(detail),
        `Partnership detail "${detail}" is not listed.`
      );
    }
  }

  @When("the user looks for organizational information")
  async theUserLooksForOrganizationalInformation() {
    await this.aboutPage.structureSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should clearly describe the major product and development divisions:"
  )
  async thePageShouldClearlyDescribeTheMajorProductAndDevelopmentDivisions(
    dataTable: any
  ) {
    const divisions = dataTable.hashes() as DivisionTable;
    for (const division of divisions) {
      const primaryFocus = division["Primary Focus"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isDivisionFocusDescribed(primaryFocus),
        `Division primary focus "${primaryFocus}" is not clearly described.`
      );
    }
  }

  @When("the user looks for additional information")
  async theUserLooksForAdditionalInformation() {
    await this.aboutPage.resourcesSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "clearly labeled links should be available to the following external resources:"
  )
  async clearlyLabeledLinksShouldBeAvailableToTheFollowingExternalResources(
    dataTable: any
  ) {
    const resources = dataTable.hashes() as ResourceTable;
    for (const resource of resources) {
      const resourceName = resource["Resource Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isResourceLinked(resourceName),
        `Resource link for "${resourceName}" is not clearly labeled or available.`
      );
    }
  }
}
