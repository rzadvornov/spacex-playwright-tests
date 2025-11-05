@API @SpaceX @Error @4xx
Feature: API Error Handling
  As a user interacting with the API
  I want the API to handle various errors gracefully
  So that I can understand what went wrong with my request and adjust accordingly

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @404 @Resource
  Scenario: Handle 404 for non-existent resource by valid endpoint
    When I make a GET request to "/launches/non-existent-id"
    Then the response status code should be 404

  @Smoke @GET @404 @Endpoint
  Scenario: Handle 404 for non-existent top-level endpoint
    When I make a GET request to "/nonexistent-endpoint"
    Then the response status code should be 404

  @Regression @POST @400 @Body
  Scenario: Handle malformed JSON in POST request body
    When I make a POST request to "/launches/query" with malformed JSON body
    Then the response status code should be 400

  @Regression @POST @400 @Body
  Scenario: Handle empty POST body in a query endpoint
    When I make a POST request to "/launches/query" with empty body
    Then the response status code should be 200 or 400

  @Regression @POST @400 @Query
  Scenario: Handle invalid query operator in POST body
    When I make a POST request to "/launches/query" with body:
      """
      {
        "query": {
          "date_utc": {
            "$invalidOperator": "2020-01-01"
          }
        }
      }
      """
    Then the response status code should be 200 or 400

  @Regression @POST @400 @Limit
  Scenario: Query with excessively large limit handles gracefully
    When I make a POST request to "/launches/query" with options:
      """
      {
        "limit": 999999
      }
      """
    Then the response status code should be 200 or 400

  @Regression @POST @405 @Method
  Scenario: Unsupported HTTP method returns 405 or 404
    When I make a DELETE request to "/launches"
    Then the response status code should be 405 or 404
