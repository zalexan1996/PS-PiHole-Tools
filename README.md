# PS-PiHole-Tools
 A PowerShell module for managing PiHole. Includes a custom JS RestAPI to be configured on the Raspberry Pi because I couldn't get PS Remoting to work on arm32 architecture.

# Configuration
1. Install PiHole on a Raspberry Pi
2. Put api.js and start-api.sh in a folder on the Pi, mine is in /opt/pihole/api
3. Create a file in the same directly as api.js called `apikeys.list` and put a string you want to use for your API key (this authentication method will be replaced in later versions)
4. Start the RestAPI server by running `start-api.sh` on the Pi
5. Once the RestAPI server is listening on the Pi, you can run the PowerShell cmdlets.
