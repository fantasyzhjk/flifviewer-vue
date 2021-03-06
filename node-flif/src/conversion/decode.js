/* eslint-disable no-console */
/* eslint-disable no-regex-spaces */

/**
 * Converts JSON params for decoding into CLI arguments
 * @param  {object}  params       Parameters for the decoding passed in by the user.
 * @param  {boolean} skipWarnings If true, then helpful warning messages will not be displayed.
 * @return {string}               The built args to be sent to the command line.
 */
function buildDecodeArgs (params, skipWarnings) {
    var commonEncodeDecode = require('./argumentGroups/commonEncodeDecode.js');
    var commonDecode = require('./argumentGroups/commonDecode.js');
    var verifyParams = require('../helpers/verifyParams.js');

    var paramsWereVerified = verifyParams(params, 'decode', skipWarnings);
    if (!paramsWereVerified) {
        return false;
    }

    var input = params.input;
    var output = params.output;
    var options = [
        commonEncodeDecode(params),
        commonDecode(params)
    ].join(' ');

    // -d -c -m -p -o -k -q=100 -s=2 -r=100x100 -f=100x100 "input file.flif" "output file.png"
    var args = '-d ' + options + ' "' + input + '" "' + output + '"';
    // -d -c -m        -s=2   -f=100x100 "a.flif" "b.flif" ==> -d -c -m -s=2 -f=100x100 "a.flif" "b.flif"
    args = args.replace(/  +/g, ' ');
    args = args.trim();

    return args;
}

module.exports = buildDecodeArgs;
