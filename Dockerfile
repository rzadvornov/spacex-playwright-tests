FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Install browsers and generate BDD files during build
RUN npx playwright install --with-deps && npx bddgen

# Create allure results directory
RUN mkdir -p allure-results

# Install allure-playwright
RUN npm install allure-playwright@^2.13.0

# Run tests
CMD ["npx", "playwright", "test"]