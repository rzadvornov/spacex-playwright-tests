@API @SpaceX @Validation @Schema
Feature: API Data Validation
  As a system integrator
  I want the API to return valid, consistent, and correctly typed data
  So that I can rely on the information for my business logic

  Background:
    Given the SpaceX "Launches" API is available

  @Critical @Schema @Launches
  Scenario: All launches have required, non-null fields
    When I make a GET request to "/launches"
    Then the response should be a valid JSON array
    And each launch should have a non-null id field
    And each launch should have a non-null name field
    And each launch should have a non-null date_utc field

  @Regression @Dates @Launches
  Scenario: Launch dates are valid ISO 8601 format
    When I make a GET request to "/launches"
    Then all "date_utc" fields should be valid ISO 8601 timestamps

  @Regression @Numeric @Schema
  Scenario Outline: Numeric fields are positive or non-negative
    When I make a GET request to "<Endpoint>"
    Then for each item, the field "<Field>" should be a "<Requirement>"

    Examples:
      | Endpoint  | Field       | Requirement          |
      | /rockets  | height_m    | positive number      |
      | /rockets  | diameter_m  | positive number      |
      | /rockets  | mass_kg     | positive number      |
      | /cores    | reuse_count | non-negative integer |
      | /capsules | reuse_count | non-negative integer |
      | /payloads | mass_kg     | non-negative or null |
      | /company  | employees   | positive integer     |
      | /company  | valuation   | positive number      |

  @Regression @Logic @Cores
  Scenario: Core landing attempts must equal or exceed successes
    When I make a GET request to "/cores"
    Then for each core:
    And rtls_attempts should be greater than or equal to rtls_landings
    And asds_attempts should be greater than or equal to asds_landings
