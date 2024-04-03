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
  parsedInformation.batteryPercentage = loraWANV2DataFormat(bytes2HexString(bytes.slice(1,2)), 1000);
  
  return parsedInformation; 
}

function parseSenseCapWeatherSensor(bytes) {
  var decodedPacket = {};
  decodedPacket.temperature = loraWANV2DataFormat(bytes2HexString(bytes.slice(3, 7)), 1000); // Byte 4-7
  decodedPacket.humidity = loraWANV2DataFormat(bytes2HexString(bytes.slice(7, 11)), 1000); // Byte 8-11

  barometricPressureMSB = loraWANV2DataFormat(bytes2HexString(bytes.slice(13, 17)), 1000); // Byte 14-17
  barometricPressureLSB = loraWANV2DataFormat(bytes2HexString(bytes.slice(17, 21)), 1000); // Byte 18-21
  decodedPacket.barometricPressure = barometricPressureMSB * 65536 + barometricPressureLSB; // Equivalent to barometricPressureMSB << 16
  
  lightIntensityMSB = loraWANV2DataFormat(bytes2HexString(bytes.slice(24, 28)), 1000); // Byte 25-28
  lightIntensityLSB = loraWANV2DataFormat(bytes2HexString(bytes.slice(28, 32)), 1000); // Byte 29-32
  decodedPacket.lightIntensity = ((lightIntensityMSB * 65536)+lightIntensityLSB) * 0.001; // Equivalent to lightIntensityMSB << 16
  
  return decodedPacket;
}

function bytes2HexString (arrBytes) {
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
// - data = Object representing the payload that must be encoded (hexadecimal string).
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.
function encodeDownlink(input) {
  // Convert hexadecimal string to byte array
  const hexString = input.data.replace(/\s/g, ''); // Remove whitespace
  const byteLength = hexString.length / 2; // Each byte consists of 2 characters in hexadecimal
  const bytes = new Uint8Array(byteLength);

  for (let i = 0; i < byteLength; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }

  return {
    bytes: bytes
  };
}