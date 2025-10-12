@performance @seo
Feature: SpaceX Human Spaceflight Performance and SEO
  As a site owner
  I want the page to perform well and be discoverable by search engines
  So that users have a fast experience and the page ranks well in search results

  Background:
    Given I am on the SpaceX Human Spaceflight homepage

  @performance @metrics
  Scenario: Page performance metrics meet requirements
    Then the page should meet core web vitals:
      | Metric                   | Threshold | Importance |
      | Largest Contentful Paint | < 4000ms  | Critical   |
      | First Input Delay        | < 100ms   | High       |
      | Cumulative Layout Shift  | < 0.1     | High       |
      | First Contentful Paint   | < 2000ms  | Medium     |
      | Time to First Byte       | < 1000ms  | Medium     |
      | Initial Page Load        | < 5000ms  | High       |
    And the Lighthouse performance score should be at least 80

  @performance @optimization
  Scenario Outline: Resource optimization checks
    Then "<Resource Type>" should meet optimization requirements:
      | Requirement       | Status    | Details              |
      | Minification      | Required  | Reduced file size    |
      | Compression       | Required  | gzip/brotli          |
      | Caching           | Required  | Appropriate headers  |
      | Loading Strategy  | <Loading> | <Strategy Details>   |
      | Size Optimization | Required  | Reasonable file size |
      | Modern Format     | <Format>  | <Format Details>     |

    Examples:
      | Resource Type | Loading              | Strategy Details             | Format   | Format Details      |
      | Images        | Lazy load below fold | Responsive srcset attributes | Required | WebP, AVIF support  |
      | CSS           | Critical first       | Async non-critical loading   | Optional | Modular stylesheets |
      | JavaScript    | Defer non-critical   | Code-splitting enabled       | Optional | ES6+ with fallbacks |

  @performance @quality
  Scenario: Resource loading and error prevention
    When I inspect the page
    Then there should be no issues:
      | Category         | Requirement             |
      | Console Errors   | No JavaScript errors    |
      | Network Requests | All requests successful |
      | Resource Loading | No 404 errors           |
      | Browser Warnings | No deprecation warnings |
      | Layout Issues    | No content shifts       |

  @seo @metadata
  Scenario: Essential SEO metadata configuration
    Then the page should have required meta tags:
      | Meta Element | Requirement         | Value/Pattern               |
      | Title        | Exact match         | SpaceX - Human Spaceflight  |
      | Description  | Max 160 chars       | Contains mission keywords   |
      | Viewport     | Mobile optimization | width=device-width, scale=1 |
      | Keywords     | Relevant terms      | space, spacex, spaceflight  |
      | Robots       | Search indexing     | index, follow               |
    And the description should include key mission terms

  @seo @keywords
  Scenario: Keyword optimization and relevance
    Then keywords should be properly distributed:
      | Category          | Required Terms                   |
      | Brand Terms       | space, spacex, human spaceflight |
      | Vehicle Terms     | dragon, starship, astronauts     |
      | Destination Terms | mars, moon, earth orbit          |
      | Mission Terms     | research, exploration, missions  |
    And keywords should appear naturally in content

  @seo @opengraph
  Scenario: Social media and sharing optimization
    Then Open Graph tags should be configured:
      | OG Property | Requirement       | Value/Format           |
      | Title       | Brand name        | SpaceX                 |
      | Type        | Content type      | website                |
      | URL         | Canonical URL     | Current page URL       |
      | Site Name   | Platform name     | SpaceX                 |
      | Image       | Hero image        | Min 1200x630px         |
      | Description | Share description | Present and compelling |

  @seo @structure
  Scenario: Technical SEO implementation
    Then the page should have proper structure:
      | Element         | Requirement             | Details                   |
      | Schema.org      | Valid JSON-LD           | Organization, WebPage     |
      | Heading Tags    | Hierarchical structure  | Single H1, proper nesting |
      | Primary Heading | Contains target keyword | "Human Spaceflight"       |
      | URL Structure   | SEO-friendly            | Clear, readable format    |
      | Canonical URL   | Properly specified      | Matches current URL       |

  @seo @accessibility
  Scenario: SEO-friendly accessibility features
    Then accessibility features should support SEO:
      | Feature       | Implementation                  | SEO Benefit               |
      | ARIA Labels   | Present on interactive elements | Enhanced context          |
      | Alt Text      | Descriptive image text          | Image search optimization |
      | Semantic HTML | Proper tag usage                | Better content structure  |
      | Language Tags | Specified correctly             | International targeting   |

  @seo @content
  Scenario: Content uniqueness and internal linking
    Then internal links should meet requirements:
      | Requirement       | Details                          |
      | URL Structure     | Relative paths where appropriate |
      | Anchor Text       | Descriptive, no generic text     |
      | Navigation        | All links functional             |
      | Link Distribution | Even throughout content          |
    And content should be unique:
      | Check Type        | Requirement                    |
      | Duplicate Content | No repeated sections           |
      | Cross-page Check  | Unique from other SpaceX pages |
      | Section Review    | No redundant information       |

  @seo @mobile
  Scenario: Mobile SEO optimization
    When viewing on mobile device:
      | Device Setting | Value/Requirement              |
      | Viewport Width | 375px                          |
      | Text Size      | Readable without zoom          |
      | Touch Targets  | Minimum 44x44px                |
      | Content Access | No blocking interstitials      |
      | Page Layout    | Responsive and well-structured |
    Then the page should provide optimal mobile experience
