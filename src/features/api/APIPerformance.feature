@API @SpaceX @Performance
Feature: API Performance
  As a user
  I want the API to respond quickly
  So that my applications remain responsive and provide a good user experience

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @Launches @List
  Scenario: Fetching all launches responds quickly
    When I make a GET request to "/launches"
    Then the response status code should be 200
    And the response time should be less than 5 seconds

  @Smoke @GET @Launches @ID
  Scenario: Single resource retrieval is fast
    Given a valid launch ID "5eb87cd9ffd86e000604b32a" is available
    When I make a GET request to "/launches/5eb87cd9ffd86e000604b32a"
    Then the response status code should be 200
    And the response time should be less than 2 seconds

  @Regression @POST @Query @Pagination
  Scenario: Paginated query with options performs efficiently
    When I make a POST request to "/launches/query" with options:
      """
      {
        "limit": 100,
        "page": 1
      }
      """
    Then the response status code should be 200
    And the response time should be less than 5 seconds

  @Regression @POST @Query @Complex
  Scenario: Complex query with multiple filters and sort performs efficiently
    When I make a POST request to "/launches/query" with a complex query body
    Then the response status code should be 200
    And the response time should be less than 5 seconds
