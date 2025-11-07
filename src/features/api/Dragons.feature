@API @SpaceX @Dragons @Read @Specs
Feature: SpaceX Dragon Spacecraft API
  As a user
  I want to retrieve SpaceX Dragon spacecraft specifications
  So that I can access details about design, mass, and capability.

  Background:
    Given the SpaceX "Dragons" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Dragon types
    When I make a GET request to "/dragons"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, type, active, first_flight"

  @Regression @POST @Query @Filtering
  Scenario Outline: Filter Dragon spacecraft by active status
    When I query the Dragons API using POST with filter:
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
    Then the nested field "cubic_meters" in "pressurized_volume" should be a non-negative number
    And the nested field "cubic_meters" in "trunk_volume" should be a non-negative number
