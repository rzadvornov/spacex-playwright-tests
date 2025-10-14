@careers @recruitment @high-priority
Feature: Explore Career Opportunities at SpaceX
  As a potential candidate or job seeker
  I want to easily find information about company culture, open jobs, and the application process
  So that I can determine if SpaceX is the right employer for me and apply effectively.

  Background:
    Given a user navigates to the Careers page

  @careers @overview @mission
  Scenario: View Careers Overview and Mission Alignment
    When the page loads initially
    Then the user should see the headline mentioning **"world-class talent" and "challenging projects"**
    And a description of SpaceX's mission and culture should be displayed
    And the content should emphasize **direct contribution to making humanity multiplanetary**
    And the page should match the snapshot "careers_initial_load"

  @careers @culture @values
  Scenario: Understand SpaceX Core Culture and Values
    When the user reviews the company culture section
    Then the page should highlight core values and expected mindsets:
      | Core Value                         | Status              |
      | Hard work and innovative solutions | Must be highlighted |
      | Merit-based hiring and culture     | Must be highlighted |
      | Continuous improvement mindset     | Must be highlighted |
      | Innovation and risk-taking         | Must be highlighted |

  @careers @benefits @compensation
  Scenario: View Comprehensive Employee Benefits Package
    When the user reviews the detailed benefits section
    Then comprehensive benefits information should include:
      | Benefit Category         | Status                  |
      | Competitive Salaries     | Must be mentioned       |
      | Health Insurance         | Medical, Dental, Vision |
      | Retirement Plans         | 401k matching details   |
      | Stock/Equity Packages    | Must be mentioned       |
      | Paid Time Off (PTO)      | Must be mentioned       |
      | Professional Development | Must be mentioned       |
    And an **Equal Opportunity Employment statement** should be prominently displayed.

  @careers @search @listings
  Scenario: Search and Filter Jobs by Criteria
    When the user enters search criteria (e.g., "Engineer", "Hawthorne")
    Then matching job openings should be displayed
    And search results should show **position title, department, and location**
    And the application option should be immediately available for each listing

  @careers @filter @categories
  Scenario: Filter Job Listings by Department and Type
    When the user selects a department filter "Manufacturing" and a type filter "Internship"
    Then the job listings should filter to show only matching positions
    And the available primary job categories should include:
      | Job Category            | Status            |
      | Engineering Roles       | Must be available |
      | Manufacturing Positions | Must be available |
      | Starlink Operations     | Must be available |
      | Business and Operations | Must be available |

  @careers @filter @location
  Scenario: Filter Jobs by Location and Work Type
    When the user selects a location filter "Boca Chica"
    Then job listings should show only positions located at Boca Chica
    And the user should be able to filter or view:
      | Work Option               | Status                          |
      | Remote-eligible positions | Must be indicated               |
      | Fully on-site positions   | Must be indicated               |
      | Relocation packages       | Must be mentioned if applicable |

  @careers @filter @experience
  Scenario: Filter Jobs by Experience Level
    When the user filters by experience level "Entry-Level"
    Then positions appropriate for recent graduates should be displayed
    And when filtering by "Leadership/Management"
    Then senior and managerial positions with required experience should be clearly displayed

  @careers @application @details
  Scenario: View Full Job Details and Apply
    When the user clicks on a specific job posting
    Then the full job description page should load
    And the page should clearly detail **Qualifications, Responsibilities, and Application Instructions**
    And when the user clicks the "Apply Now" button
    Then the **application form should appear**, requiring marked fields and offering resume/CV upload

  @careers @development @growth
  Scenario: Understand Career Development and Training Opportunities
    When the user reviews professional growth opportunities
    Then information should highlight:
      | Development Opportunity      | Status            |
      | On-the-job training programs | Must be mentioned |
      | Mentorship opportunities     | Must be mentioned |
      | Tuition reimbursement        | Must be mentioned |
      | Internal promotion pathways  | Must be mentioned |

  @careers @status @portal
  Scenario: View Application Status and Communications
    Given a user has submitted a job application
    When the user accesses the application portal/dashboard
    Then the **current application status** (e.g., Submitted, Under Review) should be displayed
    And all communication from the recruitment team should be accessible

  @careers @diversity @eoe
  Scenario: View Diversity and Inclusion Commitment
    When the user reviews company policies
    Then a **Diversity and Inclusion commitment** should be clearly highlighted
    And resources for underrepresented groups or diversity statistics should be shared

  @careers @referral @alerts
  Scenario: Access Referral Program and Job Alerts
    When the user looks for additional career options
    Then details about the **Employee Referral Program** (bonuses, submission process) should be displayed
    And a **Job Alert subscription option** should be available, allowing users to set preferences (location, role type).

  @careers @resources @support
  Scenario: Access Career FAQ and Support Resources
    When the user has common questions or seeks additional information
    Then a dedicated **FAQ section** should be available, addressing topics like:
      | FAQ Topic                   | Status          |
      | Application Process         | Must be covered |
      | Visa Sponsorship/Relocation | Must be covered |
      | Interview Process Timeline  | Must be covered |
      | Benefits Eligibility        | Must be covered |
    And contact information for recruitment should be provided.
