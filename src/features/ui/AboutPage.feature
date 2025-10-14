@about @company @high-priority
Feature: Learn About SpaceX Company
  As a potential employee, investor, or interested stakeholder
  I want to learn about SpaceX's history, mission, leadership, and operations
  So that I can understand the company's background and trajectory.

  Background:
    Given a user navigates to the About page

  @about @overview @mission
  Scenario: View Company Mission and Core Vision
    When the page loads successfully
    Then the user should see SpaceX's **mission statement** and core vision
    And the mission to make **humanity multiplanetary** should be prominently featured
    And the page should highlight the company's core values and long-term objectives
    And the page should match the snapshot "about_initial_load"

  @about @history @milestones
  Scenario: View Key Company History and Milestones
    When the user reviews the company history section
    Then the following key milestones should be displayed chronologically:
      | Milestone Category         | Detail                  |
      | Founding Information       | Date and Founder's name |
      | First Orbital Launch       | Must be listed          |
      | First Satellite Deployment | Must be listed          |
      | First Crew Mission         | Must be listed          |
      | Significant Partnerships   | Must be listed          |
    And the company's **approach to reusability** should be emphasized throughout the history.

  @about @leadership @governance
  Scenario: View Leadership Team and Executive Information
    When the user scrolls to the leadership section
    Then the following key executive roles should be listed with associated names:
      | Role                | Detail         |
      | Founder and CEO     | Must be listed |
      | Chief Engineer      | Must be listed |
      | President and COO   | Must be listed |
      | Other C-level roles | Must be listed |
    And **photos and brief biographies** should be provided for the primary leaders.

  @about @achievements @statistics
  Scenario: View Major Company Achievements and Statistics
    When the user reviews the company accomplishments summary
    Then the page should display verifiable, major achievements:
      | Achievement Metric             | Value Format   |
      | Number of successful launches  | Integer        |
      | Booster reuse statistics       | Integer        |
      | First private crew missions    | Must be listed |
      | Key NASA certifications/awards | Must be listed |
      | Starlink constellation size    | Integer        |

  @about @facilities @operations
  Scenario: Understand Company Facilities and Operational Locations
    When the user reads about operations and facilities
    Then information about key SpaceX locations should be clearly displayed:
      | Facility Name          | Location/Purpose  |
      | Starbase               | Boca Chica, Texas |
      | Hawthorne Headquarters | California        |
      | McGregor Test Facility | Texas             |
      | Launch Complexes       | KSC, Vandenberg   |

  @about @sustainability @ethics
  Scenario: View Sustainability and Environmental Initiatives
    When the user looks for environmental information
    Then the page should describe SpaceX's commitment to sustainability, including:
      | Initiative Focus                | Detail                                |
      | Space Debris Reduction          | Reusability and controlled deorbiting |
      | Starlink Deorbiting Mechanism   | Low-altitude for rapid decay          |
      | Environmental Responsibility    | Must be described                     |
      | Satellite Brightness Mitigation | Must be described                     |

  @about @partnerships @contracts
  Scenario: View Corporate and Government Partnerships
    When the user reviews the partnerships section
    Then major long-standing partnerships should be listed, including:
      | Partner Type            | Example Detail       |
      | NASA Collaborations     | Commercial Crew, HLS |
      | International Agencies  | Must be listed       |
      | US Government Contracts | NSSL, USSF           |
      | Key Commercial Clients  | Must be listed       |

  @about @structure @divisions
  Scenario: Understand Company Organizational Structure
    When the user looks for organizational information
    Then the page should clearly describe the major product and development divisions:
      | Division Name     | Primary Focus            |
      | Falcon Program    | Launch Vehicles          |
      | Dragon Program    | Crew/Cargo Capsules      |
      | Starship Program  | Interplanetary Transport |
      | Starlink Division | Satellite Internet       |

  @about @resources @contact
  Scenario: Access Key Company Resources and Contact Information
    When the user looks for additional information
    Then clearly labeled links should be available to the following external resources:
      | Resource Name          | Availability   |
      | Press Center/Media Kit | Must be linked |
      | Career Opportunities   | Must be linked |
      | Supplier Information   | Must be linked |
      | Social Media Profiles  | Must be linked |
      | General Contact Info   | Must be linked |
