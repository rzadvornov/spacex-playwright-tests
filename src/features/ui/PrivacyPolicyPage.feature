@privacy @compliance @high-priority
Feature: View and Understand SpaceX Privacy Policy
  As a user or data subject
  I want to easily find and understand how SpaceX collects, uses, and protects my personal information
  So that I can make informed decisions regarding my data.

  Background:
    Given a user navigates to the Privacy Policy page

  @privacy @layout @navigation
  Scenario: View Policy Layout, Effective Date, and Table of Contents
    When the page loads successfully
    Then the user should see the complete SpaceX privacy policy document
    And the **effective date** (last updated date) should be prominently displayed
    And a navigable **Table of Contents** should list the following major sections:
      | Section Title                    | Availability   |
      | Information Collection Practices | Must be listed |
      | Information Usage                | Must be listed |
      | Information Sharing Policies     | Must be listed |
      | Security Measures                | Must be listed |
      | User Rights and Choices          | Must be listed |
      | Contact Information              | Must be listed |
    And the page should match the snapshot "privacy_policy_initial_load"  

  @privacy @collection @methods
  Scenario: Understand Information Collection Practices
    When the user navigates to the "Information Collection" section
    Then the policy should describe the types of information collected (personal, technical, behavioral)
    And the policy should clearly define the collection methods used (e.g., **forms, cookies, tracking**)
    And the document should differentiate between **optional and required** information

  @privacy @usage @marketing
  Scenario: Understand How Collected Information is Used
    When the user reads the "Information Usage" section
    Then the policy should explicitly state that collected data is used for:
      | Usage Purpose               | Status            |
      | Service Delivery            | Must be mentioned |
      | Communication/Notifications | Must be mentioned |
      | Marketing/Promotional Ends  | Must be mentioned |
      | Analytics and Improvement   | Must be mentioned |
      | Legal/Regulatory Compliance | Must be mentioned |

  @privacy @sharing @third-party
  Scenario: Review Data Sharing and Third-Party Practices
    When the user navigates to the "Data Sharing" section
    Then the policy should disclose **third parties** or categories of parties with access to data
    And the business purposes for data sharing should be clearly explained
    And the policy should clarify **SpaceX's non-responsibility for external third-party sites** linked from the page

  @privacy @security @protection
  Scenario: Review Security and Data Protection Measures
    When the user reviews the "Security Measures" section
    Then security practices should be described, including:
      | Security Practice            | Description Status |
      | Encryption/SSL/TLS Usage     | Must be described  |
      | Access Controls              | Must be described  |
      | Data Protection Measures     | Must be described  |
      | Incident Response Procedures | Must be described  |

  @privacy @gdpr @user-rights
  Scenario: View User Rights and Choices (Access, Correction, Deletion)
    When the user reads the "User Rights and Choices" section
    Then the following key user rights should be outlined:
      | User Right                    | Status           |
      | Right to Access Data          | Must be outlined |
      | Right to Correct Data         | Must be outlined |
      | Right to Delete Data          | Must be outlined |
      | Right to Opt-Out of Marketing | Must be outlined |
      | Right to Data Portability     | Must be outlined |

  @privacy @cookies @tracking
  Scenario: Understand Cookies and Opt-Out Mechanisms
    When the user navigates to the section detailing cookies and tracking
    Then the policy should clearly explain cookie types, purposes, and the role of **third-party trackers**
    And clear, functional **opt-out mechanisms** or instructions for managing cookies should be provided

  @privacy @international @retention
  Scenario: Understand International Data Transfers and Retention
    When the user reviews the policies on global operations
    Then the policy should address **data transfer mechanisms** (e.g., SCCs) and **countries** where data is processed
    And the policy should specify the **retention periods** for different data types
    And the procedures for data deletion and legal hold requirements should be included

  @privacy @children @coppa
  Scenario: Understand Children's Privacy Protections
    When the user navigates to the children's privacy section
    Then the policy should state **minimum age requirements** for using the services
    And the policy should clearly state that the site is not directed at minors and describe parental consent requirements

  @privacy @updates @notification
  Scenario: View Policy Update Procedures and Notification
    When the user looks for update procedures
    Then the policy should explain **how users are notified of material changes**
    And the document should clarify that continued use constitutes acceptance of new terms

  @privacy @contact @support
  Scenario: View Contact and Complaint Procedures
    When the user looks for privacy contact information
    Then contact details should be provided via a structured list for:
      | Contact Purpose             | Detail                 |
      | Privacy Inquiries/Requests  | Email or Address       |
      | Data Subject Requests       | Dedicated Process/Form |
      | Privacy Officer/DPO Contact | Must be listed         |

  @privacy @ux @download
  Scenario: Download Printable Privacy Policy Document
    When the user wants to save a copy of the policy
    Then a visible **download option (e.g., PDF link)** should be available
    And the downloaded document should accurately match the online version, including the effective date.

  @privacy @ux @search
  Scenario: Search Within the Privacy Policy Document
    When the user attempts to find specific information within the policy
    Then a **search function** should be available on the page
    And executing a search should highlight matching text within the document or navigate to the relevant section.
