@dragon @core-info @high-priority
Feature: Explore Dragon Spacecraft Capabilities
  As a potential customer, partner, or space enthusiast
  I want to learn about the SpaceX Dragon spacecraft
  So that I can understand its specifications, crew transport role, and commercial applications.

  Background:
    Given a user navigates to the Dragon page

  @dragon @overview @value-prop
  Scenario: View Dragon Overview and Core Value
    When the Dragon page successfully loads
    Then the user should see the Dragon page headline "Sending Humans and Cargo Into Space"
    And a description of Dragon's full capabilities should be displayed
    And the text should confirm Dragon can carry up to 7 passengers
    And Dragon's unique capability for **cargo return** should be highlighted
    And the page should match the snapshot "dragon_initial_load"


  @dragon @specifications @technical
  Scenario: Review Key Dragon Technical Specifications
    When the user scrolls to the specifications section of the Dragon page
    Then the page should display key technical specifications, including:
      | Specification Field          | Detail         |
      | Passenger capacity           | up to 7        |
      | Cargo return capability      | Available      |
      | Operational altitudes        | LEO and beyond |
      | Launch vehicle compatibility | Falcon 9       |
    And the page should display clear **metric and imperial** measurements

  @dragon @nasa @commercial-crew
  Scenario: Understand Dragon's Role in NASA's Commercial Crew Program
    When the user reviews the capabilities section
    Then the page should explain that Dragon restored the American ability to launch astronauts from US soil
    And it should mention that this capability was absent between 2011 and 2020
    And the page should highlight Dragon's role in the **first private spaceflight** (Inspiration4 or equivalent)

  @dragon @propulsion @draco
  Scenario: View Draco Thruster Engine Details for On-Orbit Operations
    When the user scrolls to the propulsion systems section
    Then the page should display Draco thruster specifications
    And the information should accurately list:
      | Attribute           | Value                               |
      | Number of thrusters | 16                                  |
      | Thrust per engine   | 90 pounds of force / 400 N          |
      | Primary functions   | Attitude control, orbit adjustments |

  @dragon @propulsion @safety @super-draco
  Scenario: View SuperDraco Launch Escape System Details
    When the user reviews the SuperDraco section
    Then the page should display details on the launch escape system:
      | Attribute              | Value                          |
      | Number of engines      | 8                              |
      | Escape thrust capacity | 73 kN / 16,400 lbf             |
      | Design Note            | Fault-tolerant engine grouping |
    And the text should specify the escape performance is approximately **half a mile in less than 8 seconds**

  @dragon @landing @recovery
  Scenario: Understand Parachute Landing System and Recovery
    When the user reads about landing systems
    Then the page should clearly explain Dragon's multi-stage parachute landing mechanism
    And the information should confirm the use of:
      | Parachute Type    | Quantity | Purpose                     |
      | Drogue parachutes | Two      | Stabilization               |
      | Main parachutes   | Four     | Deceleration for splashdown |
    And the page should specify the vehicle is designed for **water landing** recovery

  @dragon @media @video
  Scenario: Watch Dragon Spacecraft Operations Video
    When the user clicks on the featured video section of the Dragon page
    Then an embedded video player should successfully load and display the content
    And the video should visually showcase Dragon's **launch, docking, and ocean landing operations**
    And the video should highlight **crew operations** inside the capsule

  @dragon @commercial @missions
  Scenario: Learn About Dragon's Commercial Applications Beyond NASA
    When the user reviews the full mission description
    Then the page should explain that Dragon is available to serve **commercial astronauts and private customers**
    And the capability for Earth orbit missions, including the ISS, should be mentioned
    And the option for specialized **missions beyond Low Earth Orbit (LEO)** should be described
