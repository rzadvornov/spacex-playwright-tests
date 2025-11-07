@API @SpaceX @Ships @Read
Feature: SpaceX Ships API
  As a user
  I want to retrieve SpaceX ship and recovery vessel information
  So that I can track their operational status, locations, and mission deployments.

  Background:
    Given the SpaceX "Ships" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Ships
    When I make a GET request to "/ships"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, type, active, home_port"

  @Smoke @GET @ID
  Scenario: Retrieve a single Ship by a valid ID
    Given a valid ship ID "5ea6ed2e080df4000697c908" is available
    When I make a GET request to "/ships/5ea6ed2e080df4000697c908"
    Then the response status code should be 200
    And the response ID should match the requested ID

  @Regression @POST @Query @Filtering
  Scenario Outline: Filter Ships by key attribute: name, type, or active status
    When I query the Ships API using POST with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain ships matching "<Field>" equals <Value>

    Examples:
      | Field  | Value    | Description             |
      | name   | "OCISLY" | by specific name        |
      | type   | "ASDS"   | by Autonomous Spaceport |
      | active | true     | by active status        |
      | active | false    | by inactive status      |

  @Regression @GET @Validation @Numeric
  Scenario: Ship specifications (mass, year built) are valid
    Given a valid ship ID "5ea6ed2e080df4000697c908" is available
    When I make a GET request to "/ships/5ea6ed2e080df4000697c908"
    Then the mass_kg field should be a non-negative number or null
    And the year_built field should be a four-digit year or null
    And the home_port should be a non-empty string

  @Regression @Integration @Launches
  Scenario: Ship correctly links to associated Launches
    Given a valid ship ID "5ea6ed2e080df4000697c908" is available
    When I make a GET request to "/ships/5ea6ed2e080df4000697c908"
    Then the response status code should be 200
    And the response should contain a launches array
    And all launch IDs in the array should be valid and linkable
