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
      case "sensecapweathersensor":
        decodedObject.decodedMeasurements = parseSenseCapWeatherSensor(bytes);
        break
    }
  }
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

function parseSenseCapWeatherSensor(bytes) {
  var decodedPacket = {};
  decodedPacket.temperature = loraWANV2DataFormat(bytes.substring(3, 7), 1000); // Byte 4-7
  decodedPacket.humidity = loraWANV2DataFormat(bytes.substring(7, 11), 1000); // Byte 8-11

  barometricPressureMSB = loraWANV2DataFormat(bytes.substring(13, 17), 1000); // Byte 14-17
  barometricPressureLSB = loraWANV2DataFormat(bytes.substring(17, 21), 1000); // Byte 18-21
  decodedPacket.barometricPressure = barometricPressureMSB * 65536 + barometricPressureLSB; // Equivalent to barometricPressureMSB << 16
  
  lightIntensityMSB = loraWANV2DataFormat(bytes.substring(24, 28), 1000); // Byte 25-28
  lightIntensityLSB = loraWANV2DataFormat(bytes.substring(28, 32), 1000); // Byte 29-32
  decodedPacket.lightIntensity = ((lightIntensityMSB * 65536)+lightIntensityLSB) * 0.001; // Equivalent to lightIntensityMSB << 16
  
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

/**
 *
 * data formatting
 * @param str
 * @param divisor
 * @returns {string|number}
 */
function loraWANV2DataFormat (str, divisor = 1) {
  let strReverse = bigEndianTransform(str)
  let str2 = toBinary(strReverse)
  if (str2.substring(0, 1) === '1') {
      let arr = str2.split('')
      let reverseArr = arr.map((item) => {
          if (parseInt(item) === 1) {
              return 0
          } else {
              return 1
          }
      })
      str2 = parseInt(reverseArr.join(''), 2) + 1
      return '-' + str2 / divisor
  }
  return parseInt(str2, 2) / divisor
}

/**
 * Handling big-endian data formats
 * @param data
 * @returns {*[]}
 */
function bigEndianTransform (data) {
  let dataArray = []
  for (let i = 0; i < data.length; i += 2) {
      dataArray.push(data.substring(i, i + 2))
  }
  // array of hex
  return dataArray
}

/**
 * Convert to an 8-digit binary number with 0s in front of the number
 * @param arr
 * @returns {string}
 */
function toBinary (arr) {
  let binaryData = arr.map((item) => {
      let data = parseInt(item, 16)
          .toString(2)
      let dataLength = data.length
      if (data.length !== 8) {
          for (let i = 0; i < 8 - dataLength; i++) {
              data = `0` + data
          }
      }
      return data
  })
  let ret = binaryData.toString()
      .replace(/,/g, '')
  return ret
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