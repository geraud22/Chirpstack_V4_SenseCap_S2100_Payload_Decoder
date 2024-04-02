This repository contains custom Decoder Logic specifically for:
    Chirpstack V4
    &&
    SenseCap S2100 DataLogger
    &&
    SenseCap Orch S4 WeatherSensor

Custom Logic was desired due to data pre-processing requirements in order to obtain desired measurements from an Orch S4 WeatherSensor, namely Barometric Pressure and LightIntensity. Refer to [SenseCap ORCH S4 - User Guide](https://files.seeedstudio.com/products/101990661/doc/SenseCAP%20ORCH%20S4%20-%20User%20Guide%20v1.1.pdf) (Page 8).
The general purpose decoder that can be found at [Seeed-Solution / TTN-Payload-Decoder](https://github.com/Seeed-Solution/TTN-Payload-Decoder) works well enough to obtain decoded measurement values, but was deemed too complex in how it is written, to ammend and include desired custom logic.
The result is this decoder which is highly specific about what it is decoding, with the intention of easier data pre-processing.
This decoder is not deemed as "scalable" due to its lack of general purpose decoding logic which would apply to the wide array of possible end-nodes that can be attached to an S2100 Data Logger.
However, it is built to serve the purpose of data pre-processing in specific use cases.

What follows is an algorithm on how you might edit this decoder to suit your needs.
1 - Assign a "nodeType" Variable to your device on Chirpstack V4 Web UI. (Applications/YOUR_APPLICATION/Devices/YOUR_DEVICE/Configuration)
2 - Add a new "case" to the existing Switch Statement within the decodeUplink() function.
        The "case" should correspond to a string representation of whatever the value of your "nodeType" variable is on Chirpstack V4.
3 - Create a function that processes the payload as you intend, related to your specific end-node.
4. Call the function from within the new "case".

*Please Note: S2100 Packet Parsing Logic - sourced from [SenseCap S2100 LoRaWAN Data Logger User Guide](https://files.seeedstudio.com/products/SenseCAP/S2100/SenseCAP%20S2100%20LoRaWAN%20Data%20Logger%20User%20Guide.pdf) (Page 51).