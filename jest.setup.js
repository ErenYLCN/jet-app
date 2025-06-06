const { TextEncoder, TextDecoder } = require("util");

// Set up TextEncoder and TextDecoder globals which are used by React Router and other packages
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
