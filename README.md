# evcc MQTT Listener for Tesla Powerwall

This project listens to evcc state updates via MQTT, to control the discharge of a Tesla Powerwall.
The powerwall is swichted between two "logical" modes BACKUP_ONLY and STANDBY (normal operations).
To achieve this behavior the backup reserve percentage of the PW is controlled. BACKUP only mode
simply means setting the reserve percentage to 100%, effectively preventing any discharge (unless grid fails).
STANDBY mode is achieved by resetting the reserve percentage a configured default value of your installation.
Usually this value is configured via the slider in the Tesla App.

## decision logic 
- as long as evcc is not in charging, put Powerwall in Standby
- If evcc is charging, check the charge mode.
- If charge mode is fast put PW into BACKUP only mode
- Alternatively, if charge mode is PV and at the same time the planner is active, also put PW into BACKUP only mode  

## Limitations
- only supports a single loadpoint

## configuration
You need to create a configuration, an example template can be found in the `config` folder.
At a minimum you need to adjust the mqtt broker's url, and you need to provide an oauth refresh token for your Tesla account.
