#SnappyJS Framework#
---
[![Build Status](https://api.travis-ci.org/rknell/snappyapps-seed.png?branch=master)](https://api.travis-ci.org/rknell/snappyapps-seed)
*Build a rapid API by simply adding files. Uses Express and Mongoose.*

If you have ever used SailsJS before, then you will be right at home. Simply add models and route files to the appropriate folder and the app will automatically scaffold and setup express endpoints for you.

## Security ##
If you need to secure the endpoints, you can simply add express middleware in the declaration at the bottom of the route / controller / model.

## Testing ##
The code comes with 100% test coverage, which extends into the example models and routes. One of the big frustrations I have had with most frameworks is trying to find an appropriate testing methodology - this comes baked into the process with Mocha and Istanbul already setup for you, with mongoose mocked with an in memory database.

To run the tests simply run 

    $ grunt test

## Status ##
This project is in VERY early development. This framework is currently being used on projects at [SnappyApps](http://www.snappy-apps.com.au) and probably shouldn't be taken on heavily until it is a bit more mature. HOWEVER - the code base is surprisingly small (< 1000 lines of functional code) so you just want to use it as a launching pad for a project, it is very easy to customise and make your own.

##Getting Started##
The code is pretty well documented to allow you to get started playing around. Just clone the repository, run npm install and have a play around.
