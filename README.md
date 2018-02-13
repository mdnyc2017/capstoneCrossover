
# Crossover
## By Mario Cabardo, Jeanne Castillo, Michael Douglas, and Noorulain Khaliq

## Description
Crossover is a collaborative storytelling application allowing users to create comic-book and graphic novel styled content alone and with friends.

Crossover was built entirely with React on the front-end, React-Konva to manage the state of the HTML5 canvas element, [Cloudinary API’s](https://cloudinary.com/documentation/solution_overview) to manipulate and store images, Google Cloud Firestore to store user data and references to images in Cloudinary, and we deployed the application with Google Firebase.

You can view a presentation discussing the inspiration for Crossover, its development, and its functionality by the engineering team [here](https://goo.gl/yBrzhx).

Crossover was completed over 10 days as the Capstone Project to fulfill the graduation requirements of [Fullstack Academy](https://www.fullstackacademy.com/).

# Get started:

```
git clone git@github.com:queerviolet/spark.git
cd spark
npm install
npx firebase init
npm start
```

# Frontend

The frontend starts in [`main.js`](./main.js). The root of the react app
is in [`App.jsx`](./App.jsx).

# Functions

Write your [Cloud Functions](https://firebase.google.com/docs/functions/) in
[`functions/index.js`](./functions/index.js).

You can require node modules from Cloud Functions normally. Be sure to `npm install` them
*inside* the functions directory (it has its own `package.json`).

Sadly, you can't use `import` statements, and you can't `require` code that does.
Don't despair, the library provides a workaround.

## The Library

The library is defined in [`lib/index.js`](lib/index.js). In the library, you
can `import` code from your project normally, and anything you `export` will be
available to your Cloud Functions.

It is a bridge between Cloud Function code and the rest of your
project's code.

# Hot loading

Hot module replacement is enabled, and the react-hot-loader plugins are applied.

Your React components will update in place after you save them, without losing
their state.
