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
        this.currentChargeState = false;
        this.currentBatteryState = 'UNKNOWN';
    }

    toString() {
        return 'currentChargeMode: %s, currentChargeState: %s, currentBatteryState: %s', this.currentChargeMode, this.currentChargeState, this.currentBatteryState;
    }

    setChargeMode(newMode) {
        if (this.currentChargeMode == newMode) {
            logger.trace("skipping chargemode update, mode stays at %s", this.currentChargeMode);
            return; //NoOp
        }

        logger.debug("updating chargemode from %s to %s", this.currentChargeMode, newMode);
        this.currentChargeMode = newMode;

        this.update();
    }

    setCharging(newState) {
        if (this.currentChargeState == newState) {
            logger.trace("skipping chargestate update, state stays at %s", this.currentChargeState);
            return; //NoOp
        }

        logger.debug("updating chargeState from %s to %s", this.currentChargeState, newState);
        this.currentChargeState = newState;

        this.update();
    }

    isCharging() {
        return this.currentChargeState;
    }


    setBatteryState(newState) {
        if (this.currentBatteryState == newState) {
            logger.trace("skipping Batterystate update, state stays at %s", this.currentBatteryState);
            return; //NoOp
        }

        logger.debug("updating BatteryState from %s to %s", this.currentBatteryState, newState);
        this.currentBatteryState = newState;

        this.updateTeslaAPI();
    }


    update() {
        if (this.isCharging() == false) {
            logger.debug("charge state is %s, setting battery to standby", this.isCharging());
            this.setBatteryState(BATTERY_STATE.STANDBY);
            return;
        }

        switch (this.currentChargeMode) {
            case MODE.MODE_OFF:
            case MODE.MODE_PV:
                logger.debug("charge mode is %s, setting battery to standby", this.currentChargeMode);
                this.setBatteryState(BATTERY_STATE.STANDBY);
                break;

            case MODE.MODE_MINPV:
            case MODE.MODE_NOW:
                logger.debug("charge mode is %s, setting battery to backup only", this.currentChargeMode);
                this.setBatteryState(BATTERY_STATE.BACKUP);
                break;
            default:
                logger.warn("ignoring unknown charge mode '%s'", this.currentChargeMode);
                break;
        }
    }

    updateTeslaAPI() {
        logger.warn("TESLA API update not implemented, yet");
    }
}

exports.Handler = Handler;