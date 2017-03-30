# iLife Controller for Homebridge

Homebridge is a lightweight NodeJS server you can run on your home network that emulates the iOS HomeKit API. [Learn more about Homebridge](https://github.com/nfarina/homebridge)

This is a plugin to control your iLife Controller via HomeKit. [Learn more about iLife Robotic Vacuums.](http://iliferobot.com)
Since Siri supports devices added through HomeKit, this means that with Homebridge you can ask Siri to control your Thinking Cleaner! For example you can say _`Siri, turn Dusty on.`_ and your Roomba will start cleaning!

Or you can use a Homekit app for iOS to create scenes and start claning your house when you say:

 * _Siri, I'm leaving._

The possibilities are endless!

# Installation

### Homebridge
If you haven't installed Homebridge yet, use these steps on the Homebridge page to get it up and running: [Learn more about the Homebridge installation](https://github.com/nfarina/homebridge)

### iLife Controller plugin

First of all we are going to install the iLife Controller plugin by executing:

    sudo npm install -g homebridge-ilifecontroller

As easy as that! Now let's configure the plugin.

# Configuration

**We expect you have created a `config.json` already using the steps on the [Homebridge](https://github.com/nfarina/homebridge) page**

Now we are going to add the iLife Controller accessory to the `config.json` file. In the `config.json` add the following to the `accessories` section:

```JSON
{
    "accessory": "Roomba",
    "name": "Dusty",
    "ip_address": "127.0.0.1",
	"dock_on_stop": "true"
}
```

For example:
 ```JSON
"accessories": [
    {
        "accessory": "Roomba",
        "name": "Dusty",
        "ip_address": "127.0.0.1",
        "username": "",
        "password": "",
		"dock_on_stop": "true"
    }
]
```

Replace `Dusty` with the name you gave your iLife Controller during setup. (You don't necessarily have to enter the same name as you entered during setup, but it's recommended). *_This is also the name Siri will use for control_*

If you do not know the IP address of your Thinking Cleaner, simply leave it blank and your iLife Controller will be discovered automatically.
**NOTE**: When you have multiple iLife Controller devices, you **must** fill in the IP address

If you want to disable docking when you stop (or 'turn off' your Roomba using Siri/HomeKit) change `dock_on_stop` to `false`. When you do so, your Roomba will just stay at the location where it currently is when you stop it.

# Using

Now you should be able to run Homebridge again and the iLife Controller plugin ready for usage:

    $ homebridge
    Loaded plugin: homebridge-ilifecontroller
    Registering accessory 'homebridge-ilifecontroller.Roomba'
    ---
    Loaded config.json with 1 accessories and 0 platforms.
    ---
    Loading 0 platforms...
    Loading 1 accessories...
    [Dusty] Initializing Roomba accessory...

Homebridge is now ready to receive commands to control your iLife Controller via HomeKit!

**Siri note**: The way I added the iLife Controller to HomeKit is by pretending the iLife Controller is a switch: turn on to start cleaning and turn off to stop and dock. Note that you can't say _`Siri, start cleaning.`_ as HomeKit doesn't support (robot) vacuum cleaners (yet)

# License
The MIT License (MIT)

Copyright (c) 2016 Matthijs Logemann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- Roomba is a trademark of iRobot Corporation
- iLife Controller is a product of Thinking Bits BV
