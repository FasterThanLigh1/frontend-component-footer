#!/bin/bash

# --- Configuration ---
DEPLOY_BRANCH="deployment" # The prefix for your orphan branch name
TEMP_DIR="../temp-deploy"        # The temporary directory outside of git
PACKAGE_FILE="package.json"

# --- Pre-flight Checks ---

# 1. Ensure the script stops on the first error
set -e

# 2. Check for uncommitted changes on the current branch
if [[ -n $(git status -s) ]]; then
  echo "🚨 ERROR: You have uncommitted changes. Please commit or stash them before running the deployment script."
  exit 1
fi

echo "🚀 Starting automated deployment process..."

# 3. Get the current version
CURRENT_VERSION=$(node -p "require('./$PACKAGE_FILE').version")
NEW_BRANCH_NAME="$DEPLOY_BRANCH-$CURRENT_VERSION"

echo "Current version: $CURRENT_VERSION. New branch will be: $NEW_BRANCH_NAME"

echo "Run npm install first"
# npm run build should run first and create the 'dist' directory
npm install

# --- Step 1: Build and Version Update ---
echo "1. Running build and version update..."
# npm run build should run first and create the 'dist' directory
npm run build

# If you want to automatically increment the patch version (optional, but good practice):
# npm version patch --no-git-tag-version

# --- Step 2: Prepare Package File ---
echo "2. Saving package.json to temp directory..."
mkdir -p "$TEMP_DIR"
cp "$PACKAGE_FILE" "$TEMP_DIR/$PACKAGE_FILE"

# --- Step 3: Create/Switch to Orphan Branch ---
echo "3. Switching to or creating new orphan branch: $NEW_BRANCH_NAME"

# Create a new orphan branch named deployment-X.Y.Z
git checkout --orphan "$NEW_BRANCH_NAME"

# --- Step 4: Clean the Working Directory ---
echo "4. Removing old files from the orphan branch..."
# Remove all files from the index (they are still in the working directory)
git rm -rf .

# --- Step 5: Copy Back and Stage Artifacts ---
echo "5. Restoring package.json and adding build artifacts..."

# Copy back the saved package.json
cp "$TEMP_DIR/$PACKAGE_FILE" "$PACKAGE_FILE"

# Add only the necessary files: the built artifacts and package.json
git add dist "$PACKAGE_FILE"

# --- Step 6: Commit and Push ---
echo "6. Committing and pushing the release branch..."
git commit -m "Deployment release: $CURRENT_VERSION"
git push origin "$NEW_BRANCH_NAME" --force

# --- Step 7: Cleanup and Switch Back ---
echo "7. Cleaning up and switching back to the previous branch..."
# Switch back to your main development branch (assuming it's 'main' or 'master')
# You will be prompted to do a checkout if you want to switch back to where you were
git checkout sumac2 # Change 'main' to your primary development branch name

# Clean up the temporary directory
rm -rf "$TEMP_DIR"

echo "✅ Deployment completed successfully on branch: $NEW_BRANCH_NAME"
