# SpaceX Playwright Test Automation Suite

> Comprehensive test automation framework for SpaceX API and UI using Playwright, TypeScript, and Cucumber BDD.

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=flat&logo=cucumber&logoColor=white)](https://cucumber.io/)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture & Design Patterns](#-architecture--design-patterns)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Tests](#-running-tests)
- [Configuration](#-configuration)
- [Reporting](#-reporting)
- [Contributing](#-contributing)

## ✨ Features

- **BDD Framework**: Cucumber integration with Gherkin syntax for readable test scenarios
- **API Testing**: Comprehensive SpaceX API endpoint validation
- **UI Testing**: End-to-end browser automation for SpaceX web applications
- **Multiple Reporters**: HTML, Allure, and Cucumber JSON reports
- **Parallel Execution**: Configurable parallel test execution for faster feedback
- **TypeScript**: Fully typed codebase for better IDE support and fewer runtime errors
- **CI/CD Ready**: Easily integrable with continuous integration pipelines

## 🏗 Architecture & Design Patterns

This project implements several software design patterns to ensure maintainability, scalability, and code reusability:

### 1. Strategy Pattern
**Location**: [`src/utils/strategies/FilterStrategyFactory.ts`](src/utils/strategies/FilterStrategyFactory.ts)

Encapsulates filtering algorithms (department, location, experience) into interchangeable strategies, allowing dynamic selection at runtime.

```typescript
export class FilterStrategyFactory {
  private static strategies: Map<string, FilterStrategy> = new Map([
    ["department", new DepartmentFilterStrategy()],
    ["location", new LocationFilterStrategy()],
    ["experience", new ExperienceFilterStrategy()],
  ]);
  
  static getStrategy(type: string): FilterStrategy {
    // Returns appropriate strategy based on filter type
  }
}
```

**Benefits**:
- Easy to add new filtering strategies without modifying existing code
- Eliminates complex conditional logic
- Follows Open/Closed Principle

### 2. Factory Pattern
**Location**: [`src/step-definitions/api/APISharedSteps.ts`](src/step-definitions/api/APISharedSteps.ts)

Dynamically creates API service instances based on resource names, abstracting object creation logic.

```typescript
const apiServiceMap: ApiMap = {
  Starlink: StarlinkAPI,
  Ships: ShipsAPI,
  Dragons: DragonsAPI,
  // ...other resources
};

const ApiClass = apiServiceMap[apiName];
this.activeAPI = new ApiClass(this.request);
```

**Benefits**:
- Centralized object creation
- Easy to extend with new API services
- Reduces coupling between step definitions and API classes

### 3. Page Object Model (POM)
**Location**: [`src/services/ui/`](src/services/ui/) (e.g., `CareersPage.ts`)

Abstracts page elements and interactions into reusable classes, separating test logic from UI structure.

```typescript
export class CareersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly jobListings: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search"]');
    this.jobListings = page.locator('.job-listing');
  }
  
  async searchJobs(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
  }
}
```

**Benefits**:
- Improves test maintainability
- Reduces code duplication
- Makes tests more readable
- Centralizes UI element locators

### 4. Template Method Pattern
**Location**: [`src/services/base/APIBase.ts`](src/services/base/APIBase.ts)

Defines a skeleton of API operations in a base class, with concrete implementations provided by derived classes.

```typescript
abstract class APIBase {
  abstract makeGetRequest(id?: string): Promise<void>;
  abstract makePostRequest(payload: object): Promise<void>;
  abstract validateResponse(expectedData: object): void;
  
  // Common implementation shared across all APIs
  protected async executeRequest(endpoint: string): Promise<APIResponse> {
    // Common request logic
  }
}
```

**Benefits**:
- Promotes code reuse through inheritance
- Enforces consistent API structure
- Allows customization in derived classes

## 📁 Project Structure

```
spacex-playwright-tests/
├── src/
│   ├── features/              # Gherkin feature files (BDD scenarios)
│   │   ├── api/               # API test specifications
│   │   │   ├── starlink.feature
│   │   │   ├── ships.feature
│   │   │   └── ...
│   │   └── ui/                # UI test specifications
│   │       ├── careers.feature
│   │       └── ...
│   ├── fixtures/              # Test data and fixtures
│   │   ├── api-responses.json
│   │   └── test-data.json
│   ├── services/              # Service layer
│   │   ├── api/               # API service clients
│   │   │   ├── StarlinkAPI.ts
│   │   │   ├── ShipsAPI.ts
│   │   │   └── ...
│   │   ├── ui/                # Page Object Model classes
│   │   │   ├── CareersPage.ts
│   │   │   ├── HomePage.ts
│   │   │   └── ...
│   │   └── base/              # Base/Abstract classes
│   │       ├── APIBase.ts
│   │       └── PageBase.ts
│   ├── step-definitions/      # Cucumber step implementations
│   │   ├── api/               # API step definitions
│   │   │   ├── APISharedSteps.ts
│   │   │   └── ...
│   │   └── ui/                # UI step definitions
│   │       └── ...
│   └── utils/                 # Helper functions and utilities
│       ├── strategies/        # Strategy pattern implementations
│       │   ├── FilterStrategyFactory.ts
│       │   └── ...
│       └── helpers/           # Common helper functions
├── playwright.config.ts       # Playwright configuration
├── cucumber.config.ts         # Cucumber configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rzadvornov/spacex-playwright-tests.git
   cd spacex-playwright-tests
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (if not already installed):
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run API Tests Only
```bash
npx playwright test --project=API
```

### Run UI Tests Only
```bash
npx playwright test --project=chromium
```

### Run Specific Feature File
```bash
npx playwright test --grep "@tagname"
```

### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Tests
```bash
npx playwright test --debug
```

### Generate and View HTML Report
```bash
npx playwright show-report
```

## ⚙️ Configuration

### Playwright Configuration
The main configuration file is [`playwright.config.ts`](playwright.config.ts). You can customize:

- **Base URLs**: Set different URLs for different environments
  ```typescript
  use: {
    baseURL: process.env.BASE_URL || 'https://api.spacexdata.com/v4',
  }
  ```

- **Browser configurations**: Chrome, Firefox, WebKit
- **Parallel execution**: Number of workers
- **Timeouts**: Global and per-test timeouts
- **Reporting options**: HTML, Allure, JSON, etc.
- **Screenshot and video capture**: On failure, always, or never

### Environment Variables
Create a `.env` file in the root directory:

```env
BASE_URL=https://api.spacexdata.com/v4
UI_BASE_URL=https://www.spacex.com
HEADLESS=true
WORKERS=4
```

### Test Tags
Use Cucumber tags to organize and filter tests:

```gherkin
@api @smoke
Feature: Starlink API Tests
  
  @critical
  Scenario: Retrieve all Starlink satellites
    Given I send a GET request to "starlink" endpoint
    Then the response status code should be 200
```

Run tests by tag:
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@critical"
```

## 📊 Reporting

This project supports multiple reporting formats:

### HTML Report (Default)
```bash
npx playwright show-report
```
Generated at: `playwright-report/index.html`

### Allure Report
```bash
# Generate Allure results
npm run test

# View Allure report
npx allure serve allure-results
```

### Cucumber JSON Report
Located at: `cucumber-report/cucumber-report.json`

Can be used with various Cucumber report generators.

### CI/CD Integration
Reports are automatically generated in CI/CD pipelines and can be published as artifacts.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards
- Follow TypeScript best practices
- Write meaningful test scenarios in Gherkin
- Maintain the existing design patterns
- Add comments for complex logic
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Modern web testing framework
- [Cucumber](https://cucumber.io/) - BDD framework
- [SpaceX API](https://github.com/r-spacex/SpaceX-API) - Open-source REST API

---

**Made with ❤️ for SpaceX API Testing**