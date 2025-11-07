@API @SpaceX @Crew @Read @Query
Feature: SpaceX Crew API
  As a user tracking manned missions
  I want to retrieve SpaceX crew member information
  So that I can access astronaut and mission specialist data efficiently.

  Background:
    Given the SpaceX "Crew" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Crew members
    When I make a GET request to "/crew"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, agency, status"

  @Smoke @GET @ID
  Scenario: Retrieve a single Crew member by a valid ID
    Given a valid crew ID "5ebf1b7323a9a60006e03a7b" is available
    When I make a GET request to "/crew/5ebf1b7323a9a60006e03a7b"
    Then the response status code should be 200
    And the response ID should match the requested ID
    And the response should contain a Wikipedia link

  @Regression @POST @Query
  Scenario Outline: Filter Crew by agency or status
    When I query the Crew API using POST with filter:
      """
      {
        "query": {
          "<Field>": "<Value>"
        }
      }
      """
    Then the response status code should be 200
    And all crew results should have "<Field>" equal to "<Value>"

    Examples:
      | Field  | Value   |
      | agency | NASA    |
      | agency | ESA     |
      | status | active  |
      | status | retired |

  @Regression @Integration
  Scenario: Crew member correctly links to associated Launches
    Given a valid crew ID "5ebf1b7323a9a60006e03a7b" is available
    When I make a GET request to "/crew/5ebf1b7323a9a60006e03a7b"
    Then the field "launches" should be a non-empty array
    And each item in "launches" should be a valid MongoDB ID
