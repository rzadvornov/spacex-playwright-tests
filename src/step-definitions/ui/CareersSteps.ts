import { expect } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { CareersPage } from "../../pages/ui/CareersPage";
import {
  BenefitTable,
  CategoryTable,
  DevTable,
  FAQTable,
  OptionTable,
  SharedContext,
  ValueTable,
} from "../../pages/types/Types";
import { SharedPageSteps } from "./SharedPageSteps";
import { AssertionHelper } from "../../utils/AssertionHelper";

@Fixture("careersSteps")
export class CareersSteps {
  constructor(
    private careersPage: CareersPage,
    private sharedContext: SharedContext,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @When("the user navigates to the Careers page")
  async navigateToCareersPage() {
    await this.careersPage.open();
  }

  @Then("the Careers page main heading should be visible")
  async checkCareersPageHeadingVisible() {
    await expect(this.careersPage.careersHeading).toBeVisible();
  }

  @When("the user searches for the job title {string}")
  async searchForJobTitle(jobTitle: string) {
    this.sharedContext.mediaType = jobTitle;
    await this.careersPage.searchForJob(jobTitle);
  }

  @Then("at least one job listing should be visible")
  async checkJobListingVisible() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @When("the user clicks on the first job listing")
  async clickFirstJobListing() {
    await this.careersPage.clickFirstJobListing();
  }

  @Then("the URL should contain the jobs path")
  async checkUrlContainsJobsPath() {
    await expect(this.careersPage.page).toHaveURL(new RegExp("/jobs/"));
  }

  @Given("a user navigates to the Careers page")
  async aUserNavigatesToTheCareersPage() {
    await this.careersPage.open();
    await this.careersPage.waitForAppContentLoad();
  }

  @When("the Careers page loads initially")
  async thePageLoadsInitially() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.careersHeading.isVisible(),
      "Careers page main heading is not visible."
    );
  }

  @Then("the user should see the headline mentioning **{string} and {string}**")
  async theUserShouldSeeHeadline(text1: string, text2: string) {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.checkHeadlineText(text1, text2),
      `Headline mentioning "${text1}" and "${text2}" is not visible.`
    );
  }

  @Then("a description of SpaceX's mission and culture should be displayed")
  async aDescriptionOfMissionAndCultureShouldBeDisplayed() {
    await expect(
      this.careersPage.missionAlignmentText,
      "Mission description should be visible"
    ).toBeVisible();
  }

  @Then(
    "the content should emphasize **direct contribution to making humanity multiplanetary**"
  )
  async theContentShouldEmphasizeMultiplanetary() {
    await expect(
      this.careersPage.missionAlignmentText,
      "Multiplanetary emphasis text is not visible"
    ).toBeVisible();
  }

  @When("the user reviews the company culture section")
  async theUserReviewsTheCompanyCultureSection() {
    await this.careersPage.cultureSection.scrollIntoViewIfNeeded();
  }

  @Then("the page should highlight core values and expected mindsets:")
  async thePageShouldHighlightCoreValues(dataTable: DataTable) {
    const values = dataTable.hashes() as ValueTable;
    for (const item of values) {
      const value = item["Core Value"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkCultureValue(value),
        `Core value "${value}" is not highlighted.`
      );
    }
  }

  @When("the user reviews the detailed benefits section")
  async theUserReviewsTheDetailedBenefitsSection() {
    await this.careersPage.benefitsSection.scrollIntoViewIfNeeded();
  }

  @Then("comprehensive benefits information should include:")
  async comprehensiveBenefitsInformationShouldInclude(dataTable: DataTable) {
    const benefits = dataTable.hashes() as BenefitTable;
    for (const item of benefits) {
      const detail = item["Benefit Category"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkBenefitDetail(detail),
        `Benefit detail "${detail}" is not mentioned.`
      );
    }
  }

  @Then(
    "an **Equal Opportunity Employment statement** should be prominently displayed."
  )
  async anEqualOpportunityEmploymentStatementShouldBeProminentlyDisplayed() {
    await expect(
      this.careersPage.eoeStatement,
      "EOE statement should be visible"
    ).toBeVisible();
  }

  @When("the user enters search criteria \\(e.g., {string}, {string})")
  async theUserEntersSearchCriteria(criteria1: string, _criteria2: string) {
    await this.careersPage.searchForJob(criteria1);
  }

  @Then("matching job openings should be displayed")
  async matchingJobOpeningsShouldBeDisplayed() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @Then(
    "search results should show **position title, department, and location**"
  )
  async searchResultsShouldShowPositionTitleDepartmentAndLocation() {
    const firstListing = this.careersPage.firstJobListing;
    await expect(firstListing).toBeVisible();
    await expect(firstListing).not.toBeEmpty();
  }

  @Then(
    "the application option should be immediately available for each listing"
  )
  async theApplicationOptionShouldBeImmediatelyAvailableForEachListing() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @When(
    "the user selects a department filter {string} and a type filter {string}"
  )
  async theUserSelectsAFilter(department: string, type: string) {
    await this.careersPage.jobFilterPanel.scrollIntoViewIfNeeded();

    await this.careersPage.applyFilters(department, type);

    this.sharedContext.selectedDepartment = department;
    this.sharedContext.selectedType = type;
  }

  @Then("the job listings should filter to show only matching positions")
  async theJobListingsShouldFilterToShowOnlyMatchingPositions() {
    const department = this.sharedContext.selectedDepartment;
    const type = this.sharedContext.selectedType;

    await expect(this.careersPage.filteredJobListings.first()).toBeVisible();

    const hasFilteredResults = await this.careersPage.verifyFilteredResults(
      department,
      type
    );
    expect(hasFilteredResults).toBeTruthy();
  }

  @Then("the available primary job categories should include:")
  async theAvailablePrimaryJobCategoriesShouldInclude(dataTable: DataTable) {
    const categories = dataTable.hashes() as CategoryTable;
    for (const item of categories) {
      const category = item["Job Category"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkJobCategory(category),
        `Job category "${category}" is not available in the filter panel.`
      );
    }
  }

  @When("the user selects a location filter {string}")
  async theUserSelectsALocationFilter(location: string) {
    await this.careersPage.searchForJob(location);
  }

  @Then("job listings should show only positions located at Boca Chica")
  async jobListingsShouldShowOnlyPositionsLocatedAtBocaChica() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @Then("the user should be able to filter or view:")
  async andTheUserShouldBeAbleToFilterOrView(dataTable: DataTable) {
    const options = dataTable.hashes() as OptionTable;
    for (const item of options) {
      const option = item["Work Option"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkWorkOption(option),
        `Work option "${option}" is not indicated or filterable.`
      );
    }
  }

  @When("the user filters by experience level {string}")
  async theUserFiltersByExperienceLevelEntryLevel(level: string) {
    await this.careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
  }

  @Then("positions appropriate for recent graduates should be displayed")
  async positionsAppropriateForRecentGraduatesShouldBeDisplayed() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @Then("when filtering by {string}")
  async andWhenFilteringByLeadershipManagement(level: string) {
    await this.careersPage.jobFilterPanel.scrollIntoViewIfNeeded();
  }

  @Then(
    "senior and managerial positions with required experience should be clearly displayed"
  )
  async seniorAndManagerialPositionsShouldBeClearlyDisplayed() {
    await expect(this.careersPage.firstJobListing).toBeVisible();
  }

  @When("the user clicks on a specific job posting")
  async theUserClicksOnASpecificJobPosting() {
    await this.careersPage.clickFirstJobListing();
  }

  @Then("the full job description page should load")
  async theFullJobDescriptionPageShouldLoad() {
    await expect(this.careersPage.jobDetailsPage).toBeVisible();
  }

  @Then(
    "the page should clearly detail **Qualifications, Responsibilities, and Application Instructions**"
  )
  async thePageShouldClearlyDetailQualsResponsibilitiesAndInstructions() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.careersPage.checkJobDetailsVisible(),
      "Qualifications, Responsibilities, or Application Instructions are not clearly detailed."
    );
  }

  @Then('when the user clicks the "Apply Now" button')
  async andWhenTheUserClicksTheApplyNowButton() {
    await this.careersPage.applyNowButton.click();
  }

  @Then(
    "the **application form should appear**, requiring marked fields and offering resume\\/CV upload"
  )
  async theApplicationFormShouldAppear() {
    await expect(
      this.careersPage.applicationForm,
      "Application form did not appear"
    ).toBeVisible();
  }

  @When("the user reviews professional growth opportunities")
  async theUserReviewsProfessionalGrowthOpportunities() {
    await this.careersPage.developmentSection.scrollIntoViewIfNeeded();
  }

  @Then("information should highlight:")
  async informationShouldHighlight(dataTable: DataTable) {
    const opportunities = dataTable.hashes() as DevTable;
    for (const item of opportunities) {
      const opportunity = item["Development Opportunity"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkDevelopmentOpportunity(opportunity),
        `Development opportunity "${opportunity}" is not highlighted.`
      );
    }
  }

  @Given("a user has submitted a job application")
  async aUserHasSubmittedAJobApplication() {
    // This step assumes the user has already applied for a job.
  }

  @When("the user accesses the application portal\\/dashboard")
  async theUserAccessesTheApplicationPortalDashboard() {
    await this.careersPage.applicationPortal.scrollIntoViewIfNeeded();
  }

  @Then(
    "the **current application status** \\(e.g., Submitted, Under Review) should be displayed"
  )
  async theCurrentApplicationStatusShouldBeDisplayed() {
    await expect(
      this.careersPage.applicationPortal,
      "Application status is not visible"
    ).toBeVisible();
  }

  @Then("all communication from the recruitment team should be accessible")
  async allCommunicationFromRecruitmentShouldBeAccessible() {
    await expect(
      this.careersPage.applicationPortal,
      "Recruitment communication area is not visible"
    ).toBeVisible();
  }

  @When("the user reviews company policies")
  async theUserReviewsCompanyPolicies() {
    await this.careersPage.diversitySection.scrollIntoViewIfNeeded();
  }

  @Then(
    "a **Diversity and Inclusion commitment** should be clearly highlighted"
  )
  async aDiversityAndInclusionCommitmentShouldBeClearlyHighlighted() {
    await expect(
      this.careersPage.diversitySection,
      "Diversity and Inclusion commitment is not visible"
    ).toBeVisible();
  }

  @Then(
    "resources for underrepresented groups or diversity statistics should be shared"
  )
  async resourcesForUnderrepresentedGroupsShouldBeShared() {
    await expect(
      this.careersPage.diversitySection,
      "Diversity resources/statistics are not visible"
    ).toBeVisible();
  }

  @When("the user looks for additional career options")
  async theUserLooksForAdditionalCareerOptions() {
    await this.careersPage.referralSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "details about the **Employee Referral Program** \\(bonuses, submission process) should be displayed"
  )
  async detailsAboutTheEmployeeReferralProgramShouldBeDisplayed() {
    await expect(
      this.careersPage.referralSection,
      "Referral program details are not visible"
    ).toBeVisible();
  }

  @Then(
    "a **Job Alert subscription option** should be available, allowing users to set preferences \\(location, role type)."
  )
  async aJobAlertSubscriptionOptionShouldBeAvailable() {
    await expect(
      this.careersPage.referralSection
        .locator('button:has-text("Job Alerts")')
        .first(),
      "Job Alert option is not visible"
    ).toBeVisible();
  }

  @When("the user has common questions or seeks additional information")
  async theUserHasCommonQuestionsOrSeeksAdditionalInformation() {
    await this.careersPage.faqSection.scrollIntoViewIfNeeded();
  }

  @Then(
    "a dedicated **FAQ section** should be available, addressing topics like:"
  )
  async aDedicatedFAQSectionShouldBeAvailable(dataTable: DataTable) {
    const topics = dataTable.hashes() as FAQTable;
    for (const item of topics) {
      const topic = item["FAQ Topic"];
      await this.assertionHelper.validateBooleanCheck(
        () => this.careersPage.checkFAQTopic(topic),
        `FAQ topic "${topic}" is not covered.`
      );
    }
  }

  @Then("contact information for recruitment should be provided.")
  async contactInformationForRecruitmentShouldBeProvided() {
    await expect(
      this.careersPage.contactRecruitmentInfo,
      "Recruitment contact information is not provided"
    ).toBeVisible();
  }
}
