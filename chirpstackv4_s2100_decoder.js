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

function parseBatteryPacket(bytes) {
  var parsedInformation = {}; 
  parsedInformation.batteryLevel = parseInt(bytes[1], 16); // Byte 2
  parsedInformation.softwareVersion = toString(parseInt(bytes[2], 16))+"."+toString(parseInt(bytes[3], 16)); // Bytes 3 and 4
  parsedInformation.hardwareVersion = toString(parseInt(bytes[4], 16))+"."+toString(parseInt(bytes[5], 16)); // Bytes 5 and 6
  parsedInformation.measurementInterval = parseInt(bytes.slice(6,8), 16); // Bytes 7 and 8 
  parsedInformation.reservedValue = parseInt(bytes.slice(8), 16); //Bytes 9 and 10
  
  return parsedInformation; 
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
  var decodedObject = {};
  var bytes = input.bytes;
  var packetType = determinePacketType(bytes)

  switch (packetType){
    case 31:
    case 30:
    case 39:
      decoded_object.batteryInformation = parseBatteryPacket(bytes);
  }
  
  return {
      data: decodedObject
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
  