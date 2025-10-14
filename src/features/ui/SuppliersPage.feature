@suppliers @public-info @high-priority
Feature: Learn About and Apply to the SpaceX Supplier Program
  As a potential or existing vendor
  I want to access program information, requirements
  So that I can effectively engage with SpaceX procurement and supply chain.

  Background:
    Given a user navigates to the Suppliers page

  @suppliers @overview @contact
  Scenario: View Supplier Program Overview and Contact Information
    When the page loads successfully
    Then the user should see SpaceX's supplier program information and its purpose
    And the program's benefits (e.g., long-term partnership, impact on space exploration) should be highlighted
    And clear contact information for supplier inquiries (email/phone) should be displayed
    And the page should match the snapshot "suppliers_initial_load"

  @suppliers @requirements @onboarding
  Scenario: Understand Supplier Qualification Criteria
    When the user reviews program requirements
    Then supplier qualification criteria should be clearly described:
      | Requirement Category       | Detail                           |
      | Quality Standards          | Must include AS9100 and ISO 9001 |
      | Manufacturing Capabilities | Must be detailed                 |
      | Technical Compliance       | Must be detailed                 |
      | Delivery and Support       | Must be detailed                 |
      | Regulatory Requirements    | Must be listed                   |
    And the page should list the accepted major certifications: **ISO 9001, AS9100, and SOC 2 compliance**

  @suppliers @onboarding @registration
  Scenario: Register as a New Supplier
    When the user wants to become a supplier
    Then a supplier registration form should be accessible
    And the required company information for initial screening should include:
      | Required Information          | Detail              |
      | Company Information           | Legal name, address |
      | Products/Services Offered     | Must be detailed    |
      | Certifications/Qualifications | Must be detailed    |
      | Contact Details               | Must be detailed    |
      | Business References           | Must be requested   |

  @suppliers @onboarding @submission
  Scenario: Submit Supplier Application and Receive Confirmation
    Given a user is completing supplier registration
    When the user successfully submits the application
    Then a visible confirmation message should appear
    And an application reference number should be provided to the user
    And the expected review timeline should be clearly communicated

  @suppliers @resources @documentation
  Scenario: View and Download Public Supplier Resources
    When the user looks for program documentation
    Then the following resources should be available for download:
      | Document Type                     | Format         |
      | Supplier Guidelines and Standards | PDF or similar |
      | Quality Assurance Requirements    | PDF or similar |
      | Technical Specifications          | PDF or similar |
      | RFQ (Request for Quote) Templates | Common format  |
      | Compliance Documentation          | PDF or similar |
    And document **versioning and last updated dates** should be clearly displayed.

  @suppliers @faq @help
  Scenario: Access Supplier FAQ and Common Questions
    When the user has common questions
    Then a FAQ section should be available
    And the FAQ should cover essential topics:
      | Topic Covered                 | Status           |
      | Application Process           | Must be detailed |
      | RFQ Submission Procedures     | Must be detailed |
      | Quality Requirements Overview | Must be detailed |
      | Payment Terms and Schedules   | Must be detailed |
      | Technical Support Options     | Must be detailed |

  @suppliers @procurement @rfq
  Scenario: View Active RFQ (Request for Quote) Opportunities
    When the user checks for active procurement opportunities
    Then a list of active RFQs should be displayed, each showing:
      | RFQ Detail                | Display Status                            |
      | Description of Components | Must be displayed                         |
      | Submission Deadline       | Must be displayed                         |
      | Quantity Requirements     | Must be displayed                         |
      | Technical Specifications  | Must be summarized with link to full spec |

  @suppliers @access @portal
  Scenario: View Supplier Portal Login
    When the user is an existing supplier
    Then a prominent link or section for the **Supplier Portal Login** should be accessible
    And the login form should require **username/email and password authentication**
    And a functional password reset option should be available
