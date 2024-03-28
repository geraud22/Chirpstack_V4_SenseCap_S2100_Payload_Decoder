function determinePacketType(bytes){
  var packetType = 0;
  if (bytes[0] == 0x31) {
    packetType = 31;
  } else if (bytes[0] == 0x30) {
    packetType = 30;
  } else if (bytes[0] == 0x39) {
    packetType = 39;
  } else {
    packetType = 0;
  }
  return packetType;
}

// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
  var bytes = input.bytes;
  var packetType = determinePacketType(bytes)
  
  return {
      data: {
        // temp: 22.5
      }
    };
  }
  
  // Encode downlink function.
  //
  // Input is an object with the following fields:
  // - data = Object representing the payload that must be encoded.
  // - variables = Object containing the configured device variables.
  //
  // Output must be an object with the following fields:
  // - bytes = Byte array containing the downlink payload.
  function encodeDownlink(input) {
    return {
      bytes: [225, 230, 255, 0]
    };
  }
  