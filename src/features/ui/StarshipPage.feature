@starship @core-info @high-priority
Feature: Learn About the Starship Transportation System's Capabilities
  As a potential customer, partner, or space enthusiast
  I want to learn about the SpaceX Starship system
  So that I can understand its specifications, mission capabilities, and how it could serve my needs.

  Background:
    Given I am on the Starship vehicle information page

  @starship @overview @value-prop
  Scenario: Understand the core value proposition of Starship
    When I view the primary overview section
    Then the displayed headline should be "Service to Earth Orbit, Moon, Mars and Beyond"
    And the description should position Starship and Super Heavy as the world's most powerful, fully reusable transportation system
    And the page should match the snapshot "starship_initial_load"

  @starship @capabilities @specifications
  Scenario: Review high-level system capabilities
    When I review the system capabilities summary
    Then I should see the following key performance details:
      | Capability Type      | Detail                              |
      | Payload (Reusable)   | 100-150 metric tonnes               |
      | Payload (Expendable) | 250 metric tonnes                   |
      | Destinations         | Earth orbit, Moon, Mars, and beyond |
      | Crew Capacity        | Up to 100 people                    |

  @starship @specifications @starship-vehicle
  Scenario: Review Starship vehicle specifications
    When I view the Starship vehicle specifications
    Then I should see the following technical details are accurately displayed:
      | Attribute           | Metric Value | Imperial Value |
      | Height              | 52 m         | 171 ft         |
      | Diameter            | 9 m          | 29.5 ft        |
      | Propellant Capacity | 1,500 t      | 3.3 Mlb        |
      | Thrust              | 1,500 tf     | 3.3 Mlbf       |
      | Payload Capacity    | 100-150 t    |                |

  @starship @specifications @super-heavy
  Scenario: Review Super Heavy Booster specifications
    When I view the Super Heavy Booster specifications
    Then I should see the following technical details are accurately displayed:
      | Attribute           | Metric Value | Imperial Value | Other Details     |
      | Height              | 71 m         | 232 ft         |                   |
      | Diameter            | 9 m          | 29.5 ft        |                   |
      | Propellant Capacity | 3,400 t      | 7.5 Mlb        |                   |
      | Total Thrust        | 7,590 tf     | 16.7 Mlbf      | 33 Raptor engines |

  @starship @propulsion @raptor-engine
  Scenario: Compare Raptor engine configurations
    When I view the propulsion system details
    Then I should see the complete specifications for the Raptor sea-level engine:
      | Attribute | Metric Value | Imperial Value | Design Note                          |
      | Diameter  | 1.3 m        | 4.2 ft         | Methane-oxygen staged-combustion     |
      | Height    | 3.1 m        | 10.2 ft        | Twice as powerful as Falcon 9 Merlin |
      | Thrust    | 230 tf       | 507 klbf       | Reusable                             |
    And I should see the complete specifications for the Raptor Vacuum (RVac) engine:
      | Attribute | Metric Value | Imperial Value | Design Note                        |
      | Diameter  | 2.3 m        | 7.5 ft         | Larger expansion nozzle for vacuum |
      | Height    | 4.6 m        | 15.1 ft        |                                    |
      | Thrust    | 258 tf       | 568 klbf       |                                    |
    And the page should clearly note that Starship uses "3 Raptors and 3 RVacs"

  @starship @missions @mars @interplanetary
  Scenario: Understand capabilities for Mars colonization
    When I read about interplanetary mission capabilities
    Then I should learn that Starship is specifically designed for:
      | Fully reusable Mars transportation            |
      | On-orbit propellant transfer                  |
      | Carrying up to 100 people per flight          |
      | Drastically reducing cost through reusability |

  @starship @missions @lunar @artemis
  Scenario: Understand capabilities for Lunar missions
    When I read about lunar mission capabilities
    Then I should learn that Starship serves as a lunar lander for key missions:
      | NASA's Artemis program                                    |
      | Delivering cargo for moon base construction               |
      | Executing the first crewed lunar landing in over 50 years |

  @starship @missions @earth-p2p @future-application
  Scenario: Evaluate Point-to-Point Earth travel
    When I read about Earth transportation applications
    Then I should learn that Starship enables the following point-to-point capabilities:
      | Travel to anywhere on Earth in one hour or less          |
      | Most international travel in under 30 minutes            |
      | A smooth flight experience without turbulence or weather |

  @starship @payload @commercial
  Scenario: Assess payload deployment advantages
    When I review the payload section
    Then I should see the following advantages highlighted:
      | The largest payload compartment of any current or in-development fairing |
      | The ability to deploy multiple satellites on a single mission            |
      | The capability to carry large space telescopes                           |
      | Significant cargo delivery to the Moon and Mars                          |

  @starship @development @status
  Scenario: Learn about the vehicle's development status
    When I view the development and manufacturing information
    Then I should see that Starship is being developed and manufactured at "Starbase" in Texas
    And I should see updates on its testing progress and commercial spaceport status

  @starship @booking @sales
  Scenario: Inquire about booking a mission
    When I look for contact information regarding missions
    Then I should find the email address "sales@spacex.com" for inquiries regarding Starship missions and the human spaceflight program.