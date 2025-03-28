# node-acme

This is an example of how lockfile handling can be done with a Node backend server and the new TypeScript solution setup.

A Docker build, run, and push setup is also included.

## Getting Started

```shell
pnpm install
```

Also run a local Docker registry so we can push and pull from it.

```shell
docker run -d -p 5001:5000 --name registry registry:2.7
```

## Build application

```shell
pnpm nx run api:build
```

This will output into `apps/api/dist` folder.


## Generate lockfile

```shell
pnpm nx run api:gen-lockfile
```

This outputs `apps/api/pnpm-lock.yaml` as a pruned version of the root `pnpm-lock.yaml`.

We're using the `tools/lockfile.mjs` script to call devkit and internal APIs to do what the executors like `@nx/esbuild:esbuild` used to do.

## Running Docker container

```shell
pnpm nx run api:docker-run
```

This will run `build` and `gen-lockfile` before building the Docker image using `apps/api/Dockerfile`.

## Push Docker image to local registry

```shell
pnpm nx run api:docker-push
```

This will push the `api` image to `localhost:5001`, so you can also run:

```shell
docker pull localhost:5001/api
docker run -p 3000:3000 localhost:5001/api
```
