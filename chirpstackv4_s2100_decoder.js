function input2HexString (arrBytes) {
  var str = ''
  for (var i = 0; i < arrBytes.length; i++) {
      var tmp
      var num = arrBytes[i]
      if (num < 0) {
          tmp = (255 + num + 1).toString(16)
      } else {
          tmp = num.toString(16)
      }
      if (tmp.length === 1) {
          tmp = '0' + tmp
      }
      str += tmp
  }
  return str
}

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
  parsedInformation.batteryLevel = parseInt(input2HexString(bytes[1]), 16); // Byte 2
  parsedInformation.softwareVersion = toString(parseInt(input2HexString(bytes[2]), 16))+"."+toString(parseInt(input2HexString(bytes[3]), 16)); // Bytes 3 and 4
  parsedInformation.hardwareVersion = toString(parseInt(input2HexString(bytes[4]), 16))+"."+toString(input2HexString(parseInt(bytes[5]), 16)); // Bytes 5 and 6
  parsedInformation.measurementInterval = parseInt(input2HexString(bytes.slice(6,8)), 16); // Bytes 7 and 8 
  parsedInformation.reservedValue = parseInt(input2HexString(bytes.slice(8)), 16); //Bytes 9 and 10
  
  return parsedInformation; 
}

function parseSinglePacket(bytes) {
  var decodedPacket = {};
  decodedPacket.measurement1 = parseInt(input2HexString(bytes.slice(3,7)), 16);
  decodedPacket.measurement2 = parseInt(input2HexString(bytes.slice(7)), 16);
  
  return decodedPacket;
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
      decodedObject.decodedMeasurements = parseSinglePacket(bytes);
    case 30:
    case 39:
      decodedObject.batteryInformation = parseBatteryPacket(bytes);
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
  