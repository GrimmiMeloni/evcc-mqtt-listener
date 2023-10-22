# evcc MQTT Listener for Tesla Powerwall

This project listens to evcc state updates via MQTT, to control the discharge of a Tesla Powerwall.
The powerwall is swichted between two "logical" modes BACKUP_ONLY and STANDBY (normal operations).
To achieve this behavior the backup reserve percentage of the PW is controlled. BACKUP only mode
simply means setting the reserve percentage to 100%, effectively preventing any discharge (unless grid fails).
STANDBY mode is achieved by resetting the reserve percentage to a configured default value of your installation.
Usually this value is configured via the slider in the Tesla App.

## decision logic 
- as long as evcc is not charging, put Powerwall in Standby
- If evcc is charging, check the charge mode.
- If charge mode is fast put PW into BACKUP only mode.
- Alternatively, if charge mode is PV and at the same time the planner is active, also put PW into BACKUP only mode  

## Limitations
- only supports a single loadpoint
- overwrites backup reserve percentages set via the Tesla App

## Configuration
You need to create a configuration, an example template can be found in the `config` folder.
At a minimum you need to adjust the `mqtt.broker.url`, and you need to provide an oauth refresh token for your Tesla account (in `tesla.refreshToken`).
Optionally, you may also want to adjust the `tesla.backupReservePercent` to match your current settings in the Tesla App.
The configuration file needs to be mounted into the container as `/usr/src/app/config/default.json`.

## Running
The docker image can be used in a compose file (e.g. together with evcc) as shown below.

```
  evcc-mqtt-listener:
    container_name: evcc-mqtt-listener
    image: ghcr.io/grimmimeloni/evcc-mqtt-listener:main
    volumes:
      - ./evcc-mqtt-config/default.json:/usr/src/app/config/default.json
    restart: unless-stopped
```