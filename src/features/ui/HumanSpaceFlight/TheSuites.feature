@suits
Feature: SpaceX Human Spaceflight The Suits Section
  As an interested space enthusiast
  I want to learn about astronaut suits
  So that I can understand the equipment used in different space missions

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the Suits section

  @smoke @content
  Scenario: Essential suits section content display
    Then the Suits section should display core elements:
      | Element    | Content                       | State             |
      | Heading    | "The Suits"                   | Visible           |
      | IVA Button | INTRAVEHICULAR ACTIVITY (IVA) | Active by default |
      | EVA Button | EXTRAVEHICULAR ACTIVITY (EVA) | Inactive          |
      | Suit Image | Current suit type             | Centered          |
      | Hotspots   | Interactive points            | Visible           |
      | Background | Gradient effect               | Visible           |

  @interaction
  Scenario Outline: Suit type switching functionality
    Given I view the Suits section with the "<Initial>" suit displayed
    When I click on the "<Target>" button
    Then the following state changes should occur:
      | Element          | State Change             |
      | <Target> Button  | Becomes active           |
      | <Initial> Button | Becomes inactive         |
      | Suit Image       | Changes to <Target> suit |
      | Hotspots         | Update for new suit type |

    Examples:
      | Initial | Target |
      | IVA     | EVA    |
      | EVA     | IVA    |

  @hotspots @interaction
  Scenario: Suit hotspot interaction behavior
    Then hotspots should be configured properly:
      | Requirement  | Specification                |
      | Quantity     | Minimum 6 interactive points |
      | Distribution | Spread across suit surface   |
      | Upper Body   | Multiple hotspots present    |
      | Lower Body   | Multiple hotspots present    |
    When I interact with hotspots:
      | Action         | Expected Result               |
      | Hover          | Callout appears after delay   |
      | Move Away      | Callout disappears            |
      | Multiple Hover | Each shows unique information |

  @visual @styling
  Scenario: Visual presentation requirements
    Then the suit display should meet visual standards:
      | Element         | Requirement          | Details                   |
      | Suit Image      | Properly loaded      | No broken icons           |
      | Image Position  | Centered in viewport | Balanced layout           |
      | Background      | Gradient effect      | Enhances visibility       |
      | Hotspot Markers | Clearly visible      | Contrast with suit        |
      | Callouts        | Position adapts      | Based on hotspot location |

  @content @validation
  Scenario: Suit information accuracy and completeness
    Then each suit type should display complete information:
      | Suit Type | Required Information          |
      | IVA       | In-vehicle activity details   |
      | EVA       | Space walk capability details |
    And each hotspot should provide:
      | Content Type | Requirement             |
      | Component    | Unique description      |
      | Function     | Clear explanation       |
      | Technical    | Accurate specifications |
