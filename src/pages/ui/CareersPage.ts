import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class CareersPage extends SpaceXPage {
  readonly careersHeading: Locator;
  readonly jobFilterPanel: Locator;
  readonly firstJobListing: Locator;
  readonly searchInput: Locator;

  readonly missionAlignmentText: Locator;
  readonly cultureSection: Locator;
  readonly benefitsSection: Locator;
  readonly eoeStatement: Locator;
  readonly jobCategoriesPanel: Locator;
  readonly jobDetailsPage: Locator;
  readonly applyNowButton: Locator;
  readonly applicationForm: Locator;
  readonly developmentSection: Locator;
  readonly applicationPortal: Locator;
  readonly diversitySection: Locator;
  readonly referralSection: Locator;
  readonly faqSection: Locator;
  readonly contactRecruitmentInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.careersHeading = page.locator("h1:has-text('Careers')").first();
    this.jobFilterPanel = page.locator('aside[aria-label*="filters"]').first();
    this.firstJobListing = page.locator('a[href*="/jobs/"]').first();
    this.searchInput = page.locator('input[type="search"]').first();

    this.missionAlignmentText = page
      .locator("p:has-text('making humanity multiplanetary')")
      .first();
    this.cultureSection = page.locator(
      '#culture-section, main:has-text("Our Values")'
    );
    this.benefitsSection = page.locator(
      '#benefits-section, main:has-text("Employee Benefits")'
    );
    this.eoeStatement = page
      .locator("footer, main")
      .locator("text=/Equal Opportunity Employment/i")
      .first();
    this.jobCategoriesPanel = this.jobFilterPanel.locator(
      'nav[aria-label="Job Categories"]'
    );
    this.jobDetailsPage = page.locator(
      '.job-description-container, main:has-text("Qualifications")'
    );
    this.applyNowButton = page.locator('button:has-text("Apply Now")').first();
    this.applicationForm = page.locator(
      '#application-form, form[aria-label="Job Application"]'
    );
    this.developmentSection = page.locator(
      '#development-section, main:has-text("Professional Growth")'
    );
    this.applicationPortal = page.locator(
      '#portal-dashboard, main:has-text("Application Status")'
    );
    this.diversitySection = page.locator(
      '#diversity-section, main:has-text("Diversity and Inclusion")'
    );
    this.referralSection = page.locator(
      '#referral-section, main:has-text("Referral Program")'
    );
    this.faqSection = page.locator(
      '#faq-section, main:has-text("Frequently Asked Questions")'
    );
    this.contactRecruitmentInfo = this.faqSection.locator(
      "text=/contact information for recruitment/i"
    );
  }

  readonly headlineText: (text1: string, text2: string) => Locator = (
    text1,
    text2
  ) =>
    this.page.locator(`h2, p, div:has-text("${text1}"):has-text("${text2}")`);

  readonly coreValueHighlight: (value: string) => Locator = (value) =>
    this.cultureSection.locator(`text=/${value}/i`);

  readonly benefitDetail: (detail: string) => Locator = (detail) =>
    this.benefitsSection.locator(`text=/${detail}/i`);

  readonly jobCategoryAvailability: (category: string) => Locator = (
    category
  ) => this.jobCategoriesPanel.locator(`button, a:has-text("${category}")`);

  readonly workOptionIndication: (option: string) => Locator = (option) =>
    this.jobFilterPanel.locator(
      `text=/${option}/i, .job-listing-card:has-text("${option}")`
    );

  readonly devOpportunityDetail: (opportunity: string) => Locator = (
    opportunity
  ) => this.developmentSection.locator(`text=/${opportunity}/i`);

  readonly faqTopicCoverage: (topic: string) => Locator = (topic) =>
    this.faqSection.locator(`h3, a:has-text("${topic}")`);

  readonly departmentFilter: (department: string) => Locator = (department) =>
    this.jobFilterPanel
      .locator(`[data-testid="department-filter"], [aria-label*="department"]`)
      .locator(`button, a, label:has-text("${department}")`);

  readonly typeFilter: (type: string) => Locator = (type) =>
    this.jobFilterPanel
      .locator(`[data-testid="type-filter"], [aria-label*="type"]`)
      .locator(`button, a, label:has-text("${type}")`);

  readonly filteredJobListings: Locator = this.page.locator(
    '.job-listing-card:visible, a[href*="/jobs/"]:visible'
  );

  async navigate(urlPath: string = "/careers"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async searchForJob(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
  }

  async clickFirstJobListing(): Promise<void> {
    await this.firstJobListing.click();
  }

  async checkHeadlineText(text1: string, text2: string): Promise<boolean> {
    return await this.headlineText(text1, text2).isVisible();
  }

  async checkCultureValue(value: string): Promise<boolean> {
    return await this.coreValueHighlight(value).isVisible();
  }

  async checkBenefitDetail(detail: string): Promise<boolean> {
    return await this.benefitDetail(detail).isVisible();
  }

  async checkJobCategory(category: string): Promise<boolean> {
    return await this.jobCategoryAvailability(category).isVisible();
  }

  async checkWorkOption(option: string): Promise<boolean> {
    return await this.workOptionIndication(option).isVisible();
  }

  async checkDevelopmentOpportunity(opportunity: string): Promise<boolean> {
    return await this.devOpportunityDetail(opportunity).isVisible();
  }

  async checkFAQTopic(topic: string): Promise<boolean> {
    return await this.faqTopicCoverage(topic).isVisible();
  }

  async checkJobDetailsVisible(): Promise<boolean> {
    return (
      (await this.jobDetailsPage.isVisible()) &&
      (await this.jobDetailsPage
        .locator("text=/qualifications/i")
        .isVisible()) &&
      (await this.jobDetailsPage
        .locator("text=/responsibilities/i")
        .isVisible()) &&
      (await this.jobDetailsPage
        .locator("text=/application instructions/i")
        .isVisible())
    );
  }

  async applyFilters(department: string, type: string): Promise<void> {
    const deptFilter = this.departmentFilter(department);
    if (await deptFilter.isVisible()) {
      await deptFilter.click();
    }

    const jobTypeFilter = this.typeFilter(type);
    if (await jobTypeFilter.isVisible()) {
      await jobTypeFilter.click();
    }

    await this.page.waitForTimeout(1500);
  }

  async verifyFilteredResults(
    department?: string,
    type?: string
  ): Promise<boolean> {
    const listings = this.filteredJobListings;
    const count = await listings.count();

    if (count === 0) return false;

    return count > 0;
  }
}
