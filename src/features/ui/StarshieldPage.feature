Feature: Starshield Navigation and Information Display
  As a government agency representative or potential Starshield customer, I want to navigate the Starshield homepage effectively so that I can find relevant information about services, capabilities, and contact options.

  Background:
    Given the user is on the Starshield homepage

  @smoke @critical
  Scenario: Viewing the main landing page
    When the Starshield page loads
    Then the Starshield branding should be displayed
    And the main navigation menu should be visible
    And the hero section should contain information about Starshield's purpose
    And the page should match the snapshot "starshield_initial_load"

  @navigation @interactive
  Scenario: Accessing navigation menu items
    Given the main navigation is visible
    When the user clicks on a navigation menu item
    Then the page should scroll to or navigate to the corresponding section
    And the content should be displayed without errors

  @navigation @usability
  Scenario: Breadcrumb navigation
    Given the user is viewing a Starshield subpage or section
    When breadcrumb navigation is present
    Then the current page location should be indicated
    And users should be able to navigate back to parent pages
    And the breadcrumb should reflect the page hierarchy accurately

  @navigation @footer
  Scenario: Footer navigation
    Given the user scrolls to the page footer
    When the footer is visible
    Then additional navigation links should be available
    And social media links should be present if applicable
    And copyright and company information should be displayed

  @interactive @cta
  Scenario: Call-to-action elements
    Given the page contains call-to-action buttons or links
    When the user hovers over or focuses on CTAs
    Then the CTA purpose should be clear from the text
    And clicking should lead to the expected destination or action

  @core-business @earth-observation @functional @critical @content-display
  Scenario: Viewing Earth Observation capabilities
    Given the user is viewing the services section
    When the user navigates to Earth Observation information
    Then details about sensing payload satellites should be displayed
    And information about data collection capabilities should be shown
    And use cases for government reconnaissance should be explained

  @technical @specifications
  Scenario: Exploring Earth Observation technical specifications
    Given the user is viewing Earth Observation details
    When technical specifications are displayed
    Then satellite sensor capabilities should be described
    And resolution and coverage information should be provided
    And data delivery methods should be explained

  @use-cases @content-display
  Scenario: Understanding Earth Observation use cases
    Given the user wants to understand practical applications
    When viewing Earth Observation use cases
    Then government intelligence applications should be described
    And disaster response capabilities should be mentioned
    And environmental monitoring options should be detailed

  @core-business @communications @functional @critical @content-display @security
  Scenario: Viewing Communications capabilities
    Given the user is viewing the services section
    When the user navigates to Communications information
    Then secure communications features should be described
    And high-assurance cryptographic capabilities should be mentioned
    And government-grade encryption standards should be highlighted

  @security @technical
  Scenario: Understanding secure network capabilities
    Given the user is reviewing Communications features
    When network security information is displayed
    Then end-to-end encryption features should be explained
    And network resilience capabilities should be described
    And low-latency communication benefits should be highlighted

  @infrastructure @technical
  Scenario: Exploring Communications infrastructure
    Given the user wants technical infrastructure details
    When viewing Communications infrastructure information
    Then satellite constellation details should be provided
    And ground station connectivity should be explained
    And global coverage capabilities should be illustrated

  @core-business @hosted-payloads @functional @critical @content-display
  Scenario: Viewing Hosted Payloads capabilities
    Given the user is viewing the services section
    When the user navigates to Hosted Payloads information
    Then satellite bus support for customer missions should be described
    And payload integration capabilities should be explained
    And custom mission support options should be detailed

  @technical @integration
  Scenario: Understanding payload integration process
    Given the user wants to understand payload hosting
    When integration process information is displayed
    Then payload specifications and requirements should be listed
    And integration timeline information should be provided
    And technical support capabilities should be described

  @use-cases @custom-solutions
  Scenario: Exploring custom mission options
    Given a government agency has unique mission requirements
    When viewing custom mission information
    Then mission flexibility options should be explained
    And dedicated satellite capabilities should be described
    And mission lifecycle support should be detailed

  @core-business @security @compliance @functional @critical @security @content-display
  Scenario: Understanding security features
    Given the user is reading about Starshield's security
    When security specifications are displayed
    Then cryptographic capability information should be present
    And classified payload hosting features should be described
    And government security requirement compliance should be stated

  @differentiation @content-display
  Scenario: Comparing Starshield to commercial Starlink
    Given the user wants to understand Starshield's unique positioning
    When viewing comparison information
    Then government-specific use cases should be distinguished from commercial use
    And enhanced security features beyond Starlink should be explained
    And government ownership and control aspects should be clarified

  @compliance @certifications @critical
  Scenario: Understanding compliance and certifications
    Given the user needs to verify regulatory compliance
    When compliance information is displayed
    Then relevant government certifications should be listed
    And security clearance requirements should be specified
    And regulatory framework adherence should be documented

  @contact @forms @functional @critical @content-display
  Scenario: Finding contact information for government inquiries
    Given a government agency wants to inquire about Starshield
    When the user looks for contact information
    Then government-specific contact details or forms should be available
    And inquiry submission methods should be clear
    And appropriate security notices for sensitive communications should be present

  @forms @interactive @critical
  Scenario: Submitting an inquiry form
    Given a contact form is available
    When the user fills out required fields with valid information
    And the user submits the form
    Then a confirmation message should be displayed
    And the user should receive acknowledgment of submission

  @security @content-display
  Scenario: Accessing specialized government contact channels
    Given a user from a government agency needs direct contact
    When looking for specialized contact options
    Then secure communication channels should be offered
    And appropriate department contacts should be listed
    And clearance-level specific contact information should be provided if applicable

  @multimedia @content-display @functional @images @performance
  Scenario: Loading hero images and graphics
    Given the page contains hero images or graphics
    When the Starshield page loads
    Then images should load progressively or with placeholders
    And images should have appropriate alt text for accessibility
    And images should be optimized for web performance

  @video @interactive
  Scenario: Playing video content if present
    Given the page contains video content
    When the user interacts with video controls
    Then the video should play smoothly
    And playback controls should be responsive
    And video should support pause, play, and volume adjustment

  @infographics @technical
  Scenario: Viewing infographics or technical diagrams
    Given the page displays technical information
    When infographics or diagrams are present
    Then they should be clear and legible
    And they should scale appropriately for different devices
    And they should convey technical specifications accurately

  @content-accuracy @data-integrity @functional @critical @technical @specifications
  Scenario: Technical specifications display
    Given technical specifications are shown on the page
    When the user reviews the specifications
    Then information should be current and accurate
    And units of measurement should be clearly indicated
    And capabilities should align with official government contracts

  @testimonials @content-display
  Scenario: Customer testimonials or case studies
    Given customer information is displayed
    When viewing testimonials or case studies
    Then proper attribution should be given
    And the information should be verifiable
    And content should comply with government disclosure requirements

  @error-handling @forms @validation @critical @validation @negative-test
  Scenario: Handling invalid form submissions
    Given a contact form is available
    When the user submits the form with missing required fields
    Then appropriate validation errors should be displayed
    And the form should not be submitted
    And the user should be guided to correct the errors

  @validation @email @negative-test
  Scenario: Handling invalid email format
    Given a contact form with an email field is present
    When the user enters an invalid email format
    And attempts to submit the form
    Then an email format validation error should be displayed
    And the form should not be submitted
    And the email field should be highlighted for correction

  @security @validation @edge-case
  Scenario: Handling special characters in form fields
    Given a contact form is available
    When the user enters special characters or script tags in text fields
    And submits the form
    Then the input should be properly sanitized
    And malicious content should be rejected or escaped
    And an appropriate error or warning should be shown if input is invalid

  @error-handling @navigation @links @404 @error @negative-test
  Scenario: Handling broken links
    Given the page contains internal or external links
    When a user clicks on a broken link
    Then an appropriate 404 page should be displayed
    And the error should be logged for correction

  @navigation @error @negative-test
  Scenario: Handling navigation to non-existent sections
    Given the user clicks on a navigation link
    When the target section or page does not exist
    Then a user-friendly error message should be displayed
    And alternative navigation options should be provided
    And the user should remain on a functional page

  @external-links @error @edge-case
  Scenario: Handling external link failures
    Given the page contains external links
    When an external link target is unavailable
    Then the user should be notified appropriately
    And the page should remain functional

  @error-handling @multimedia @fallback @images @error @negative-test
  Scenario: Handling failed image loads
    Given the page contains images
    When an image fails to load
    Then a placeholder or fallback image should be displayed
    And the page layout should not be broken
    And alt text should be visible if supported

  @video @error @negative-test
  Scenario: Handling video loading failures
    Given the page contains video content
    When a video fails to load or is unavailable
    Then an appropriate error message should be displayed in the video player
    And alternative content or retry option should be offered
    And the rest of the page should remain functional

  @performance @media @edge-case
  Scenario: Handling slow media loading
    Given the user has a slow network connection
    When media content is loading
    Then loading indicators should be displayed
    And the page should remain responsive
    And users should have the option to cancel or skip media loading

  @error-handling @network @performance @network @error @negative-test
  Scenario: Network error handling
    Given a network interruption occurs during page load
    When assets fail to load
    Then appropriate fallbacks should be in place
    And the user should be notified of loading issues
    And retry mechanisms should be available where appropriate

  @javascript @fallback @edge-case
  Scenario: Graceful degradation
    Given JavaScript fails to load or is disabled
    When the user views the page
    Then core content should still be accessible
    And basic navigation should remain functional
    And critical information should be visible without JavaScript

  @api @error @negative-test
  Scenario: Handling API failures
    Given the page relies on API calls for dynamic content
    When an API call fails or times out
    Then cached or default content should be displayed where possible
    And an appropriate error message should inform the user
    And the page should allow retry or refresh actions

  @error-handling @forms @edge-cases @validation @edge-case @negative-test
  Scenario: Handling extremely long text input
    Given a contact form with text fields is present
    When the user enters text exceeding maximum length limits
    Then the input should be truncated or rejected
    And a character count or limit warning should be displayed
    And the form should handle the input without breaking

  @concurrency @edge-case @critical
  Scenario: Handling concurrent form submissions
    Given a user is submitting a contact form
    When the user clicks submit multiple times rapidly
    Then only one submission should be processed
    And the submit button should be disabled during processing
    And duplicate submissions should be prevented

  @session @timeout @edge-case
  Scenario: Handling session timeout during form completion
    Given a user is filling out a long form
    When the session expires before submission
    Then the user should be notified of the timeout
    And form data should be preserved if possible
    And the user should be able to reauthenticate and continue

  @error-handling @content-display @edge-cases @content @error @edge-case
  Scenario: Handling missing content sections
    Given content is expected in a specific section
    When the content is missing or unavailable
    Then a placeholder message should be displayed
    And the page layout should adjust appropriately

  @content @compatibility @edge-case
  Scenario: Handling content in unsupported formats
    Given the page attempts to display content
    When the content format is not supported by the browser
    Then an appropriate fallback or alternative should be provided
    And the user should be notified of the limitation
    And a download option should be offered if applicable

  @dynamic-content @error @negative-test
  Scenario: Handling dynamic content loading failures
    Given the page loads content dynamically
    When dynamic content fails to load
    Then static fallback content should be displayed
    And the failure should not affect other page sections
