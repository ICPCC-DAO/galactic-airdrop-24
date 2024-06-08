FROM --platform=linux/amd64 ubuntu:24.04 

# Install system packages and QEMU
RUN apt -yq update && \
    apt -yqq install --no-install-recommends curl ca-certificates build-essential pkg-config libssl-dev llvm-dev \
    liblmdb-dev clang cmake rsync libunwind-dev sudo git qemu-utils && \
    rm -rf /var/lib/apt/lists/*

# Resolve libssl compatibility issue
RUN curl http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb --output libssl1.deb && \
    dpkg -i libssl1.deb && \
    rm libssl1.deb

# Install Node.js using nvm
ENV NVM_DIR=/root/.nvm
ENV PATH="${NVM_DIR}/versions/node/v18.1.0/bin:${PATH}"
RUN curl --fail -sSf https://raw.githubusercontent.com/creationix/nvm/v0.39.1/install.sh | bash && \
    . "${NVM_DIR}/nvm.sh" && \
    nvm install 18.1.0 && \
    nvm use v18.1.0 && \
    nvm alias default v18.1.0

# Install latest available version of dfx
ENV DFXVM_INIT_YES=true 
RUN sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Add dfx to PATH
ENV PATH="/root/.local/share/dfx/bin:$PATH"

# Check if dfx is installed
RUN dfx --version

# Create an identity without encryption
RUN dfx identity new docker --storage-mode=plaintext

# Change working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# List files to debug file presence issues
RUN ls -l declarations/backend/


# Build source code
RUN npm run build

# Run source code
CMD ["npm", "run", "start"]