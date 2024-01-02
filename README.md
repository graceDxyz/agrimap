# Agrimap Installation Steps

## Installation Steps

### 1. Download and Install Node.js

Visit the official Node.js website at [https://nodejs.org/](https://nodejs.org/) and download the latest LTS version (which should be 18 or higher).

#### For Windows:

Run the installer you downloaded and follow the on-screen instructions.

#### For macOS:

Use Homebrew to install Node.js:

```bash
brew install node
```

For Linux:
Use your package manager to install Node.js. For example, on Ubuntu:

```bash
sudo apt update
sudo apt install nodejs
```

### 2. Install pnpm

Open a terminal and install pnpm globally:

For Windows, macOS, and Linux:

```bash
npm install -g pnpm
```

### 3. Verify Installation

Check if Node.js, npm, and pnpm are installed:

```bash
node -v
npm -v
pnpm -v
```

## Configuration and Dependency Installation

### 1. Copy Environment Variables

Duplicate the `.env.example` file to create a new `.env` file. You can do this by running the following command:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open the newly created .env file in a text editor and set the necessary configuration variables. Some variables may already have default values in the .env.example file. Review and modify the values as needed.

```dotenv
# .env

# Example variables (modify or add as needed)
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mydatabase

# Add your additional configuration variables below this line
# VARIABLE_NAME=variable_value
# ANOTHER_VARIABLE=another_value

# Ensure you set the following variables based on your project requirements
# MISSING_VARIABLE_1=
# MISSING_VARIABLE_2=
```

> Note: Replace VARIABLE_NAME, ANOTHER_VARIABLE, MISSING_VARIABLE_1, MISSING_VARIABLE_2, etc., with the actual names of the variables your project uses. Leave MISSING_VARIABLE_1 and MISSING_VARIABLE_2 blank, and developers can fill in the appropriate values.

### 3. Install Project Dependencies

Run the following command to install project dependencies using pnpm:

```bash
pnpm install
```

This command reads the dependencies from the package.json file and installs them locally.

## Running the Project

### 1. Start the Application

To run your application in development mode, use the following command:

```bash
pnpm dev
```

This command, assuming your project is configured for it, will start the development server, allowing you to access your application locally.

### 2. Access Your Application

Once the development server is running, open your web browser and navigate to the appropriate URL ([http://localhost:5173](http://localhost:3000) or as specified by your project).
