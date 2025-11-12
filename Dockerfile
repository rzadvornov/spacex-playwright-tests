FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Install browsers and generate BDD files during build
RUN npx playwright install --with-deps && npx bddgen

# Create allure results directory with proper permissions
RUN mkdir -p allure-results && chmod 777 allure-results

# Add debug command and run tests with more verbose output
CMD ["sh", "-c", "echo '=== Starting tests ===' && npx playwright test --reporter=list,allure-playwright --verbose && echo '=== Tests completed ===' && echo '=== Allure results contents ===' && ls -la allure-results/ && echo '=== File count ===' && find allure-results -name '*.json' | wc -l"]