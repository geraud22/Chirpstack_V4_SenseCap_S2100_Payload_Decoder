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
  var batteryLevel = bytes[1]; // Byte 2
  var softwaresubset = bytes.slice(2,4); // Bytes 3 and 4
  var hardwaresubset = bytes.slice(4, 6); // Bytes 5 and 6
  var measurementInterval = bytes.slice(6,8); // Bytes 7 and 8 
  var reserved = bytes.slice(8); // Bytes 9 and 10
  parsedInformation.batteryLevel = batteryLevel
  parsedInformation.softwareVersion = toString(parseInt(softwaresubset[0], 16))+"."+toString(parseInt(softwaresubset[1], 16));
  parsedInformation.hardwareVersion = toString(parseInt(hardwaresubset[0], 16))+"."+toString(parseInt(hardwaresubset[1], 16));
  parsedInformation.measurementInterval = parseInt(measurementInterval, 16);
  parsedInformation.reservedValue = parseInt(reserved, 16);
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
  var decoded_object = {};
  var bytes = input.bytes;
  var packetType = determinePacketType(bytes)

  switch (packetType){
    case 31:
    case 30:
    case 39:
      decoded_object.batteryInformation = parseBatteryPacket(bytes);
  }
  
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
  