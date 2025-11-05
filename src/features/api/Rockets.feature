@API @SpaceX @Rockets @Read @Specs
Feature: SpaceX Rockets API
  As a user
  I want to retrieve SpaceX rocket specifications
  So that I can learn about different rocket types, their dimensions, and capabilities.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Rockets
    When I make a GET request to "/rockets"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each rocket should contain: id, name, type, active, stages, boosters

  @Smoke @POST @Query @Filtering
  Scenario Outline: Filter Rockets by name or active status
    When I make a POST request to "/rockets/query" with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain rockets matching "<Field>" equals <Value>

    Examples:
      | Field  | Value      |
      | name   | "Falcon 9" |
      | name   | "Starship" |
      | active | true       |
      | active | false      |

  @Regression @GET @Validation @Numeric
  Scenario Outline: All key dimensions and costs are positive numbers
    Given a valid rocket ID "5e9d0d95eda69973a87813a4" (Falcon 9) is available
    When I make a GET request to "/rockets/5e9d0d95eda69973a87813a4"
    Then the field "<Field>" should be a positive number

    Examples:
      | Field            |
      | height.meters    |
      | diameter.meters  |
      | mass.kg          |
      | cost_per_launch  |
      | success_rate_pct |
