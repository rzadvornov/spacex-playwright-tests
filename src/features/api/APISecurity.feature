@API @SpaceX @Security
Feature: API Security
  As an application security engineer
  I want the API to be secure against common vulnerabilities
  So that data integrity is maintained and the service remains operational

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Critical @HTTPS @Transport
  Scenario: All API access must use HTTPS
    When I make a GET request to "https://api.spacexdata.com/v4/launches"
    Then the connection should use HTTPS
    And the certificate should be valid

  @Regression @Injection @SQL
  Scenario: API is resilient to SQL injection attempts
    When I make a POST request to "/launches/query" with a potential SQL injection payload:
      """
      {
        "query": {
          "name": "'; DROP TABLE launches; --"
        }
      }
      """
    Then the request should be handled safely by the API
    And no database operations should be executed outside the query scope

  @Regression @Validation @Input
  Scenario: API handles invalid input data types gracefully
    When I make a POST request to "/launches/query" with a type mismatch:
      """
      {
        "query": {
          "date_utc": 12345
        }
      }
      """
    Then the API should handle the type mismatch gracefully

  @Regression @Permissions @Access
  Scenario: Public endpoints are read-only (rejects POST/PUT/DELETE)
    When I make a POST request to create a new launch at "/launches"
    Then the request should be rejected with a 405 Method Not Allowed or 404 Not Found
