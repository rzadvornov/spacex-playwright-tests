import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedContext } from "../../../utils/types/Types";
import { AssertionHelper } from "../../../utils/AssertionHelper";

@Fixture("starshieldFormSteps")
export class StarshieldFormSteps {
  constructor(
    protected page: Page,
    protected starshieldPage: StarshieldPage,
    protected sharedContext: SharedContext,
    protected assertionHelper: AssertionHelper
  ) {}

  @Given("a contact form is available")
  async contactFormIsAvailable() {
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
  }

  @When("the user fills out required fields with valid information")
  async userFillsOutRequiredFieldsWithValidInfo() {
    await this.starshieldPage.fillInquiryForm(
      "valid.user@gov.mil",
      "Government Inquiry"
    );
  }

  @When("the user submits the form")
  async userSubmitsTheForm() {
    await this.starshieldPage.submitInquiryForm();
    await this.page.waitForTimeout(500);
  }

  @Then("the user should receive acknowledgment of submission")
  async theUserShouldReceiveAcknowledgmentOfSubmission() {
    await expect(
      this.starshieldPage.page.locator(
        ".form-success-message, .acknowledgment-banner"
      )
    ).toBeVisible();
  }

  @Then("a confirmation message should be displayed")
  async confirmationMessageShouldBeDisplayed() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toBeVisible();
  }

  @When("the user submits the form with missing required fields")
  async userSubmitsFormWithMissingRequiredFields() {
    await this.starshieldPage.emailField.fill("test@test.com");
    await this.starshieldPage.submitButton.click();
  }

  @Then("appropriate validation errors should be displayed")
  async appropriateValidationErrorsShouldBeDisplayed() {
    await expect(
      this.starshieldPage.inquiryForm.locator(".error-message").first()
    ).toBeVisible();
  }

  @Then("the form should not be submitted")
  async formShouldNotBeSubmitted() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).not.toBeVisible();
  }

  @Given("a contact form with an email field is present")
  async contactFormWithEmailFieldIsPresent() {
    await expect(this.starshieldPage.emailField).toBeVisible();
  }

  @When("the user enters an invalid email format")
  async userEntersInvalidEmailFormat() {
    this.sharedContext.mediaType = "invalid-email";
    await this.starshieldPage.emailField.fill("invalid-email-format");
  }

  @When("And attempts to submit the form")
  async andAttemptsToSubmitTheForm() {
    await this.starshieldPage.submitButton.click();
  }

  @Then("an email format validation error should be displayed")
  async emailFormatValidationErrorShouldBeDisplayed() {
    await expect(
      this.starshieldPage.inquiryForm.locator(".email-error-message")
    ).toBeVisible();
  }

  @Given("a contact form with text fields is present")
  async contactFormWithTextFieldsIsPresent() {
    await expect(this.starshieldPage.inquiryForm).toBeVisible();
    await expect(
      this.starshieldPage.inquiryForm.locator('input[type="text"]').first()
    ).toBeVisible();
  }

  @When("the user enters text exceeding maximum length limits")
  async userEntersTextExceedingMaximumLengthLimits() {
    const longText = "A".repeat(5000);
    await this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first()
      .fill(longText);
  }

  @Then("the input should be truncated or rejected")
  async inputShouldBeTruncatedOrRejected() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();
    const maxLength = await inputField.getAttribute("maxlength");

    const expectedMaxLength = maxLength ? parseInt(maxLength, 10) : 5000;
    expect(inputValue.length).toBeLessThanOrEqual(expectedMaxLength);
  }

  @Then("a character count or limit warning should be displayed")
  async aCharacterCountOrLimitWarningShouldBeDisplayed() {
    const limitWarning = this.starshieldPage.inquiryForm.locator(
      ".char-count, .limit-warning, .error-message"
    );
    await expect(limitWarning).toBeVisible();
  }

  @Then("the form should handle the input without breaking")
  async theFormShouldHandleTheInputWithoutBreaking() {
    await expect(this.starshieldPage.submitButton).toBeVisible();
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Given("a user is submitting a contact form")
  async userIsSubmittingAContactForm() {
    await this.starshieldPage.fillInquiryForm(
      "valid@test.com",
      "Required Text"
    );
    await expect(this.starshieldPage.submitButton).toBeEnabled();
  }

  @When("the user clicks submit multiple times rapidly")
  async userClicksSubmitMultipleTimesRapidly() {
    await this.starshieldPage.submitButton.click({ clickCount: 3, delay: 50 });
    this.sharedContext.startTime = Date.now();
    await this.page.waitForSelector(".form-success-message, .error-message", {
      timeout: 10000,
    });
  }

  @Then("only one submission should be processed")
  async onlyOneSubmissionShouldBeProcessed() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toHaveCount(1);
  }

  @Then("the submit button should be disabled during processing")
  async theSubmitButtonShouldBeDisabledDuringProcessing() {
    await expect(this.starshieldPage.submitButton).toBeDisabled({
      timeout: 50,
    });
  }

  @Then("duplicate submissions should be prevented")
  async duplicateSubmissionsShouldBePrevented() {
    await expect(
      this.starshieldPage.page.locator(".form-success-message")
    ).toHaveCount(1);
    await expect(this.starshieldPage.submitButton).toBeDisabled();
  }

  @Given("a user is filling out a long form")
  async userIsFillingOutALongForm() {
    await this.starshieldPage.fillInquiryForm(
      "longform@session.com",
      "Session Data"
    );
    await this.starshieldPage.inquiryForm.scrollIntoViewIfNeeded();
  }

  @When("the session expires before submission")
  async theSessionExpiresBeforeSubmission() {
    await this.page.waitForTimeout(5000);
    await this.starshieldPage.submitButton.click();
  }

  @Then("the user should be notified of the timeout")
  async theUserShouldBeNotifiedOfTheTimeout() {
    await expect(
      this.starshieldPage.page.locator(
        ".session-timeout-message, .relogin-required"
      )
    ).toBeVisible();
  }

  @Then("form data should be preserved if possible")
  async formDataShouldBePreservedIfPossible() {
    const emailValue = await this.starshieldPage.emailField.inputValue();
    expect(emailValue).toContain("longform@session.com");
  }

  @Then("the user should be able to reauthenticate and continue")
  async theUserShouldBeAbleToReauthenticateAndContinue() {
    const reauthButton = this.starshieldPage.page.locator("button, a", {
      hasText: /reauthenticate|login|continue session/i,
    });
    await expect(reauthButton).toBeVisible();
  }

  @When("the user enters special characters or script tags in text fields")
  async userEntersSpecialCharactersOrScriptTags() {
    const testInput =
      "<script>alert('xss')</script> or special chars: &nbsp; © ®";
    await this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first()
      .fill(testInput);
  }

  @Then("the input should be properly sanitized")
  async inputShouldBeProperlySanitized() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();

    expect(inputValue).not.toContain("<script>");
    expect(inputValue).not.toContain("</script>");
  }

  @Then("malicious content should be rejected or escaped")
  async maliciousContentShouldBeRejectedOrEscaped() {
    const inputField = this.starshieldPage.inquiryForm
      .locator('input[type="text"]')
      .first();
    const inputValue = await inputField.inputValue();

    const hasDangerousContent =
      inputValue.includes("<script>") ||
      inputValue.includes("javascript:") ||
      inputValue.includes("onerror=");
    expect(hasDangerousContent).toBeFalsy();
  }

  @Then("an appropriate error or warning should be shown if input is invalid")
  async appropriateErrorOrWarningForInvalidInput() {
    const errorMessage = this.starshieldPage.inquiryForm.locator(
      ".error-message, .warning-message"
    );
    if (await errorMessage.isVisible()) {
      const errorText = await errorMessage.textContent();
      expect(errorText?.toLowerCase()).toMatch(
        /invalid|not allowed|special characters/i
      );
    }
  }

  @Then("the user should be guided to correct the errors")
  async userShouldBeGuidedToCorrectErrors() {
    const errorMessages =
      this.starshieldPage.inquiryForm.locator(".error-message");
    await expect(errorMessages.first()).toBeVisible();
    const errorText = await errorMessages.first().textContent();
    expect(errorText?.toLowerCase()).toMatch(/required|missing|please enter/i);
  }

  @Then("the email field should be highlighted for correction")
  async emailFieldShouldBeHighlightedForCorrection() {
    const emailField = this.starshieldPage.emailField;
    const hasErrorClass = await emailField.evaluate(
      (el) => el.classList.contains("error") || el.classList.contains("invalid")
    );
    const borderColor = await emailField.evaluate(
      (el) => window.getComputedStyle(el).borderColor
    );

    expect(
      hasErrorClass || borderColor.includes("rgb(255, 0, 0)")
    ).toBeTruthy();
  }

  @When("attempts to submit the form")
  async attemptsToSubmitTheForm() {
    await this.starshieldPage.submitButton.click();
    await this.page.waitForTimeout(500);
  }

  @When("submits the form")
  async submitsTheForm() {
    await expect(this.starshieldPage.submitButton).toBeEnabled();
    await this.starshieldPage.submitButton.click();

    await Promise.race([
      this.page.waitForSelector(
        ".form-success-message, .acknowledgment-banner",
        { timeout: 5000 }
      ),
      this.page.waitForSelector(".error-message, .validation-error", {
        timeout: 5000,
      }),
      this.page.waitForTimeout(1000),
    ]);
  }
}
