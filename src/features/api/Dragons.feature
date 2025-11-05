@API @SpaceX @Dragons @Read @Specs
Feature: SpaceX Dragon Spacecraft API
  As a user
  I want to retrieve SpaceX Dragon spacecraft specifications
  So that I can access details about design, mass, and capability.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Dragon types
    When I make a GET request to "/dragons"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each dragon should have: id, name, type, active, first_flight

  @Regression @POST @Query @Filtering
  Scenario Outline: Filter Dragon spacecraft by active status
    When I make a POST request to "/dragons/query" with filter:
      """
      {
        "query": {
          "active": <Status>
        }
      }
      """
    Then the response status code should be 200
    And all results should have active status as <Status>

    Examples:
      | Status |
      | true   |
      | false  |

  @Regression @GET @Validation @Numeric
  Scenario Outline: All key dimensions and masses are positive numbers
    Given a valid dragon ID "5e9d058759b1ff74a7ad5f8f" is available
    When I make a GET request to "/dragons/5e9d058759b1ff74a7ad5f8f"
    Then the nested field "<Field>" in "mass_payload" should be a positive number
    And the field "crew_capacity" should be a non-negative integer

    Examples:
      | Field |
      | kg    |
      | lb    |

  @Regression @GET @Validation @Volume
  Scenario: Dragon pressurized and trunk volumes are non-negative
    Given a valid dragon ID "5e9d058759b1ff74a7ad5f8f" is available
    When I make a GET request to "/dragons/5e9d058759b1ff74a7ad5f8f"
    Then the pressurized capsule volume should be a non-negative number
    And the trunk volume should be a non-negative number
