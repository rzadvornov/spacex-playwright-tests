@API @SpaceX @Company @Read
Feature: SpaceX Company API
  As a user
  I want to retrieve SpaceX company information
  So that I can access organizational and operational data

  Background:
    Given the SpaceX "Company" API is available

  @Smoke @GET @Info
  Scenario: Retrieve core company information fields
    When I make a GET request to "/company"
    Then the response status code should be 200
    And the response should be a valid JSON object
    And the response should contain core fields: "name, founder, founded, employees, vehicles, launch_sites, test_sites, valuation"

  @Regression @GET @Validation @Schema
  Scenario: All core company details are present and accurate
    When I make a GET request to "/company"
    Then the response should have "name" field containing "SpaceX"
    And the "founder" field should be "Elon Musk"
    And the "founded" field should be 2002
    And the headquarters "city" should be "Hawthorne"
    And the headquarters "state" should be "California"
    And the response should contain links to "website, flickr, twitter"
    And the response should have a valid URL in the "website" field

  @Regression @GET @Validation @Numeric
  Scenario Outline: All key numeric fields for Company are present and positive
    When I make a GET request to "/company"
    Then the response should contain field "<Field>"
    And the "<Field>" value should be a positive integer

    Examples:
      | Field        |
      | employees    |
      | vehicles     |
      | launch_sites |
      | test_sites   |
      | valuation    |
