# ObjectiveFire
ObjectiveFire is a library that allows Firebase to be utilized as an object oriented database.

It allows you to represent the data in your database as objects rather than having to navigate through the hierarchical database structure of Firebase while still maintaining the awesome realtime synchronization features of Firebase. It takes care of all the back end of converting the data from Firebase into objects. This makes it quick and easy to use Firebase as the data backend of your application.

## Dependencies
Objective Fire is built off of AngularJS and AngularFire. Eventual plans are to move this library to not use anything other than Firebase.

You'll need to have AngularJS, Firebase, and AngularFire all included in your project for ObjectiveFire to work.

## Getting Started
TODO: Explain how to use ObjectiveFire

## Development
Source code is contained in the src directory. The built code is in the build directory. Documentaiton is in the docs directory.

To utilize all the development features you'll need to install the npm and bower dependencies. This would be done by executing the following in the project directory:
```terminal
npm install
```
```terminal
bower install
```

ObjectiveFire uses Grunt as a task runner. Multiple Grunt tasks are configured.

1. Runs Unit Tests then watches for changes in source files and re-runs the Unit Tests whenever it changes
```terminal
grunt test
```
2. Produces documentation for the project based on the comments
```terminal
grunt doc
```
3. Creates minified (production) versions of the code
```terminal
grunt compile
```
4. Runs the Unit Tests, then produces documentaiton and production version of the code
```terminal
grunt build
```

By default grunt will run 'build'
