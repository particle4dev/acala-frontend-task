# acala-frontend-task

## Getting Started

### Prerequisites

Following are the minimum tested versions for the tools and libraries you need for running the app:

- Nodejs: v14.17.5 or newer

- Yarn: v1.22.5 or newer

- Npm: v7.21.0 or newer

### Installing

First, clone the repo via git:

```bash
git clone --depth 1 --single-branch --branch main https://github.com/particle4dev/acala-frontend-task.git
```

And install dependencies with yarn.

```bash
cd acala-frontend-task
yarn install
```

To start the webapp in local, please run:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build the app:

```bash
yarn build
```

To export the app to static HTML which can be serve by backend task, please run:

```bash
yarn export
```

and see the result in `out` folder

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
