@falcon9 @core-info @high-priority
Feature: View and Learn About Falcon 9 Rocket
  As a potential customer or researcher
  I want to understand the design and capabilities of the Falcon 9 launch vehicle
  So that I can appreciate its role as a reliable, reusable workhorse.

  Background:
    Given a user navigates to the Falcon 9 vehicle information page

  @falcon9 @overview @reusability
  Scenario: View Falcon 9 Overview and Core Value Proposition
    When the Falcon 9 page loads successfully
    Then the user should see the Falcon 9 page headline "First Orbital Class Rocket Capable of Reflight"
    And a brief description explaining that Falcon 9 is a **fully reusable** two-stage rocket
    And the cost and reliability benefits of reusability should be prominently highlighted
    And the page should match the snapshot "falcon9_initial_load"

  @falcon9 @specifications @technical
  Scenario: Review Key Vehicle Specifications
    When the user scrolls to the specifications section of the Falcon 9 page
    Then the page should display the following key technical specifications in a structured format:
      | Attribute         | Metric Value        | Imperial Value                  |
      | Height            | Must be displayed   | Must be displayed               |
      | Diameter          | Must be displayed   | Must be displayed               |
      | Payload capacity  | Must be displayed   | Must be displayed               |
      | Launch capability | Two stages to orbit | Single-mission reuse capability |

  @falcon9 @propulsion @merlin-engine
  Scenario: View Merlin Sea-Level Engine Details
    When the user reviews the engines section
    Then the page should display information about the Merlin engine family
    And the specifications for the main engines should include:
      | Attribute       | Detail                          |
      | Propellant Type | LOX / RP-1                      |
      | Thrust Output   | 845 kN / 190,000 lbf            |
      | Design Note     | Designed for recovery and reuse |

  @falcon9 @propulsion @merlin-vacuum
  Scenario: View Merlin Vacuum Engine Specifications
    When the user reviews the Merlin Vacuum section details
    Then the page should accurately display the specialized vacuum engine specifications:
      | Design Feature             | Description             |
      | Exhaust Section            | Larger expansion nozzle |
      | Combustion Chamber Cooling | Regeneratively cooled   |
      | Expansion Nozzle Cooling   | Radiatively cooled      |
      | Thrust Output              | 981 kN / 220,500 lbf    |

  @falcon9 @media @video
  Scenario: Watch Falcon 9 Launch and Landing Video
    When the user clicks on the featured video section of the Falcon 9 page
    Then an embedded video player should successfully appear
    And the video should visually demonstrate the Falcon 9 launch and successful **first-stage recovery**
    And the video player should include accessible sound controls

  @falcon9 @comparison @cost
  Scenario: Understand Comparative Advantage and Cost Benefits
    When the user reviews the vehicle's market positioning
    Then the page should provide context about Falcon 9's **reusability advantage over expendable rockets**
    And the cost-effectiveness of using a reusable vehicle should be clearly mentioned

  @falcon9 @documentation @research
  Scenario: Access Technical Documentation for Researchers
    When the user looks for detailed technical specifications
    Then a clearly labeled link to downloadable **technical documentation (e.g., PDF)** should be available
    And the link should point to a document that includes detailed performance metrics and schematics

  @falcon9 @history @statistics
  Scenario: View Launch History and Reuse Statistics
    When the user scrolls down the page
    Then a dedicated section or link summarizing Falcon 9's launch history should be displayed
    And key statistics like total successful missions and **booster reuse count** should be highlighted
