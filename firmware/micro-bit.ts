const DEBOUNCE_MIN_SIGNALS = 32
const DATA_SEND_INTERVAL = 2000000 // us

// Enable BT
bluetooth.startUartService()

bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
})

bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})

// RPM counting
function displayCounter(counter: number) {
    basic.showNumber(counter % 10, 0)
}
input.onButtonPressed(Button.A, () => counter = 0)
input.onButtonPressed(Button.B, function () {
    basic.showNumber(counter)  
})

/* Main */
basic.showNumber(input.temperature(), 40)

let counter = 0
let summaryCounter = 0
let lastUpdateTimestamp = 0
let prevTime = 0
let prevPin = 0
while (true) {
    const pinValue = pins.digitalReadPin(DigitalPin.P0);
    const timestamp = input.runningTimeMicros();
    // const delta = timestamp - prevTime
    const intervalDelta = timestamp - lastUpdateTimestamp;

    // interval data sending
    if (intervalDelta >= DATA_SEND_INTERVAL) {
        bluetooth.uartWriteLine(`Count:${summaryCounter}`)
        bluetooth.uartWriteLine(`Temp:${input.temperature()}`)
        lastUpdateTimestamp = timestamp
        // displayCounter(summaryCounter)
        summaryCounter = 0
    }

    // data send every sensed rotation
    if (prevPin == pinValue) {
        counter++
    } else {
        if (counter > DEBOUNCE_MIN_SIGNALS) {
            // const timestamp = input.runningTimeMicros()
            const delta = timestamp - prevTime

            if (prevPin == 1) {
                bluetooth.uartWriteLine(`Delta:${delta}`)
                summaryCounter += 1
                displayCounter(summaryCounter)
                basic.showNumber(1, 0)
            }

            counter = 1
            prevTime = timestamp
        }
        prevPin = pinValue
    }
}
