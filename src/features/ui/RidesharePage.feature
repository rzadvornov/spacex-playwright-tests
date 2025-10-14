@rideshare @core-info @high-priority
Feature: Utilize SpaceX Rideshare Payload Service
  As a satellite operator or small satellite developer
  I want to easily understand the pricing, specifications, and process of the Rideshare program
  So that I can book cost-effective and timely launch capacity.

  Background:
    Given a user navigates to the Rideshare program page

  @rideshare @overview @pricing
  Scenario: View Rideshare Program Overview and Anchor Pricing
    When the page loads initially
    Then the user should see a headline referencing **dedicated Rideshare Missions**
    And the anchor price should be highlighted as "as Low as $325k"
    And a brief overview of the high-level program value should be displayed
    And a visible call-to-action to "Search available flights" should be present
    And the page should match the snapshot "rideshare_initial_load"

  @rideshare @plates @specifications
  Scenario: View Available Rideshare Plate Options and Capacity
    When the user scrolls to the plate configuration section
    Then the page should accurately display all standard plate options:
      | Plate Configuration  | Bolt Pattern | Included Mass |
      | 1/4 Plate            | 8"           | 50kg          |
      | 1/2 Plate            | 8" or 15"    | 100kg         |
      | Full Plate           | 15" or 24"   | 200kg         |
      | Full Plate XL Volume | 24"          | 300kg         |

  @rideshare @technical @documentation
  Scenario: Access Essential Rideshare Documentation Links
    When the user reviews the program information section
    Then the page should provide direct links to essential documentation, including:
      | Document Name               | Availability   |
      | Plate Configuration Details | Must be linked |
      | Technical Specifications    | Must be linked |
      | Licensing Information       | Must be linked |
      | Rideshare User's Guide      | Must be linked |

  @rideshare @vehicle @falcon9
  Scenario: View Falcon 9 Vehicle Specifications for Context
    When the user reviews the launch vehicle section
    Then the page should display the following Falcon 9 specifications:
      | Attribute        | Metric Value | Imperial Value |
      | Vehicle Height   | 70m          | 229.6ft        |
      | Vehicle Diameter | 3.7m         | 12ft           |
      | Fairing Height   | 13.1m        | 43ft           |
      | Fairing Diameter | 5.2m         | 17.1ft         |
    And a brief description of Falcon 9 as a reusable orbital class rocket should be visible

  @rideshare @booking @flights
  Scenario: Search Available Flights and View Pricing
    When the user clicks the "Search Flights" feature
    Then an interactive search interface should display available rideshare missions
    And upcoming launch dates should be clearly listed for each mission
    And the corresponding **pricing and available mass capacity** information should be shown

  @rideshare @booking @reservation
  Scenario: Initiate Online Reservation for a Rideshare Plate
    Given the user has viewed the available flights
    When the user clicks to select and book a plate configuration
    Then an online reservation system or form should become accessible
    And the user should be prompted to specify their **payload mass and mission requirements**

  @rideshare @custom @contact
  Scenario: Understand Options for Custom and Non-Standard Configurations
    When the user reviews custom configuration options
    Then the page should mention that custom interfaces and larger spacecraft options are available upon request
    And the availability of **"cake topper" slots** for specific orbital applications should be noted
    And clear contact information for discussing custom interfaces should be provided

  @rideshare @processing @logistics
  Scenario: Understand Payload Processing and Logistics
    When the user reviews payload processing information
    Then the page should clearly explain the payload processing timeline
    And the typical processing location (SpaceX facility) should be specified
    And a summary of necessary **payload documentation requirements** should be listed

  @rideshare @booking @process-approval
  Scenario: View Reservation and Approval Process Steps
    When the user reviews the post-reservation steps
    Then the page should clearly outline the reservation approval process
    And it should explain the issuance of a **welcome package** upon approval
    And the next contact and technical documentation exchange protocols should be detailed
