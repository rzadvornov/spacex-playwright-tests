FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Install browsers and generate BDD files during build
RUN npx playwright install --with-deps && npx bddgen

CMD ["npx", "playwright", "test"]