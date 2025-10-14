import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { Page, expect } from "@playwright/test";
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
    await this.aboutPage.waitForAppContentLoad();
  }

  @When("the About page loads successfully")
  async thePageLoadsSuccessfully() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.isPageContentVisible(),
      "The main content of the About page is not visible."
    );
  }

  @Then("the user should see SpaceX's **mission statement** and core vision")
  async theUserShouldSeeMissionStatement() {
    await expect(
      this.aboutPage.missionStatementText,
      "Mission statement and core vision text should be visible"
    ).toBeVisible();
  }

  @Then(
    "the mission to make **humanity multiplanetary** should be prominently featured"
  )
  async theMissionToMakeHumanityMultiplanetaryShouldBeProminentlyFeatured() {
    await expect(
      this.aboutPage.humanityMultiplanetaryText,
      "Humanity Multiplanetary vision should be featured"
    ).toBeVisible();
  }

  @Then(
    "the page should highlight the company's core values and long-term objectives"
  )
  async thePageShouldHighlightTheCompanysCoreValues() {
    await expect(
      this.aboutPage.missionSection,
      "Mission/Core Values section should be visible"
    ).toBeVisible();
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
    "the company's **approach to reusability** should be emphasized throughout the history."
  )
  async theCompanysApproachToReusabilityShouldBeEmphasized() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.isReusabilityEmphasized(),
      "Reusability emphasis is not visible in the history section."
    );
  }

  @When("the user scrolls to the leadership section")
  async theUserScrollsToTheLeadershipTeamSection() {
    await this.aboutPage.leadershipSection.scrollIntoViewIfNeeded();
  }

  @Then("photos and biographies for the core leaders should be available")
  async photosAndBiographiesForTheCoreLeadersShouldBeAvailable() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.checkLeaderPhotosAndBiographies(),
      "Fewer than 4 leader photos/bios were found."
    );
  }

  @When("the user reviews the major achievements and metrics section")
  async theUserReviewsTheMajorAchievementsAndMetricsSection() {
    await this.aboutPage.achievementsSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display up-to-date metrics for:")
  async thePageShouldDisplayUpToDateMetricsFor(dataTable: DataTable) {
    const achievements = dataTable.hashes() as AchievementTable;
    for (const achievement of achievements) {
      const metric = achievement["Achievement Metric"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isAchievementMetricDisplayed(metric),
        `Achievement metric "${metric}" is not displayed.`
      );
    }
  }

  @Then(
    "the displayed values should be presented with a **clear value format**"
  )
  async theDisplayedValuesShouldBePresentedWithAClearValueFormat() {
    await expect(
      this.aboutPage.achievementsSection,
      "Achievements section is not visible to check value formats."
    ).toBeVisible();
  }

  @When("the user looks for information on key facilities")
  async theUserLooksForInformationOnKeyFacilities() {
    await this.aboutPage.facilitiesSection.scrollIntoViewIfNeeded();
  }

  @Then("the following operational facilities should be clearly listed:")
  async theFollowingOperationalFacilitiesShouldBeClearlyListed(
    dataTable: DataTable
  ) {
    const facilities = dataTable.hashes() as FacilityTable;
    for (const facility of facilities) {
      const facilityName = facility["Facility Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isFacilityInfoDisplayed(facilityName),
        `Facility info for "${facilityName}" is not displayed.`
      );
    }
  }

  @When("the user reviews the company's sustainability initiatives")
  async theUserReviewsTheCompanysSustainabilityInitiatives() {
    await this.aboutPage.sustainabilitySection.scrollIntoViewIfNeeded();
  }

  @Then("the section should clearly describe initiatives focused on:")
  async theSectionShouldClearlyDescribeInitiativesFocusedOn(
    dataTable: DataTable
  ) {
    const initiatives = dataTable.hashes() as InitiativeTable;
    for (const initiative of initiatives) {
      const focus = initiative["Initiative Focus"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isSustainabilityDetailDescribed(focus),
        `Sustainability initiative focus "${focus}" is not clearly described.`
      );
    }
  }

  @When("the user reviews the partnerships section")
  async theUserReviewsThePartnershipsSection() {
    await this.aboutPage.partnershipsSection.scrollIntoViewIfNeeded();
  }

  @Then("major long-standing partnerships should be listed, including:")
  async majorLongStandingPartnershipsShouldBeListed(dataTable: DataTable) {
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

  @Then(
    "the following key executive roles should be listed with associated names:"
  )
  async theFollowingKeyExecutiveRolesShouldBeListedWithAssociatedNames(
    dataTable: DataTable
  ) {
    const roles = dataTable.hashes() as TwoColumnTable;
    for (const role of roles) {
      const roleName = role["Role"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isKeyExecutiveRoleListed(roleName),
        `Key executive role "${roleName}" is not listed.`
      );
    }
  }

  @Then(
    "**photos and brief biographies** should be provided for the primary leaders."
  )
  async photosAndBriefBiographiesShouldBeProvidedForThePrimaryLeaders() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.aboutPage.checkLeaderPhotosAndBiographies(),
      "Fewer than 4 leader photos/bios were found."
    );
  }

  @When("the user reviews the company accomplishments summary")
  async theUserReviewsTheCompanyAccomplishmentsSummary() {
    await this.aboutPage.achievementsSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display verifiable, major achievements:")
  async thePageShouldDisplayVerifiableMajorAchievements(dataTable: DataTable) {
    const achievements = dataTable.hashes() as AchievementTable;
    for (const achievement of achievements) {
      const metric = achievement["Achievement Metric"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isAchievementMetricDisplayed(metric),
        `Achievement metric "${metric}" is not displayed.`
      );
    }
  }

  @When("the user reads about operations and facilities")
  async theUserReadsAboutOperationsAndFacilities() {
    await this.aboutPage.facilitiesSection.scrollIntoViewIfNeeded();
  }

  @Then("information about key SpaceX locations should be clearly displayed:")
  async informationAboutKeySpaceXLocationsShouldBeClearlyDisplayed(
    dataTable: DataTable
  ) {
    const facilities = dataTable.hashes() as FacilityTable;
    for (const facility of facilities) {
      const facilityName = facility["Facility Name"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isFacilityInfoDisplayed(facilityName),
        `Facility info for "${facilityName}" is not displayed.`
      );
    }
  }

  @When("the user looks for environmental information")
  async theUserLooksForEnvironmentalInformation() {
    await this.aboutPage.sustainabilitySection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should describe SpaceX's commitment to sustainability, including:"
  )
  async thePageShouldDescribeSpaceXsCommitmentToSustainabilityIncluding(
    dataTable: DataTable
  ) {
    const initiatives = dataTable.hashes() as InitiativeTable;
    for (const initiative of initiatives) {
      const focus = initiative["Initiative Focus"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.aboutPage.isSustainabilityDetailDescribed(focus),
        `Sustainability initiative focus "${focus}" is not clearly described.`
      );
    }
  }
}
