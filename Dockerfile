# ==========================================
# Stage 1: Builder - Install Dependencies & Pre-build
# Goal: Cache node_modules, run npm ci, and generate BDD files.
# ==========================================
FROM mcr.microsoft.com/playwright:v1.56.1-jammy AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and run the BDD generator
COPY . .
RUN npx bddgen

# Create allure results directory (needed to ensure the directory is ready)
# Install allure-playwright (it's best installed here as a dependency)
RUN mkdir -p allure-results && npm install allure-playwright@^2.13.0

# ==========================================
# Stage 2: Runtime - Test Execution (Secured)
# Goal: Run the application as a non-root user for security.
# ==========================================
FROM mcr.microsoft.com/playwright:v1.56.1-jammy AS runtime

# Create a dedicated, non-privileged user and group
# The Playwright base image (Jammy) is Ubuntu-based, so adduser/addgroup works.
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Set the working directory for the runtime stage
WORKDIR /app

# 1. Copy necessary files from the builder stage
# We only need the source code, node_modules, generated files, and package files.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/. .

# 2. Set ownership for the copied files and node_modules
# This prevents permission errors when the non-root user tries to run commands.
RUN chown -R appuser:appgroup /app

# 3. Switch to the non-root user for the final execution
USER appuser
# --------------------------------------------------------

# Run tests
# Note: We don't need 'npx playwright install --with-deps' here because the base image already includes browsers and the npm ci step ran in the builder.
CMD ["npx", "playwright", "test"]
