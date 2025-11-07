@API @SpaceX @Launches @Read @Query
Feature: Launch Retrieval and Querying
  As a user who tracks SpaceX missions
  I want to retrieve detailed launch information, filter, and sort the results
  So that I can find historical and upcoming mission data efficiently.

  Background:
    Given the SpaceX "Launches" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Launches
    When I make a GET request to "/launches"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, date_utc, success, upcoming, rocket, launchpad"

  @Smoke @GET @ID
  Scenario: Retrieve a single Launch by a valid ID
    Given a valid launch ID "5eb87cd9ffd86e000604b32a" is available
    When I make a GET request to "/launches/5eb87cd9ffd86e000604b32a"
    Then the response status code should be 200
    And the response ID should match the requested ID
    And the response should be a valid JSON object
    And the field "date_utc" should be a valid ISO 8601 timestamp

  @Smoke @POST @Query @Filtering
  Scenario Outline: Filter Launches by key boolean and reference fields
    When I query the Launches API using POST with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain launches matching "<Field>" equals <Value>

    Examples:
      | Field     | Value                      |
      | upcoming  | true                       |
      | success   | false                      |
      | launchpad | "5e9e4502f509094188566f88" |
      | rocket    | "5e9d0d95eda69973a87813a4" |

  @Regression @POST @Query @Sorting
  Scenario Outline: Sort Launches by date in ascending and descending order
    When I query the Launches API using POST with options:
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
    And the results should be sorted by "date_utc" in "<Order>" order

    Examples:
      | Order |
      | asc   |
      | desc  |
