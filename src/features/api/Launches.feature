@API @SpaceX @Launches
Feature: Launch Retrieval and Querying
  As a user who tracks SpaceX missions
  I want to retrieve detailed launch information, filter, and sort the results
  So that I can find historical and upcoming mission data efficiently.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"
    And a POST request to "/launches/query" is prepared

  @Smoke @Read @ID
  Scenario: Retrieve a single Launch by a valid ID
    Given a valid launch ID "5eb87cd9ffd86e000604b32a" is available
    When I make a GET request to "/launches/5eb87cd9ffd86e000604b32a"
    Then the response status code should be 200
    And the launch ID should match the requested ID

  @Smoke @POST @Query @Filtering
  Scenario Outline: Filter Launches by key boolean and reference fields
    When I make a POST request to the query endpoint with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And all results should satisfy the filter condition "<Field>" equals <Value>

    Examples:
      | Field     | Value                      |
      | upcoming  | true                       |
      | success   | false                      |
      | launchpad | "5e9e4502f509094188566f88" |
      | rocket    | "5e9d0d95eda69973a87813a4" |

  @Regression @POST @Query @Sorting
  Scenario Outline: Sort Launches by date in ascending and descending order
    When I make a POST request to the query endpoint with options:
      """
      {
        "options": {
          "sort": {
            "date_utc": "<Order>"
          },
          "limit": 10
        }
      }
      """
    Then the response status code should be 200
    And launches should be sorted by "date_utc" in "<Order>" order

    Examples:
      | Order |
      | asc   |
      | desc  |
