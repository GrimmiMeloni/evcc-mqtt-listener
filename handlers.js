const { logger } = require('./logger.js');

const MODE = {
    MODE_OFF: 'off',
    MODE_PV: 'pv',
    MODE_MINPV: 'minPv',
    MODE_NOW: 'now'
}

const CHARGE_STATE = {
    CHARGING: 'charging',
    IDLE: 'idle',
};

const BATTERY_STATE = {
    STANDBY: 'standby',
    BACKUP: 'backup'
}

class Handler {

    constructor() {
        this.currentChargeMode = 'UNKNOWN';
        this.currentChargeState = 'UNKNOWN';
        this.currentBatteryState = 'UNKNOWN';
    }

    toString() {
        return 'currentChargeMode: %s, currentChargeState: %s, currentBatteryState: %s', this.currentChargeMode, this.currentChargeState, this.currentBatteryState;
    }

    setChargeMode(newMode) {
        if (this.currentChargeMode == newMode) {
            logger.debug("skipping chargemode update, mode stays at %s", this.currentChargeMode);
            return; //NoOp
        }

        logger.info("updating chargemode from %s to %s", this.currentChargeMode, newMode);
        this.currentChargeMode = newMode;

        this.update();
    }

    setChargeState(newState) {
        if (this.currentChargeState == newState) {
            logger.debug("skipping chargestate update, state stays at %s", this.currentChargeState);
            return; //NoOp
        }

        logger.info("updating chargeState from %s to %s", this.currentChargeState, newState);
        this.currentChargeState = newState;

        this.update();
    }

    setBatteryState(newState) {
        if (this.currentBatteryState == newState) {
            logger.debug("skipping Batterystate update, state stays at %s", this.currentBatteryState);
            return; //NoOp
        }

        logger.info("updating BatteryState from %s to %s", this.currentBatteryState, newState);
        this.currentBatteryState = newState;

        this.updateTeslaAPI();
    }


    update() {
        if (this.currentChargeState == CHARGE_STATE.IDLE) {
            this.setBatteryState(BATTERY_STATE.STANDBY);
            return;
        }

        if (this.currentChargeState == CHARGE_STATE.CHARGING) {
            switch (this.currentChargeMode) {
                case MODE.MODE_OFF:
                case MODE.MODE_PV:
                    logger.debug("charge mode is %s, setting battery to standby");
                    this.setBatteryState(BATTERY_STATE.STANDBY);
                    break;

                case MODE.MODE_MINPV:
                case MODE.MODE_NOW:
                    logger.debug("charge mode is %s, setting battery to backup only");
                    setBatteryState(BATTERY_STATE.BACKUP);
                    break;
                default:
                    logger.warn("ignoring unknown charge mode '%s'", this.currentChargeMode);
            }
            return;
        }

        logger.warn("ignoring unknown charge state '%s'", this.currentChargeState)

    }

    updateTeslaAPI() {
        logger.warn("TESLA API update not implemented, yet");
    }
}

exports.Handler = Handler;