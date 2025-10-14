@starlink @internet @high-priority
Feature: Explore Starlink Satellite Internet Service
  As a potential customer or interested party
  I want to learn about Starlink's service, pricing, and availability
  So that I can determine if Starlink is the right internet solution for me.

  Background:
    Given a user navigates to the Starlink page

  @starlink @overview @benefits
  Scenario: View Starlink Overview and Key Service Benefits
    When the page loads initially
    Then the user should see information about Starlink satellite internet
    And the mission to provide **global connectivity** should be highlighted
    And the service should clearly describe its core value propositions:
      | Benefit     | Detail                                          |
      | Speed       | High-speed internet connectivity                |
      | Latency     | Low latency (better than traditional satellite) |
      | Coverage    | Global coverage, including remote areas         |
      | Reliability | Reliable service for underserved locations      |
    And the page should match the snapshot "starlink_initial_load"

  @starlink @availability @geo
  Scenario: Check Service Availability in a Specific Area
    When the user wants to check if service is available in their area
    Then an interactive **availability checker** (e.g., address input form) should be available
    And when the user enters an address
    Then the system should display the service status as one of: **Available, Coming Soon (Waitlist), or Unavailable**

  @starlink @performance @metrics
  Scenario: View Internet Speed and Performance Specifications
    When the user reviews performance specifications
    Then key performance metrics should be displayed:
      | Metric Field       | Format/Range      |
      | Download Speeds    | Mbps range        |
      | Upload Speeds      | Mbps range        |
      | Latency            | Millisecond range |
      | Reliability/Uptime | Percentage (%)    |
    And the page should include performance comparisons to **traditional satellite or fixed broadband**

  @starlink @pricing @plans
  Scenario: View Service Plans and Total Cost Breakdown
    When the user reviews pricing options
    Then available service plans should be displayed, clearly differentiating:
      | Plan Type                   | Availability   |
      | Standard Residential Plan   | Must be listed |
      | Business/Professional Plans | Must be listed |
      | Mobile/Maritime Plans       | Must be listed |
    And a transparent **pricing breakdown** should include:
      | Cost Component           | Status                         |
      | One-time Equipment Cost  | Must be listed                 |
      | Installation/Setup Fee   | Must be listed (if applicable) |
      | Monthly Subscription Fee | Must be listed                 |

  @starlink @equipment @installation
  Scenario: Understand Equipment and Installation Requirements
    When the user seeks equipment and setup information
    Then equipment details should include the specifications of the **Starlink satellite dish and router**
    And the installation process should be explained, covering:
      | Installation Detail           | Status            |
      | Professional vs. Self-Install | Options           |
      | Dish Placement Requirements   | Must be described |
      | Connection Setup and Testing  | Must be described |
    And information regarding **warranty and power requirements** should be available

  @starlink @use-cases @applications
  Scenario: View Use Cases and Applications
    When the user reviews service applications
    Then the following use cases should be described:
      | Use Case Category           | Status            |
      | Remote Home Internet        | Must be described |
      | RV and Mobile Connectivity  | Must be described |
      | Maritime/Boat Internet      | Must be described |
      | Emergency/Disaster Recovery | Must be described |

  @starlink @business @enterprise
  Scenario: View Starlink for Business Options
    When the user reviews business options
    Then the page should clearly present commercial/enterprise plans, highlighting:
      | Business Feature              | Status                   |
      | Higher Capacity/Priority      | Must be noted            |
      | SLA (Service Level Agreement) | Option must be mentioned |
      | Dedicated Business Support    | Must be offered          |

  @starlink @astronomy @sustainability
  Scenario: Understand Satellite Brightness Mitigation Efforts
    When the user reads about astronomy impacts and environmental commitment
    Then brightness mitigation efforts should be described, including:
      | Mitigation Effort               | Status            |
      | Visor deployment on satellites  | Must be described |
      | Low-altitude de-orbiting design | Must be described |
      | Collaboration with astronomers  | Must be described |

  @starlink @signup @purchase
  Scenario: Initiate Sign-Up for Available Service
    Given service is reported as "Available" for the user's address
    When the user clicks the "Order Now" button
    Then an order/sign-up process should be initiated
    And the user should be prompted to provide **service address, contact info, and payment method**

  @starlink @waitlist @preorder
  Scenario: Join Waitlist for Service in Unavailable Areas
    Given service is reported as "Coming Soon" for the user's address
    When the user seeks to secure future service
    Then a **waitlist option** should be available
    And the user should be able to submit their address and receive **pre-order instructions** (if applicable)

  @starlink @support @resources
  Scenario: Access Customer Support and Community Resources
    When the user looks for support options
    Then a dedicated support section should be available, including:
      | Support Resource          | Status           |
      | Help and FAQ Section      | Must be linked   |
      | Technical Support Contact | Must be provided |
      | Community Forum/Resources | Must be linked   |
      | Account Management Portal | Must be linked   |

  @starlink @updates @news
  Scenario: View Starlink Development Updates
    When the user seeks recent news and updates
    Then recent updates and announcements should be displayed, including:
      | Update Type                   | Status            |
      | Satellite Launch Statistics   | Must be displayed |
      | Coverage Expansion Milestones | Must be displayed |
      | Performance Improvements      | Must be displayed |
