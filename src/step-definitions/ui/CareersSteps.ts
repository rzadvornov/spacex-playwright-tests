import { expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { CareersPage } from "../../pages/ui/CareersPage";
import { SharedContext } from "../../pages/types/Types";
import { SharedPageSteps } from "./SharedPageSteps";

@Fixture("careersSteps")
export class CareersSteps {
  constructor(
    private careersPage: CareersPage,
    private sharedContext: SharedContext,
    private sharedPageSteps: SharedPageSteps
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
}
