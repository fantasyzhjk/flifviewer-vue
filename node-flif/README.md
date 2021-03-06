# node-flif [![Build Status](https://travis-ci.org/FLIF-hub/node-flif.svg?branch=master)](https://travis-ci.org/FLIF-hub/node-flif)

Star this repo to increase the amount of FLIF in the world.

* * *

A Node wrapper for the FLIF CLI executable.

FLIF is a lossless image format designed with the web in mind. It has lots of great features. To learn more about the format go to [FLIF.info](http://flif.info).

This repository is for a Node.js module that wraps around a native executable for your platform. That executable performs the actions of encoding or decoding FLIF files. This wrapper allows you to pass in a javascript object containing your settings into a function that will create the commandline arguments for you and then run them against the executable CLI. It will also warn you if you pass in the wrong parameters or types of data.

* * *

### node-flif is **NOT** meant for browsers

Since node-flif wraps around a native executable and references the file system, it cannot be ran in a browser.

If you would like to encode/decode flif files in a browser look into other projects like:

* [Poly FLIF](https://github.com/UprootLabs/poly-flif/)
* [libflif.js](https://github.com/saschanaz/libflif.js/)

* * *

## Supported Environments

* **Windows** - Node v1.0.0+ (Tested in v0.12.18 and it wouldn't work, works on 1.0.0-8.x.x)
* **Linux/OSX** - Node v8.0.0+ (Tested in 2.5.0, 3.3.1, 4.0.0, 4.8.4, 5.0.0, 6.0.0, 7.0.0, 7.10.1, none worked. Tested in Ubuntu 16 and OSX 10.11 on Node 8.0.0 and 8.4.0 and it worked.)

**Why the difference between Node version on Win/\*Nix:**

Linux/OSX is using [flif-wasm](https://github.com/SaschaNaz/flif-wasm), it has a few known Windows-specific bugs however. So on Windows we are using a pre-built 32-Bit `flif.exe` file. Because `flif-wasm` relies on Node 8+, `node-flif` on those platforms requires that same version. Where as the Windows version does not have that requirement.

* * *

## Basic usage

Here is the basic encode, decode, transcode usage. Detailed API below.

Install (requires [Node/npm](https://nodejs.org))

```
npm install --save node-flif
```

**Asynchronous encode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var encodeParams = {
    input: path.join(process.cwd(), 'your-file.png'),
    output: path.join(process.cwd(), 'new-file.flif')
};
nodeFLIF.encode(encodeParams, function (data) {
    console.log('Encode finished.');
    if (data) {
        console.log(data);
    }
});
```

**Synchronous encode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var encodeParams = {
    input: path.join(process.cwd(), 'your-file.png'),
    output: path.join(process.cwd(), 'new-file.flif'),
    async: false
};

var data = nodeFLIF.encode(encodeParams);
console.log('Encode finished');
if (data) {
    console.log(data);
}
```

**Asynchronous decode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var decodeParams = {
    input: path.join(process.cwd(), 'your-file.flif'),
    output: path.join(process.cwd(), 'new-file.png')
};
nodeFLIF.decode(decodeParams, function (data) {
    console.log('Decode finished.');
    if (data) {
        console.log(data);
    }
});
```

**Synchronous decode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var decodeParams = {
    input: path.join(process.cwd(), 'your-file.flif'),
    output: path.join(process.cwd(), 'new-file.png'),
    async: false
};

var data = nodeFLIF.decode(decodeParams);
console.log('Decode finished');
if (data) {
    console.log(data);
}
```

**Asynchronous transcode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var transcodeParams = {
    input: path.join(process.cwd(), 'your-file.flif'),
    output: path.join(process.cwd(), 'new-file.flif')
};
nodeFLIF.transcode(transcodeParams, function (data) {
    console.log('Transcode finished.');
    if (data) {
        console.log(data);
    }
});
```

**Synchronous transcode example:**

```js
var nodeFLIF = require('node-flif');
var path = require('path');

var transcodeParams = {
    input: path.join(process.cwd(), 'your-file.flif'),
    output: path.join(process.cwd(), 'new-file.flif'),
    async: false
};

var data = nodeFLIF.transcode(transcodeParams);
console.log('Transcode finished');
if (data) {
    console.log(data);
}
```

In the above examples the variable of `data` should be `undefined` in normal use. It will only have a value if the flif executable returns text (likely a warning or error).

Additional API details below.

* * *

## API

* * *

### Encode

Convert your image **to** a FLIF.

```js
var nodeFLIF = require('node-flif');

var encodeParams = {
    // Required encoding parameters
    input: ['/path/to/input-file.png'],  // String for one file or Array of input files for frames, Each must end in one of these: .png, .pnm, .ppm, .pgm, .pbm, .pam
    output: '/path/to/output-file.flif', // Must end in .flif
    // Common optional encoding parameters
    async: true,            // Set to false to run this as a synchronous encoding
    overwrite: false,       // Set to true to overwrite existing files on output (default is false)
    effort: 60,             // 0 = fast/poor compression, 100 = slowest/best? (default is 60)
    interlace: 'auto',      // true, false, or 'auto' (interlacing except on tiny images) (default is 'auto')
    encodeQuality: 100,     // 0-100, where 99 and below are lossy (default is 100)
    keepAlpha: false,       // Stores the original RGB data with 0 alpha (transparent) (default is false)
    crc: true,              // Set to false to skip verifying/adding CRC (default is true)
    keepMetaData: true,     // Set to false to strip EXIF/XMP metadata (default is true)
    keepColorProfile: true, // Set to false to strip ICC color profile (default is true)
    keepPalette: false,     // Set to true to keep the existing PNG pallete. (default is false)
    frameDelay: [100],      // Animation frame delay in ms. Array of number(s). (default is [100] which applies to all frames)
    // Advanced optional encoding parameters
    maxPaletteSize: 512,    // Max number of colors to store in a FLIF palette. PNG/GIF use 256. (FLIF default is 512)
    colorBuckets: 'auto',   // true, false, or 'auto' (default is 'auto')
    channelCompact: true,   // true or false (default is true)
    ycocg: true,            // false will disable YCoCg transform and use G(R-G)(B-G) (default is true)
    subtractGreen: true,    // false will disable YCoCg and SubtractGreen transform and use GRB (default is true)
    frameShape: true,       // false will disable Frame_Shape transform (default is true)
    maxFrameLookBack: 1,    // Max number of frames for Frame_Lookback (allows -1-256, default is 1)
    maniacRepeats: 2,       // MANIAC learning iterations; (default is 2)
    maniacThreshold: 64,    // MANIAC tree growth split threshold, in bits saved (default is 64)
    maniacDivisor: 30,      // MANIAC inner node count divisor (allows 1-268435455, default is 30)
    maniacMinSize: 50,      // MANIAC post-pruning threshold; (min allowed: 0, default is 50)
    chanceCutoff: 2,        // Minimum chance, 0-4096 (allows 1-128, default is 2)
    chanceAlpha: 19,        // Chance decay factor (allows 2-128, default is 19)
    adaptive: false,        // true will apply an adaptive lossy encoding, 2nd input image is saliency map (default is false)
    guess: {                // Pixel predictor for each plane (Y, Co, Cg, Alpha, Lookback)
        y: 'heuristically', // 'average', 'median gradient', 'median number', 'mixed', default is 'heuristically'
        co: 'heuristically',
        cg: 'heuristically',
        alpha: 'heuristically',
        lookback: 'heuristically'
    },
    alphaGuess: 'average',  // Predictor for invisible pixels (only if keepAlpha is false)
                            // `'average'`, `'median gradient'`, `'median neighbors'` (Default is to set keepAlpha to true)
    chromaSubsample: false  // true to write an incomplete 4:2:0 chroma subsampled lossy FLIF file (default is false)
};

// By default encode is asynchronous, and can accept an optional callback.
// If you set the async param to false and pass in a callback it will be ignored.
nodeFLIF.encode(encodeParams, function (data) {
    console.log('Encode finished.');
    if (data) {
        console.log(data);
    }
});
```

A note on `keepPalette`; by default, we read PNG images as 24-bit RGB or 32-bit RGBA. node-flif will automatically use a palette if the number of colors turns out to be low (doesn't matter if the original PNG is PNG8 or PNG24/32). The order the colors are stored in the FLIF palette is not related to the PNG8 palette order. By default it sorts on luma, the first component of YCoCg. The option `keepPalette: true` makes it read/write PNG8, and preserve the palette order. The FLIF format itself supports any palette order (though sorted on luma is slightly more compact to encode), and it supports more than 256 colors too. The main advantage of `keepPalette: true` is that you get full control over the palette order, and also a better memory footprint (because everything stays at 8-bit per pixel, no intermediate representation as 24-bit / 32-bit RGBA).

* * *

### Decode

Convert your image **from** a FLIF.

```js
var nodeFLIF = require('node-flif');

var decodeParams = {
    // Required decoding parameters
    input: '/path/to/input-file.flif',  // Must end in .flif
    output: '/path/to/output-file.png', // Must end in one of these: .png, .pnm, .ppm, .pgm, .pbm, .pam
    // Common optional decoding parameters
    async: true,            // Set to false to run this as a synchronous decoding
    overwrite: false,       // Set to true to overwrite existing files on output (default is false)
    decodeQuality: 100,     // 0-100 Lossy decode quality (default is 100)
    keepMetaData: true,     // Set to false to strip EXIF/XMP metadata (default is true)
    keepColorProfile: true, // Set to false to strip ICC color profile (default is true)
    // Advanced optional decoding parameters
    crc: true,              // Set to false to skip verifying/adding CRC (default is true)
    keepPalette: false,     // Set to true to keep the existing PNG pallete. (default is false)
    scale: 1,               // Lossy downscaled image at scale 1:N (2,4,8,16,32) (default 1)
    resize: {               // Lossy downscaled image to fit inside given Width/Height (default uses input dimensions)
        width: 200,
        height: 400
    },
    fit: {                  // Lossy downscaled image to exactly the given Width/Height (default uses input dimensions)
        width: 200,
        height: 400
    }
};

// By default encode is asynchronous, and can accept an optional callback.
// If you set the async param to false and pass in a callback it will be ignored.
nodeFLIF.decode(decodeParams, function (data) {
    console.log('Decode finished.');
    if (data) {
        console.log(data);
    }
});
```

* * *

### Transcode

Create a new FLIF from an existing FLIF with new settings.

Accepts all the same parameters as Encode and Decode (combined).

```js
var nodeFLIF = require('node-flif');

var transcodeParams = {
    // Required transcoding parameters
    input: '/path/to/input-file.flif',   // Must end in .flif
    output: '/path/to/output-file.flif', // Must end in .flif
    // All encoding and decoding parameters are accepted
};

// By default encode is asynchronous, and can accept an optional callback.
// If you set the async param to false and pass in a callback it will be ignored.
nodeFLIF.transcode(transcodeParams, function (data) {
    console.log('Transcode finished.');
    if (data) {
        console.log(data);
    }
});
```

* * *

### Identify

Identify is a **synchronous** command that will return an `object` containing the name, dimensions, color, size, and interlace data about the image.

```js
var nodeFLIF = require('node-flif');

var pizzaData = nodeFLIF.identify('./images/pizza.flif');

console.log(pizzaData);
```

The above snippet will console log out an object similar to this:

```js
{
    file: 'images/pizza.flif',
    dimensions: '768x512',
    color: '8-bit RGB',
    interlace: 'interlaced',
    size: 475578
}
```

* * *

### Executable Path

Returns a string of the internal path to the flif executable specific to your OS (win32/linux/darwin) and architecture (x86/x64).

**Design rationale:** It is assumed that there will be some people who just want a copy of the built executable for their system to use a CLI instead of using the Node wrapper.

```js
var path = require('path');
var nodeFLIF = require('node-flif');

// 'executables\\win32\\flif.exe'
var internalFlifPath = nodeFLIF.executablePath;

// 'C:\\projects\\your-site\\node_modules\\node-flif\\executables\\win32\\flif.exe'
var flifFullPath = path.join(process.cwd(), 'node_modules', 'node-flif', nodeFLIF.executablePath);
```

* * *

### Breakpoints

Gives you information about the breakpoints in an image to allow for truncating the file at different points. The breakpoints, or "truncation offsets", are for truncations at scales 1:8, 1:4, 1:2. This function runs **synchronously**. Non-interlaced flifs will return an empty object.

```js
var nodeFLIF = require('node-flif');

var pizzaBreakpoints = nodeFLIF.breakpoints('./images/pizza.flif');

console.log(pizzaBreakpoints);
```

The above snippet will console log out an object similar to this:

```js
{
    offsetStart: 11,
    eighth: 8080,
    fourth: 24900,
    half: 90422
}
```

For non-interlaced flifs, you will get an empty object back. You can also detect if an image is interlaced or not by using `nodeFLIF.identify`.

```js
{}
```

* * *

### Version

Returns the version of node-flif and the FLIF executable as an object.

```js
var nodeFLIF = require('node-flif');

var nodeFLIFVersions = nodeFLIF.versions; // { nodeFLIF: '0.2.0', flif: '0.3.0' }
var nodeFLIFVersion = nodeFLIF.version.nodeFLIF; // '0.2.0'
var flifVersion = nodeFLIF.version.flif // '0.3.0'
```

Here is a table of each version of Node-FLIF and the corresponding version of FLIF that shipped with it.

node-flif | flif  | flif-wasm
:--       | :--   | :--
1.0.1     | 0.3.0 | 1.0.7
1.0.0     | 0.3.0 | 1.0.7
0.2.0     | 0.3.0 | 1.0.3
0.1.0     | 0.3.0 | N/A

* * *

# Documentation Table

Conversion                | Parameter        | Default           | Type                       | Allowed                                                                                              | Description
:--                       | :--              | :--               | :--                        | :--                                                                                                  | :--
Transcode                 | input            | N/A               | string                     | String must be a valid path ending in `.flif`                                                        | Path to location of FLIF file
Decode                    | input            | N/A               | string                     | String must be a valid path ending in `.flif`                                                        | Path to location of FLIF file
Encode                    | input            | N/A               | string or array of strings | Strings can be any valid path ending in one of these: `.png`, `.pnm`, `.ppm`, `.pgm`, `.pbm`, `.pam` | Array of input files for frames, or a single string that is the path to the file
Transcode                 | output           | N/A               | string                     | String must be a valid path ending in `.flif`                                                        | Path to the location of where the output file should be created
Decode                    | output           | N/A               | array of strings           | Strings can be any valid path ending in one of these: `.png`, `.pnm`, `.ppm`, `.pgm`, `.pbm`, `.pam` | Path to the location of where the output file should be created
Encode                    | output           | N/A               | string                     | String must be a valid path ending in `.flif`                                                        | Path to the location of where the output file should be created
Transcode, Decode, Encode | async            | `true`            | boolean                    | `true`, `false`                                                                                      | Set to false to run as a synchronous encoding
Transcode, Decode, Encode | overwrite        | `false`           | boolean                    | `true`, `false`                                                                                      | Set to true to overwrite existing files on output
Transcode, Decode, Encode | crc              | `true`            | boolean                    | `true`, `false`                                                                                      | Set to false to skip verifying/adding CRC
Transcode, Decode, Encode | keepMetaData     | `true`            | boolean                    | `true`, `false`                                                                                      | Set to false to strip EXIF/XMP metadata
Transcode, Decode, Encode | keepColorProfile | `true`            | boolean                    | `true`, `false`                                                                                      | Set to false to strip ICC color profile
Transcode, Decode, Encode | keepPalette      | `false`           | boolean                    | `true`, `false`                                                                                      | Set to true to keep the existing PNG pallete.
Transcode, Decode         | scale            | `1`               | number                     | `1`, `2`, `4`, `8`, `16`, `32`                                                                       | Lossy downscaled image at scale 1:N
Transcode, Decode         | resize           | N/A               | object                     | Object must contain the keys `width` and `height`, their pairs must be whole numbers greater than 0  | Lossy downscaled image to fit inside given Width/Height
Transcode, Decode         | fit              | N/A               | object                     | Object must contain the keys `width` and `height`, their pairs must be whole numbers greater than 0  | Lossy downscaled image to fit exactly the given Width/Height
Transcode, Decode         | decodeQuality    | `100`             | number                     | Min: `0`, Max: `100`                                                                                 | 99 and below are lossy
Transcode,         Encode | encodeQuality    | `100`             | number                     | Min: `0`, Max: `100`                                                                                 | 99 and below are lossy
Transcode,         Encode | effort           | `60`              | number                     | Min: `0`, Max: `100`                                                                                 | 0 = fast/poor compression, 100 = slowest/best?
Transcode,         Encode | interlace        | `'auto'`          | boolean, 'auto'            | `true`, `false`, or `'auto'`                                                                         | Enable or disable interlacing. Auto will enable except on tiny images
Transcode,         Encode | keepAlpha        | `false`           | boolean                    | `true`, `false`                                                                                      | Stores the original RGB data with 0 alpha (transparent)
Transcode,         Encode | frameDelay       | `[100]`           | array of numbers           | Numbers Min: `0`, Numbers Max `60000`. Amount of frames is limited by available memory, not a number | Animation frame delay in ms. Array of number(s). (default is [100] which applies to all frames)
Transcode,         Encode | maxPaletteSize   | `512`             | number                     | Min: `-32000`, Max: `32000`                                                                          | Max number of colors to store in a FLIF palette. PNG/GIF use `256`. FLIF default is `512`. `0` will disable palette. Simple FLIF decoders (8-bit only) cannot palettes over `512`.
Transcode,         Encode | colorBuckets     | `'auto'`          | boolean, 'auto'            | `true`, `false`, or `'auto'`                                                                         | Disable Color_Buckets transform
Transcode,         Encode | channelCompact   | `true`            | boolean                    | `true`, `false`                                                                                      | Disable Channel_Compact transform
Transcode,         Encode | ycocg            | `true`            | boolean                    | `true`, `false`                                                                                      | False will disable YCoCg transform and use G(R-G)(B-G)
Transcode,         Encode | subtractGreen    | `true`            | boolean                    | `true`, `false`                                                                                      | False will disable YCoCg and SubtractGreen transform and use GRB
Transcode,         Encode | frameShape       | `true`            | boolean                    | `true`, `false`                                                                                      | False will disable Frame_Shape transform
Transcode,         Encode | maxFrameLookBack | `1`               | number                     | Min: `-1`, Max: `256`                                                                                | Max number of frames for Frame_Lookback
Transcode,         Encode | maniacRepeats    | `2`               | number                     | Min: `0`, Max: `20`                                                                                  | MANIAC learning iterations
Transcode,         Encode | maniacThreshold  | `64`              | number                     | Min: `4`, Max: `100000`                                                                              | MANIAC tree growth split threshold, in bits saved
Transcode,         Encode | maniacDivisor    | `30`              | number                     | Min: `1`, Max: `268435455`                                                                           | MANIAC inner node count divisor
Transcode,         Encode | maniacMinSize    | `50`              | number                     | Min: `0`, No Max                                                                                     | MANIAC post-pruning threshold
Transcode,         Encode | chanceCutoff     | `2`               | number                     | Min: `1`, Max: `128`                                                                                 | Minimum chance, 0-4096
Transcode,         Encode | chanceAlpha      | `19`              | number                     | Min: `2`, Max: `128`                                                                                 | Chance decay factor
Transcode,         Encode | guess            | `{}`              | object                     | Object can contain any sub-parameter of `y`, `co`, `cg`, `alpha`, or `lookback`. All are optional.   | Object containing the pixel predictors for each plane (Y, Co, Cg, Alpha, Lookback)
Transcode,         Encode | guess.y          | `'heuristically'` | string                     | `'average'`, `'median gradient'`, `'median number'`, `'mixed'`, or `'heuristically'`                 | Pixel predictor for Y
Transcode,         Encode | guess.co         | `'heuristically'` | string                     | `'average'`, `'median gradient'`, `'median number'`, `'mixed'`, or `'heuristically'`                 | Pixel predictor for Co
Transcode,         Encode | guess.cg         | `'heuristically'` | string                     | `'average'`, `'median gradient'`, `'median number'`, `'mixed'`, or `'heuristically'`                 | Pixel predictor for Cg
Transcode,         Encode | guess.alpha      | `'heuristically'` | string                     | `'average'`, `'median gradient'`, `'median number'`, `'mixed'`, or `'heuristically'`                 | Pixel predictor for Alpha
Transcode,         Encode | guess.lookback   | `'heuristically'` | string                     | `'average'`, `'median gradient'`, `'median number'`, `'mixed'`, or `'heuristically'`                 | Pixel predictor for Lookback
Transcode,         Encode | alphaGuess       | keepAlpha: `true` | string                     | `'average'`, `'median gradient'`, `'median neighbors'`                                               | Predictor for invisible pixels (only if keepAlpha is false). Has no default, as default is to keep the original alpha values.
Transcode,         Encode | chromaSubsample  | `false`           | boolean                    | `true`, `false`                                                                                      | True to write an incomplete 4:2:0 chroma subsampled lossy FLIF file
Encode                    | adaptive         | N/A               | string                     | String must be a valid path ending in one of these: `.png`, `.pnm`, `.ppm`, `.pgm`, `.pbm`, `.pam`   | Uses image path as saliency map to apply an adaptive lossy encoding. Must use encodeQuality < 100 and only one input image

* * *

## TO-DO List

* [ ] Add in more multi-arg tests for encode/decode/transcode
* [ ] Create automated end-to-end testing folder that verifies tests
* [ ] Add it to the npm registry when at v1.0.0.
 * Wait for npm registry to allow for private emails or publishing without email verification
