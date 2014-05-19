# [Can I Wear Shorts Today?](http://shorts.today)


## Setting Up (For Mac)

####Option 1. - Apache

Set your apache config to use /app as the root directory. After this you should be good to go at http://localhost or equivalent.

####Option 2. - Grunt


Fire up the development server

```
$ grunt serve
```

This should start the development server and the web page should open.

If this doesnt work, try

```
$ npm install
```

which will install all your node dependencies.

You may also need to install bower
```
npm install -g bower
```

and compass (to compile sass)
```
gem update --system && gem install compass
```

## Running the Backend

To run the backend:

```
$ node shorts-api/server.js
```

Which should start a server at `localhost:3000`. If not, you may have to install some dependencies.
