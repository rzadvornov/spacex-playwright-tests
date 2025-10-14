@falcon-heavy @core-info @high-priority
Feature: Learn About Falcon Heavy Super Heavy-Lift Launch Vehicle
  As a potential customer, partner, or space enthusiast
  I want to learn about the Falcon Heavy launch vehicle
  So that I can understand its power, specifications, and heavy-lift capabilities.

  Background:
    Given a user navigates to the Falcon Heavy page

  @falcon-heavy @overview @value-prop
  Scenario: View Falcon Heavy Overview and Core Value
    When the Falcon Heavy page successfully loads
    Then the user should see the headline "Over 5 Million Lbs of Thrust"
    And a description explaining that Falcon Heavy is composed of three Falcon 9 cores
    And the total thrust at liftoff should be highlighted as **5 million pounds** (or its metric equivalent)
    And the page should match the snapshot "falcon_heavy_initial_load"

  @falcon-heavy @comparison @payload
  Scenario: Understand Falcon Heavy Thrust and Payload Capacity Comparison
    When the user reviews the overview section
    Then the page should compare Falcon Heavy thrust to familiar references
    And a comparison stating its thrust equals approximately **eighteen 747 aircraft** at full power should be displayed
    And the maximum payload capacity should be mentioned as **64 metric tons / 141,000 lbs** to orbit

  @falcon-heavy @specifications @technical
  Scenario: Review Falcon Heavy Key Technical Specifications
    When the user scrolls to the specifications section
    Then the page should display the following key technical details:
      | Specification Attribute | Detail              |
      | Height                  | Must be displayed   |
      | Diameter                | Must be displayed   |
      | Thrust capacity         | Must be displayed   |
      | Payload capacity        | Must be displayed   |
      | Stage configuration     | Two stages to orbit |

  @falcon-heavy @composition @design
  Scenario: Understand Falcon Heavy Composition and Reusability
    When the user reviews the vehicle description
    Then the explanation should clarify that Falcon Heavy uses **three Falcon 9 first-stage cores**
    And the purpose of having **27 Merlin engines** (9 per core) should be explained
    And the page should highlight the **reusability benefits** for the three boosters

  @falcon-heavy @propulsion @merlin-engine
  Scenario: View Merlin Sea-Level Engine Information
    When the user scrolls to the engines section
    Then the page should display Merlin engine specifications:
      | Attribute       | Detail                          |
      | Engine Family   | Merlin                          |
      | Propellant Type | LOX / RP-1                      |
      | Thrust          | 845 kN / 190,000 lbf            |
      | Design Note     | Designed for recovery and reuse |

  @falcon-heavy @propulsion @merlin-vacuum
  Scenario: View Merlin Vacuum Engine Details
    When the user reads the Merlin Vacuum section
    Then the page should display the following details:
      | Attribute         | Detail                                     |
      | Design Features   | Larger exhaust section, expansion nozzle   |
      | Cooling           | Regeneratively and radiatively cooled      |
      | Thrust Output     | 981 kN / 220,500 lbf                       |
      | Efficiency Claims | High efficiency in space vacuum operations |

  @falcon-heavy @media @video
  Scenario: Watch Falcon Heavy Demonstration Video
    When the user clicks on the video section
    Then an embedded video player should successfully load and display
    And the video should showcase the **Falcon Heavy launch sequence**
    And the video should clearly demonstrate the **simultaneous booster landing sequences**

  @falcon-heavy @comparison @market
  Scenario: Compare Falcon Heavy to Other Vehicles and Market Position
    When the user seeks comparative information
    Then the page should describe Falcon Heavy as **one of the world's most capable operational rockets**
    And it should be positioned as the ideal choice for **heavy payloads** to various orbits
    And the text should highlight its suitability for launching large satellites or deep space missions
