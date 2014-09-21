ember-traceur-compiler
=========

Please not that this code was not going to be maintained!
I only created it as a proof of concept to try and understand how to compile
ember source code without ember-cli. ( you can read more about it [here](https://ca.non.co.il/index.php/ember-cli-is-making-you-stupid/) )

I think this info might be beneficial for other people so I'm posting
this repo but this process is way to messy to be used for anything real,
and I don't think it worth putting to much effort into it at the moment.

But if you do happen to use this code and make some improvements to it please send a pull request

## Install

clone the repo.
install npm and bower modules

_I tried to make this to work as much as possible without changing ember source code
unfortunately some changes have to made to ember code. all this changes are available in ember-lib.patch_

apply ember-lib patch
```git apply ember-lib.patch```

run the node app and load the page in your browser (port 3000)

## Known issues

This code loads and compiles all the modules in the browser. relatively slow
meaning you'll have to wait a few seconds before your App loads.

it seems like sometimes source maps doesn't work properly
(I'm not sure if it's a Traceur/Browser bug or just something I'm missing)

## License

ember-traceur-compiler is [MIT Licensed](https://github.com/yonjah/ember-traceur-compiler/blob/master/LICENSE).