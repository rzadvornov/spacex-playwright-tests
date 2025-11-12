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

# Install allure-playwright explicitly to ensure it's available
RUN npm list allure-playwright || npm install allure-playwright@^2.13.0

# Run tests and verify allure results
CMD ["sh", "-c", "echo '=== Starting tests ===' && npx playwright test --reporter=list,allure-playwright || echo 'Tests completed with exit code: $?' && echo '=== Checking for Allure results ===' && find . -name 'allure-results' -type d && echo '=== Allure results contents ===' && ls -la allure-results/ && echo '=== Checking for any JSON files ===' && find . -name '*.json' | grep -v node_modules | head -10"]