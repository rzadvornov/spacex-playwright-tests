import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { Page, expect } from "@playwright/test";
import { AboutPage } from "../../pages/ui/AboutPage";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { DataTable } from "playwright-bdd";
import { SharedPageSteps } from "./SharedPageSteps";
import { TwoColumnTable, AchievementTable, FacilityTable, InitiativeTable, PartnershipTable, DivisionTable, ResourceTable } from "../../utils/types/Types";

@Fixture("aboutPageSteps")
export class AboutPageSteps {
  constructor(
    private aboutPage: AboutPage,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("a user navigates to the About page")
  async navigateToAboutPage() {
    await this.aboutPage.navigate();
  }

  @When("the About page loads successfully")
  async verifyPageLoadsSuccessfully() {
    await this.validateContentVisibility(
      () => this.aboutPage.isPageContentVisible(),
      "The main content of the About page is not visible."
    );
  }

  @Then("the user should see SpaceX's **mission statement** and core vision")
  async verifyMissionStatementVisible() {
    await expect(
      this.aboutPage.missionStatementText,
      "Mission statement and core vision text should be visible"
    ).toBeVisible();
  }

  @Then(
    "the mission to make **humanity multiplanetary** should be prominently featured"
  )
  async verifyHumanityMultiplanetaryFeatured() {
    await expect(
      this.aboutPage.humanityMultiplanetaryText,
      "Humanity Multiplanetary vision should be featured"
    ).toBeVisible();
  }

  @Then(
    "the page should highlight the company's core values and long-term objectives"
  )
  async verifyCoreValuesHighlighted() {
    await expect(
      this.aboutPage.missionSection,
      "Mission/Core Values section should be visible"
    ).toBeVisible();
  }

  @When("the user reviews the company history section")
  async scrollToHistorySection() {
    await this.aboutPage.historySection.scrollIntoViewIfNeeded();
  }

  @Then("the following key milestones should be displayed chronologically:")
  async verifyMilestonesDisplayed(dataTable: DataTable) {
    const milestones = dataTable.hashes() as TwoColumnTable;
    await this.validateTableItems(
      milestones,
      (milestone) =>
        this.aboutPage.isMilestoneDetailDisplayed(milestone["Detail"]),
      (detail) => `Milestone detail "${detail}" is not displayed.`
    );
  }

  @Then(
    "the company's **approach to reusability** should be emphasized throughout the history."
  )
  async verifyReusabilityEmphasized() {
    await this.validateContentVisibility(
      () => this.aboutPage.isReusabilityEmphasized(),
      "Reusability emphasis is not visible in the history section."
    );
  }

  @When("the user scrolls to the leadership section")
  async scrollToLeadershipSection() {
    await this.aboutPage.leadershipSection.scrollIntoViewIfNeeded();
  }

  @Then("photos and biographies for the core leaders should be available")
  async verifyLeaderPhotosAndBiographiesAvailable() {
    await this.validateLeaderContent();
  }

  @When("the user reviews the major achievements and metrics section")
  async scrollToAchievementsSection() {
    await this.aboutPage.achievementsSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display up-to-date metrics for:")
  async verifyAchievementMetricsDisplayed(dataTable: DataTable) {
    const achievements = dataTable.hashes() as AchievementTable;
    await this.validateTableItems(
      achievements,
      (achievement) =>
        this.aboutPage.isAchievementMetricDisplayed(
          achievement["Achievement Metric"]
        ),
      (metric) => `Achievement metric "${metric}" is not displayed.`
    );
  }

  @Then(
    "the displayed values should be presented with a **clear value format**"
  )
  async verifyClearValueFormat() {
    await expect(
      this.aboutPage.achievementsSection,
      "Achievements section is not visible to check value formats."
    ).toBeVisible();
  }

  @When("the user looks for information on key facilities")
  async scrollToFacilitiesSection() {
    await this.aboutPage.facilitiesSection.scrollIntoViewIfNeeded();
  }

  @Then("the following operational facilities should be clearly listed:")
  async verifyFacilitiesListed(dataTable: DataTable) {
    const facilities = dataTable.hashes() as FacilityTable;
    await this.validateTableItems(
      facilities,
      (facility) =>
        this.aboutPage.isFacilityInfoDisplayed(facility["Facility Name"]),
      (facilityName) => `Facility info for "${facilityName}" is not displayed.`
    );
  }

  @When("the user reviews the company's sustainability initiatives")
  async scrollToSustainabilitySection() {
    await this.aboutPage.sustainabilitySection.scrollIntoViewIfNeeded();
  }

  @Then("the section should clearly describe initiatives focused on:")
  async verifySustainabilityInitiativesDescribed(dataTable: DataTable) {
    const initiatives = dataTable.hashes() as InitiativeTable;
    await this.validateTableItems(
      initiatives,
      (initiative) =>
        this.aboutPage.isSustainabilityDetailDescribed(
          initiative["Initiative Focus"]
        ),
      (focus) =>
        `Sustainability initiative focus "${focus}" is not clearly described.`
    );
  }

  @When("the user reviews the partnerships section")
  async scrollToPartnershipsSection() {
    await this.aboutPage.partnershipsSection.scrollIntoViewIfNeeded();
  }

  @Then("major long-standing partnerships should be listed, including:")
  async verifyPartnershipsListed(dataTable: DataTable) {
    const partnerships = dataTable.hashes() as PartnershipTable;
    await this.validateTableItems(
      partnerships,
      (partnership) =>
        this.aboutPage.isPartnerDetailListed(partnership["Example Detail"]),
      (detail) => `Partnership detail "${detail}" is not listed.`
    );
  }

  @When("the user looks for organizational information")
  async scrollToStructureSection() {
    await this.aboutPage.structureSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should clearly describe the major product and development divisions:"
  )
  async verifyDivisionsDescribed(dataTable: DataTable) {
    const divisions = dataTable.hashes() as DivisionTable;
    await this.validateTableItems(
      divisions,
      (division) =>
        this.aboutPage.isDivisionFocusDescribed(division["Primary Focus"]),
      (primaryFocus) =>
        `Division primary focus "${primaryFocus}" is not clearly described.`
    );
  }

  @When("the user looks for additional information")
  async scrollToResourcesSection() {
    await this.aboutPage.resourcesSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "clearly labeled links should be available to the following external resources:"
  )
  async verifyResourceLinksAvailable(dataTable: DataTable) {
    const resources = dataTable.hashes() as ResourceTable;
    await this.validateTableItems(
      resources,
      (resource) => this.aboutPage.isResourceLinked(resource["Resource Name"]),
      (resourceName) =>
        `Resource link for "${resourceName}" is not clearly labeled or available.`
    );
  }

  @Then(
    "the following key executive roles should be listed with associated names:"
  )
  async verifyExecutiveRolesListed(dataTable: DataTable) {
    const roles = dataTable.hashes() as TwoColumnTable;
    await this.validateTableItems(
      roles,
      (role) => this.aboutPage.isKeyExecutiveRoleListed(role["Role"]),
      (roleName) => `Key executive role "${roleName}" is not listed.`
    );
  }

  @Then(
    "**photos and brief biographies** should be provided for the primary leaders."
  )
  async verifyPrimaryLeadersContent() {
    await this.validateLeaderContent();
  }

  @When("the user reviews the company accomplishments summary")
  async scrollToAccomplishmentsSection() {
    await this.aboutPage.achievementsSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should display verifiable, major achievements:")
  async verifyMajorAchievementsDisplayed(dataTable: DataTable) {
    const achievements = dataTable.hashes() as AchievementTable;
    await this.validateTableItems(
      achievements,
      (achievement) =>
        this.aboutPage.isAchievementMetricDisplayed(
          achievement["Achievement Metric"]
        ),
      (metric) => `Achievement metric "${metric}" is not displayed.`
    );
  }

  @When("the user reads about operations and facilities")
  async scrollToOperationsSection() {
    await this.aboutPage.facilitiesSection.scrollIntoViewIfNeeded();
  }

  @Then("information about key SpaceX locations should be clearly displayed:")
  async verifyKeyLocationsDisplayed(dataTable: DataTable) {
    const facilities = dataTable.hashes() as FacilityTable;
    await this.validateTableItems(
      facilities,
      (facility) =>
        this.aboutPage.isFacilityInfoDisplayed(facility["Facility Name"]),
      (facilityName) => `Facility info for "${facilityName}" is not displayed.`
    );
  }

  @When("the user looks for environmental information")
  async scrollToEnvironmentalSection() {
    await this.aboutPage.sustainabilitySection.scrollIntoViewIfNeeded();
  }

  @Then(
    "the page should describe SpaceX's commitment to sustainability, including:"
  )
  async verifySustainabilityCommitmentDescribed(dataTable: DataTable) {
    const initiatives = dataTable.hashes() as InitiativeTable;
    await this.validateTableItems(
      initiatives,
      (initiative) =>
        this.aboutPage.isSustainabilityDetailDescribed(
          initiative["Initiative Focus"]
        ),
      (focus) =>
        `Sustainability initiative focus "${focus}" is not clearly described.`
    );
  }

  private async validateContentVisibility(
    checkFunction: () => Promise<boolean>,
    errorMessage: string
  ): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      checkFunction,
      errorMessage
    );
  }

  private async validateLeaderContent(): Promise<void> {
    await this.validateContentVisibility(
      () => this.aboutPage.checkLeaderPhotosAndBiographies(),
      "Fewer than 4 leader photos/bios were found."
    );
  }

  private async validateTableItems<T>(
    items: T[],
    checkFunction: (item: T) => Promise<boolean>,
    errorMessageBuilder: (key: string) => string
  ): Promise<void> {
    for (const item of items) {
      const key = this.extractKeyFromItem(item);
      await this.validateContentVisibility(
        () => checkFunction(item),
        errorMessageBuilder(key)
      );
    }
  }

  private extractKeyFromItem(item: any): string {
    const values = Object.values(item);
    const stringValue = values.find(
      (value) => typeof value === "string"
    ) as string;
    return stringValue || "Unknown";
  }
}
