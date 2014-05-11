# Can I Wear Shorts Today?

## Setting Up

Ensure that `php-cgi` is in your `$PATH`.

```
$ which php-cgi
```

If you get `php-cgi not found`, install it using homebrew:

```
$ brew tap homebrew/dupes
$ brew tap josegonzalez/homebrew-php
$ brew install php54
```

Install the gateway module

```
$ npm install gateway
```

Then fire up the development server

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

## Installing Packages

Using the dependencies listed in the current `bower.json`

```
$ bower install
```

Using a local or remote package

```
$ bower install <package>
```

Installing a package and writing it to the `bower.json`

```
$ bower install <package> --save
```
