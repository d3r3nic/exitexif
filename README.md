# exitexif

exitexif is a web service that removes EXIF metadata from images. It can be used as a standalone web app or integrated into other applications via an API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

To set up and run exitexif locally:

1. Clone the repository: `git clone https://github.com/d3r3nic/exitexif.git`
2. Navigate into the project directory: `cd exitexif`
3. Install dependencies: `npm install`
4. Start the app: `npm start`

The app will run in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

## Running with Docker

1. Build the Docker image: `docker build -t exitexif .`

2. Start the Docker container:

    - For Unix-based systems (Linux, MacOS):
      ```bash
      docker run -p 3000:3000 -v $(pwd):/app -d exitexif
      ```

    - For Windows systems:
      ```bash
      docker run -p 3000:3000 -v %cd%:/app -d exitexif
      ```

This command starts the Docker container and creates a volume that syncs the current directory with the `/app` directory in the Docker container. This allows changes in your local code to be immediately reflected in the Docker container, enabling hot reloading.


## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in the development mode.
- `npm test`: Launches the test runner in the interactive watch mode.
- `npm build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
- `npm eject`: Removes the single build dependency from your project.

## Adding a New Package

When you need to add a new package to the project, follow these steps:

1. Install the new package in your local project using npm. For example:

    ```bash
    npm install new-package
    ```

   Replace `new-package` with the name of the package you're adding.

2. Rebuild your Docker image:

    ```bash
    docker build -t exitexif .
    ```

3. Stop the running Docker container. First, find the container ID with:

    ```bash
    docker ps
    ```

   Then stop the container with:

    ```bash
    docker stop container_id
    ```

   Replace `container_id` with the ID of your running Docker container.

4. Start a new Docker container with the updated image:

   For Unix-based systems (Linux, MacOS):

    ```bash
    docker run -p 3000:3000 -v $(pwd):/app -d exitexif
    ```

   For Windows systems:

    ```bash
    docker run -p 3000:3000 -v %cd%:/app -d exitexif
    ```

Now your running Docker container should include the new package.

## Testing

To run the test suite: `npm test`

## Infrastructure Management

We use Terraform to manage our AWS infrastructure, including our S3 bucket, CloudFront distribution, SSL certificate, and Route 53 records.

The Terraform configuration is stored in a separate repository: [link to your Terraform repository]

To set up and manage the infrastructure:

Clone the Terraform repository and follow the steps: `git clone https://github.com/d3r3nic/terraform-repo.git` 

For more information about using Terraform, see the [Terraform documentation](https://www.terraform.io/docs/index.html).

## CI/CD Pipeline

We use GitHub Actions for our CI/CD pipeline. On each push to the main branch, our pipeline builds the React application and deploys it to an AWS S3 bucket.

Here's an example of our GitHub Actions workflow:

```yaml
name: Build and Deploy
on:
  push:
    branches:
      - main  # replace with your default branch if not 'main'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: 14

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to S3
      uses: jakejarvis/s3-sync-action@master
      with:
        args: --acl public-read --follow-symlinks --delete
      env:
        AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_REGION: 'us-west-2'  # replace with your AWS region
        SOURCE_DIR: 'build'
```
## Deployment

exitexif is deployed on AWS using a static website hosting configuration on an S3 bucket. The infrastructure for the deployment is managed using Terraform, with the configuration stored in a separate repository.

The live app can be accessed at: `http://your-live-app-url.com`

To deploy changes to the application:

1. Merge your changes into the main branch. Our CI/CD pipeline, which uses GitHub Actions, automatically builds the application and deploys it to the S3 bucket.

2. If you've made changes that require updates to the infrastructure (for example, changes to the Terraform configuration), you'll need to apply those changes separately. Navigate to the Terraform repository and follow the instructions in the README to apply the changes.

Please note that you'll need appropriate permissions to merge changes into the main branch and to apply changes to the infrastructure.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
