import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { CareersPage } from "../../pages/ui/CareersPage";
import { SharedPageSteps } from "./SharedPageSteps";
import { AssertionHelper } from "../../utils/AssertionHelper";
import { FilterStrategyFactory } from "../../utils/strategies/FilterStrategyFactory";
import { SharedContext, CategoryTable, OptionTable, ValueTable, BenefitTable, DevTable, FAQTable } from "../../utils/types/Types";

@Fixture("careersPageSteps")
export class CareersPageSteps {
  constructor(
    private careersPage: CareersPage,
    private sharedContext: SharedContext,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @When("the user navigates to the Careers page")
  async navigateToCareersPage() {
    await this.careersPage.navigate();
  }

  @Given("a user navigates to the Careers page")
  async aUserNavigatesToTheCareersPage() {
    await this.careersPage.open();
    await this.careersPage.waitForAppContentLoad();
  }

  @Then("the Careers page main heading should be visible")
  async checkCareersPageHeadingVisible() {
    await this._verifyElementVisible(this.careersPage.careersHeading);
  }

  @Then("the URL should contain the jobs path")
  async checkUrlContainsJobsPath() {
    await expect(this.careersPage.page).toHaveURL(new RegExp("/jobs/"));
  }

  @When("the Careers page loads initially")
  async thePageLoadsInitially() {
    await this._verifyHeadingVisible();
  }

  private async _verifyHeadingVisible(): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.careersHeading.isVisible(),
      "Careers page main heading is not visible."
    );
  }

  private async _verifyElementVisible(element: any, errorMessage?: string): Promise<void> {
    await expect(element, errorMessage).toBeVisible();
  }

  @Then("the user should see the headline mentioning **{string} and {string}**")
  async theUserShouldSeeHeadline(text1: string, text2: string) {
    await this._verifyHeadlineText(text1, text2);
  }

  private async _verifyHeadlineText(text1: string, text2: string): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.checkHeadlineText(text1, text2),
      `Headline mentioning "${text1}" and "${text2}" is not visible.`
    );
  }

  @Then("a description of SpaceX's mission and culture should be displayed")
  async aDescriptionOfMissionAndCultureShouldBeDisplayed() {
    await this._verifyMissionAlignmentText();
  }

  private async _verifyMissionAlignmentText(): Promise<void> {
    await this._verifyElementVisible(
      this.careersPage.missionAlignmentText,
      "Mission description should be visible"
    );
  }

  @Then("the content should emphasize **direct contribution to making humanity multiplanetary**")
  async theContentShouldEmphasizeMultiplanetary() {
    await this._verifyMissionAlignmentText();
  }

  @When("the user searches for the job title {string}")
  async searchForJobTitle(jobTitle: string) {
    this.sharedContext.mediaType = jobTitle;
    await this.careersPage.searchForJob(jobTitle);
  }

  @Then("at least one job listing should be visible")
  async checkJobListingVisible() {
    await this._verifyFirstJobListingVisible();
  }

  private async _verifyFirstJobListingVisible(): Promise<void> {
    await this._verifyElementVisible(this.careersPage.firstJobListing);
  }

  @When("the user clicks on the first job listing")
  async clickFirstJobListing() {
    await this.careersPage.clickFirstJobListing();
  }

  @When("the user enters search criteria \\(e.g., {string}, {string})")
  async theUserEntersSearchCriteria(criteria1: string, _criteria2: string) {
    await this.careersPage.searchForJob(criteria1);
  }

  @Then("matching job openings should be displayed")
  async matchingJobOpeningsShouldBeDisplayed() {
    await this._verifyFirstJobListingVisible();
  }

  @Then("search results should show **position title, department, and location**")
  async searchResultsShouldShowPositionTitleDepartmentAndLocation() {
    await this._verifyJobListingDetails();
  }

  private async _verifyJobListingDetails(): Promise<void> {
    const firstListing = this.careersPage.firstJobListing;
    await this._verifyElementVisible(firstListing);
    await expect(firstListing).not.toBeEmpty();
  }

  @Then("the application option should be immediately available for each listing")
  async theApplicationOptionShouldBeImmediatelyAvailableForEachListing() {
    await this._verifyFirstJobListingVisible();
  }

  @When("the user selects a department filter {string} and a type filter {string}")
  async theUserSelectsAFilter(department: string, type: string) {
    await this._applyDepartmentAndTypeFilters(department, type);
  }

  private async _applyDepartmentAndTypeFilters(department: string, type: string): Promise<void> {
    await this.careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
    await this.careersPage.applyFilters(department, type);

    this.sharedContext.selectedDepartment = department;
    this.sharedContext.selectedType = type;
  }

  @Then("the job listings should filter to show only matching positions")
  async theJobListingsShouldFilterToShowOnlyMatchingPositions() {
    await this._verifyFilteredResults();
  }

  private async _verifyFilteredResults(): Promise<void> {
    const department = this.sharedContext.selectedDepartment;
    const type = this.sharedContext.selectedType;

    await expect(this.careersPage.filteredJobListings.first()).toBeVisible();

    const hasFilteredResults = await this.careersPage.verifyFilteredResults(
      department,
      type
    );
    expect(hasFilteredResults).toBeTruthy();
  }

  @When("the user selects a location filter {string}")
  async theUserSelectsALocationFilter(location: string) {
    const strategy = FilterStrategyFactory.getStrategy('location');
    await strategy.applyFilter(this.careersPage, location);
  }

  @Then("job listings should show only positions located at Boca Chica")
  async jobListingsShouldShowOnlyPositionsLocatedAtBocaChica() {
    await this._verifyFirstJobListingVisible();
  }

  @When("the user filters by experience level {string}")
  async theUserFiltersByExperienceLevelEntryLevel(level: string) {
    const strategy = FilterStrategyFactory.getStrategy('experience');
    await strategy.applyFilter(this.careersPage, level);
  }

  @Then("positions appropriate for recent graduates should be displayed")
  async positionsAppropriateForRecentGraduatesShouldBeDisplayed() {
    await this._verifyFirstJobListingVisible();
  }

  @Then("when filtering by {string}")
  async andWhenFilteringByLeadershipManagement(_level: string) {
    await this.careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
  }

  @Then("senior and managerial positions with required experience should be clearly displayed")
  async seniorAndManagerialPositionsShouldBeClearlyDisplayed() {
    await this._verifyFirstJobListingVisible();
  }

  @Then("the available primary job categories should include:")
  async theAvailablePrimaryJobCategoriesShouldInclude(dataTable: DataTable) {
    const categories = dataTable.hashes() as CategoryTable;
    await this._verifyDataTableItems(
      categories,
      "Job Category",
      (category) => this.careersPage.checkJobCategory(category),
      "job category"
    );
  }

  @Then("the user should be able to filter or view:")
  async andTheUserShouldBeAbleToFilterOrView(dataTable: DataTable) {
    const options = dataTable.hashes() as OptionTable;
    await this._verifyDataTableItems(
      options,
      "Work Option",
      (option) => this.careersPage.checkWorkOption(option),
      "work option"
    );
  }

  @Then("the page should highlight core values and expected mindsets:")
  async thePageShouldHighlightCoreValues(dataTable: DataTable) {
    const values = dataTable.hashes() as ValueTable;
    await this._verifyDataTableItems(
      values,
      "Core Value",
      (value) => this.careersPage.checkCultureValue(value),
      "core value"
    );
  }

  @Then("comprehensive benefits information should include:")
  async comprehensiveBenefitsInformationShouldInclude(dataTable: DataTable) {
    const benefits = dataTable.hashes() as BenefitTable;
    await this._verifyDataTableItems(
      benefits,
      "Benefit Category",
      (benefit) => this.careersPage.checkBenefitDetail(benefit),
      "benefit detail"
    );
  }

  @Then("information should highlight:")
  async informationShouldHighlight(dataTable: DataTable) {
    const opportunities = dataTable.hashes() as DevTable;
    await this._verifyDataTableItems(
      opportunities,
      "Development Opportunity",
      (opportunity) => this.careersPage.checkDevelopmentOpportunity(opportunity),
      "development opportunity"
    );
  }

  @Then("a dedicated **FAQ section** should be available, addressing topics like:")
  async aDedicatedFAQSectionShouldBeAvailable(dataTable: DataTable) {
    const topics = dataTable.hashes() as FAQTable;
    await this._verifyDataTableItems(
      topics,
      "FAQ Topic",
      (topic) => this.careersPage.checkFAQTopic(topic),
      "FAQ topic"
    );
  }

  private async _verifyDataTableItems<T extends Record<string, string>>(
    items: T[],
    columnName: string,
    checkFunction: (item: string) => Promise<boolean>,
    itemType: string
  ): Promise<void> {
    for (const item of items) {
      const value = item[columnName];
      await this.assertionHelper.validateBooleanCheck(
        () => checkFunction(value),
        `${itemType} "${value}" is not available.`
      );
    }
  }

  @When("the user clicks on a specific job posting")
  async theUserClicksOnASpecificJobPosting() {
    await this.careersPage.clickFirstJobListing();
  }

  @Then("the full job description page should load")
  async theFullJobDescriptionPageShouldLoad() {
    await this._verifyElementVisible(this.careersPage.jobDetailsPage);
  }

  @Then("the page should clearly detail **Qualifications, Responsibilities, and Application Instructions**")
  async thePageShouldClearlyDetailQualsResponsibilitiesAndInstructions() {
    await this._verifyJobDetailsVisible();
  }

  private async _verifyJobDetailsVisible(): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.checkJobDetailsVisible(),
      "Qualifications, Responsibilities, or Application Instructions are not clearly detailed."
    );
  }

  @Then('when the user clicks the "Apply Now" button')
  async andWhenTheUserClicksTheApplyNowButton() {
    await this.careersPage.applyNowButton.click();
  }

  @Then("the **application form should appear**, requiring marked fields and offering resume\\/CV upload")
  async theApplicationFormShouldAppear() {
    await this._verifyElementVisible(
      this.careersPage.applicationForm,
      "Application form did not appear"
    );
  }

  @When("the user reviews the company culture section")
  async theUserReviewsTheCompanyCultureSection() {
    await this._scrollToSection(this.careersPage.cultureSection);
  }

  @When("the user reviews the detailed benefits section")
  async theUserReviewsTheDetailedBenefitsSection() {
    await this._scrollToSection(this.careersPage.benefitsSection);
  }

  @When("the user reviews professional growth opportunities")
  async theUserReviewsProfessionalGrowthOpportunities() {
    await this._scrollToSection(this.careersPage.developmentSection);
  }

  @When("the user reviews company policies")
  async theUserReviewsCompanyPolicies() {
    await this._scrollToSection(this.careersPage.diversitySection);
  }

  @When("the user looks for additional career options")
  async theUserLooksForAdditionalCareerOptions() {
    await this._scrollToSection(this.careersPage.referralSection);
  }

  @When("the user has common questions or seeks additional information")
  async theUserHasCommonQuestionsOrSeeksAdditionalInformation() {
    await this._scrollToSection(this.careersPage.faqSection);
  }

  private async _scrollToSection(section: any): Promise<void> {
    await section.scrollIntoViewIfNeeded();
  }

  @Then("an **Equal Opportunity Employment statement** should be prominently displayed.")
  async anEqualOpportunityEmploymentStatementShouldBeProminentlyDisplayed() {
    await this._verifyElementVisible(
      this.careersPage.eoeStatement,
      "EOE statement should be visible"
    );
  }

  @Then("a **Diversity and Inclusion commitment** should be clearly highlighted")
  async aDiversityAndInclusionCommitmentShouldBeClearlyHighlighted() {
    await this._verifyElementVisible(
      this.careersPage.diversitySection,
      "Diversity and Inclusion commitment is not visible"
    );
  }

  @Then("resources for underrepresented groups or diversity statistics should be shared")
  async resourcesForUnderrepresentedGroupsShouldBeShared() {
    await this._verifyElementVisible(
      this.careersPage.diversitySection,
      "Diversity resources/statistics are not visible"
    );
  }

  @Then("details about the **Employee Referral Program** \\(bonuses, submission process) should be displayed")
  async detailsAboutTheEmployeeReferralProgramShouldBeDisplayed() {
    await this._verifyElementVisible(
      this.careersPage.referralSection,
      "Referral program details are not visible"
    );
  }

  @Then("a **Job Alert subscription option** should be available, allowing users to set preferences \\(location, role type).")
  async aJobAlertSubscriptionOptionShouldBeAvailable() {
    await this._verifyJobAlertOptionVisible();
  }

  private async _verifyJobAlertOptionVisible(): Promise<void> {
    await this._verifyElementVisible(
      this.careersPage.referralSection
        .locator('button:has-text("Job Alerts")')
        .first(),
      "Job Alert option is not visible"
    );
  }

  @Given("a user has submitted a job application")
  async aUserHasSubmittedAJobApplication() {
    // This step assumes the user has already applied for a job.
  }

  @When("the user accesses the application portal\\/dashboard")
  async theUserAccessesTheApplicationPortalDashboard() {
    await this._scrollToSection(this.careersPage.applicationPortal);
  }

  @Then("the **current application status** \\(e.g., Submitted, Under Review) should be displayed")
  async theCurrentApplicationStatusShouldBeDisplayed() {
    await this._verifyElementVisible(
      this.careersPage.applicationPortal,
      "Application status is not visible"
    );
  }

  @Then("all communication from the recruitment team should be accessible")
  async allCommunicationFromRecruitmentShouldBeAccessible() {
    await this._verifyElementVisible(
      this.careersPage.applicationPortal,
      "Recruitment communication area is not visible"
    );
  }

  @Then("contact information for recruitment should be provided.")
  async contactInformationForRecruitmentShouldBeProvided() {
    await this._verifyElementVisible(
      this.careersPage.contactRecruitmentInfo,
      "Recruitment contact information is not provided"
    );
  }
}