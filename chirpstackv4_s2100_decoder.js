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
  var nodeType = input.variables.nodeType;
  var isBatteryPacket = determineBatteryPacket(bytes)

  if (isBatteryPacket){
    decodedObject.batteryInformation = parseBatteryPacket(bytes);
  } else {
    switch (nodeType){
      case 31:
        decodedObject.decodedMeasurements = parseSinglePacket(bytes);
        break
      case "sensecapweathersensor":
        decodedObject.decodedMeasurements = parseSenseCapWeatherSensor(bytes);
        break
      case 39:
        decodedObject.batteryInformation = parseBatteryPacket(bytes);
        break
    }
  }
  
  decodedObject.payload = input2HexString(bytes);
  return {
      data: decodedObject
    };
}
  
function determineBatteryPacket(bytes){
  var isBatteryPacket = false;
  if (bytes[0] != 0x39){
    return isBatteryPacket;
  } else {
    isBatteryPacket = true;
    return isBatteryPacket;
  }
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
  decodedPacket.measurement1 = parseInt(input2HexString(bytes.slice(3, 7)), 16); // Byte 4-7
  decodedPacket.measurement2 = parseInt(input2HexString(bytes.slice(7)), 16); // Byte 8-11
  
  return decodedPacket;
}

function parseSenseCapWeatherSensor(bytes) {
  var decodedPacket = {};
  decodedPacket.temperature = parseInt(input2HexString(bytes.slice(3, 7)), 16) / 1000; // Byte 4-7
  decodedPacket.humidity = parseInt(input2HexString(bytes.slice(7, 11)), 16) / 1000; // Byte 8-11
  decodedPacket.barometricPressureMSB = parseInt(input2HexString(bytes.slice(13, 17)), 16) / 1000; // Byte 14-17
  decodedPacket.barometricPressureLSB = parseInt(input2HexString(bytes.slice(17, 21)), 16) / 1000; // Byte 18-21
  decodedPacket.lightIntensityMSB = parseInt(input2HexString(bytes.slice(24, 28)), 16) / 1000; // Byte 25-28
  decodedPacket.lightIntensityLSB = parseInt(input2HexString(bytes.slice(28, 32)), 16) / 1000; // Byte 29-32
  return decodedPacket;
}

function input2HexString(arrBytes) {
  // Convert bytes to hexadecimal string representation
  const hexArray = arrBytes.map(byte => {
      // Handle negative values using two's complement
      if (byte < 0) {
          // Convert to two's complement representation
          byte = 256 + byte;
      }
      return byte.toString(16);
  });

  // Join hexadecimal values with no separator
  return hexArray.join('');
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