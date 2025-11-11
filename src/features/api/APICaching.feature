@API @SpaceX @Headers @Caching
Feature: API Caching and Headers
  As a client application developer
  I want the API to support proper HTTP headers and caching mechanisms
  So that my applications can be efficient, secure, and compliant

  Background:
    Given the SpaceX "Launches" API is available

  @Smoke @GET @Header @Launches
  Scenario: Verify Content-Type header is JSON
    When I make a GET request to "/launches"
    Then the response header should contain "Content-Type"
    And the "Content-Type" header value should be "application/json"

  @Regression @GET @Header @CORS
  Scenario: Verify necessary CORS headers are present
    When I make a GET request to "/launches"
    Then the response should include CORS headers
    And the "Access-Control-Allow-Origin" header should be present

  @Regression @OPTIONS @CORS @Header
  Scenario: Verify API supports OPTIONS preflight request
    When I make an OPTIONS request to "/launches"
    Then the response status code should be 200
    And the response should include CORS headers
    And the "Access-Control-Allow-Methods" header should include GET and POST

  @Regression @GET @Header @Caching @Company
  Scenario: Verify Cache-Control header for static resource
    When I make a GET request to "/company"
    Then the response may include "Cache-Control" header

  @Regression @GET @Caching @Repeatability
  Scenario: Repeated requests for static list return identical data
    When I make a GET request to "/rockets"
    And I make the same GET request to "/rockets" again
    Then both responses should have status code 200
    And responses should have identical data
