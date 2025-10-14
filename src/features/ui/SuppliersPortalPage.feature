Feature: Manage Existing Supplier Account via Private Portal
  As a potential or existing vendor
  I want to access supplier portal features and account management
  So that I can effectively engage with SpaceX procurement and supply chain.

  Background:
    Given a supplier is logged into the private Supplier Portal

  @portal @dashboard @data-integrity
  Scenario: Access Supplier Dashboard and View Key Information
    When the supplier views the main dashboard
    Then the dashboard should display a summary of:
      | Dashboard Section               | Status  |
      | Current and Past Orders         | Summary |
      | Delivery Schedules              | Summary |
      | Quality Metrics and Performance | Summary |
      | Communication and Alerts        | Latest  |
      | Account and Billing Information | Summary |
    And the page should match the snapshot "suppliers_portal_initial_load"

  @portal @orders @tracking
  Scenario: Track Order Status and Details
    When the supplier checks a specific order
    Then the order details should include:
      | Order Detail                                  | Display Status    |
      | Order Number and Date                         | Must be displayed |
      | Component Description                         | Must be displayed |
      | Quantity and Unit Pricing                     | Must be displayed |
      | Delivery Deadline                             | Must be displayed |
      | Current Status (e.g., In Production, Shipped) | Must be displayed |

  @portal @quality @metrics
  Scenario: Review Quality and Performance Metrics
    When the supplier reviews performance data
    Then the following key metrics should be accurately displayed:
      | Performance Metric               | Display Format             |
      | On-Time Delivery Percentage      | Percentage (%)             |
      | Quality Acceptance Rates         | Percentage (%)             |
      | Defect Rates and Issues Log      | Must be displayed          |
      | Performance Trends Over Time     | Must include a graph/chart |
      | Compliance Status (e.g., AS9100) | Current status             |

  @portal @submission @compliance
  Scenario: Submit Compliance Documentation
    When the supplier needs to upload compliance documents
    Then a secure **document upload portal** should be available
    And the required document types and specifications should be clearly listed
    And submission deadline reminders should be clearly provided

  @portal @account @settings
  Scenario: Manage Supplier Account Settings
    When the supplier accesses account settings
    Then management options should include:
      | Account Management Option | Status             |
      | Edit Company Information  | Must be functional |
      | Update Contact Details    | Must be functional |
      | Change Password           | Must be functional |
      | Manage User Accounts      | Must be functional |

  @portal @rfq @submission
  Scenario: Submit Detailed RFQ Response
    Given a supplier is viewing a specific RFQ
    When the supplier wants to bid on the opportunity
    Then a structured submission form should be available, requiring:
      | Required Submission Field | Status    |
      | Pricing                   | Mandatory |
      | Delivery Timeline         | Mandatory |
      | Quality Certifications    | Mandatory |
      | Production Capacity       | Mandatory |

  @portal @training @onboarding
  Scenario: Access Supplier Training and Onboarding Resources
    When the supplier seeks training materials
    Then a training resources section should be available, including:
      | Training Resource           | Format                |
      | Quality Standards Training  | Module or Document    |
      | Portal Navigation Tutorials | Video or Step-by-step |
      | Compliance Training Modules | Module or Document    |
      | Video Guides and FAQs       | Must be available     |

  @suppliers @alerts @marketing
  Scenario: Subscribe to Supplier Updates and Alerts
    When the user wants to stay informed about program changes
    Then a newsletter or alert subscription option should be available
    And the user should be able to select subscription topics, including:
      | Subscription Topic             | Status     |
      | New RFQ Opportunities          | Selectable |
      | Program Updates and Changes    | Selectable |
      | Compliance and Training Alerts | Selectable |
