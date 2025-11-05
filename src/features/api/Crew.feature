@API @SpaceX @Crew @Read @Query
Feature: SpaceX Crew API
  As a user tracking manned missions
  I want to retrieve SpaceX crew member information
  So that I can access astronaut and mission specialist data efficiently.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Crew members
    When I make a GET request to "/crew"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each crew member should have: id, name, agency, status

  @Smoke @GET @ID
  Scenario: Retrieve a single Crew member by a valid ID
    Given a valid crew ID "5ebf1b7323a9a60006e03a7b" is available
    When I make a GET request to "/crew/5ebf1b7323a9a60006e03a7b"
    Then the response status code should be 200
    And the crew member ID should match the requested ID
    And the response should contain a Wikipedia link

  @Regression @POST @Query
  Scenario Outline: Filter Crew by agency or status
    When I make a POST request to "/crew/query" with filter:
      """
      {
        "query": {
          "<Field>": "<Value>"
        }
      }
      """
    Then the response status code should be 200
    And all results should have "<Field>" equal to "<Value>"

    Examples:
      | Field  | Value   |
      | agency | NASA    |
      | agency | ESA     |
      | status | active  |
      | status | retired |

  @Regression @Integration
  Scenario: Crew member correctly links to associated Launches
    Given a valid crew ID "5ebf1b7323a9a60006e03a7b" is available
    When I retrieve the crew data
    Then the response should contain a non-empty launches array
    And all launch IDs in the array should be valid and linkable
