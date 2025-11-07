@API @SpaceX @Rockets @Read @Specs
Feature: SpaceX Rockets API
  As a user
  I want to retrieve SpaceX rocket specifications
  So that I can learn about different rocket types, their dimensions, and capabilities.

  Background:
    Given the SpaceX "Rockets" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Rockets
    When I make a GET request to "/rockets"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, type, active, stages, boosters"

  @Smoke @POST @Query @Filtering @String
  Scenario Outline: Filter Rockets by name or type (String matching)
    When I query the Rockets API using POST with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain rockets matching "<Field>" equals "<Value>"

    Examples:
      | Field | Value    |
      | name  | Falcon 9 |
      | name  | Starship |
      | type  | heavy    |

  @Smoke @POST @Query @Filtering @Boolean
  Scenario Outline: Filter Rockets by active status (Boolean matching)
    When I query the Rockets API using POST with filter:
      """
      {
        "query": {
          "active": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain rockets matching "active" equals <Value>

    Examples:
      | Value |
      | true  |
      | false |

  @Regression @GET @Validation @Numeric
  Scenario Outline: All key dimensions and costs are positive numbers
    Given a valid rocket ID "5e9d0d95eda69973a87813a4" is available
    When I make a GET request to "/rockets/5e9d0d95eda69973a87813a4"
    Then the response status code should be 200
    And the field "<Field>" should be a positive number

    Examples:
      | Field            |
      | height.meters    |
      | diameter.meters  |
      | mass.kg          |
      | cost_per_launch  |
      | success_rate_pct |
