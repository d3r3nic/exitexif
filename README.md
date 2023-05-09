# MetaMorph

MetaMorph is a web service that removes EXIF metadata from images. It can be used as a standalone web app or integrated into other applications via an API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Local Development

To set up and run MetaMorph locally:

1. Clone the repository: `git clone https://github.com/username/MetaMorph.git`
2. Navigate into the project directory: `cd MetaMorph`
3. Install dependencies: `npm install`
4. Start the app: `npm start`

The app will run in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

## Running with Docker

1. Build the Docker image: `docker build -t MetaMorph .`

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

## CI/CD Pipeline

We use CircleCI for continuous integration and delivery. Whenever new code is pushed to the repository, CircleCI builds a Docker image of the app and pushes it to Amazon ECR.

## Deployment

MetaMorph is deployed on AWS. The live app can be accessed at: `http://your-live-app-url.com`

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
