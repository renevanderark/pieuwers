/*
const padEvents = initPadEvents();
console.log(padEvents);

Object.keys(padEvents).forEach((cur) => {
  window.addEventListener(`gamepad-${cur}-pressed`, (ev) => {
    console.log(`Controller ${ev.detail.controllerIndex} pressed: ${cur}`)
    console.log(JSON.stringify(controllers[0].buttons.map(b => b.pressed)))
  });
  window.addEventListener(`gamepad-${cur}-released`, (ev) =>
    console.log(`Controller ${ev.detail.controllerIndex} released: ${cur}`));
});
*/
const initPadEvents = (
  onUnmappedButton = (i : string) => console.warn("unmapped button index", i),
  axisMappings :{[key:string] : [string, number]} = {
    "0": ["l-axis", 0],
    "1": ["l-axis", 1],
    "2": ["r-axis", 0],
    "3": ["r-axis", 1],
    "4": ["l-axis", 0],
    "5": ["l-axis", 1],
    "6": ["r-axis", 0],
    "7": ["r-axis", 1]
  },
  defaultMappings = {
    "0": "x",
    "1": "a",
    "2": "b",
    "3": "y",
    "9": "start",
    "8": "select",
    "5": "rt-shoulder",
    "7": "rb-shoulder",
    "4": "lt-shoulder",
    "6": "lb-shoulder",
    "10": "l-axis",
    "11": "r-axis",
    "12": "up",
    "13": "down",
    "14": "left",
    "15": "right"}) => {

  const padEvents : {[key : string] : {pressed:string, released:string}} = [
    "a", "b", "x", "y",
    "start", "select", "up", "down", "left", "right",
    "rt-shoulder", "rb-shoulder",
    "lt-shoulder", "lb-shoulder",
    "l-axis", "r-axis"
  ].reduce((acc : {[key : string] : {pressed:string, released:string}}, cur :string) => {
      acc[cur] = {
        pressed: `gamepad-${cur}-pressed`,
        released: `gamepad-${cur}-released`
      };
      return acc;
  }, {});

  let controllers : {[key:string] : any} = {};
  let keymaps : {[key:string] : {[key:string] : string}}= {};
  let buttonstates : {[key:string] : {[key:string] : boolean}} = {};
  let axisStates : {[key:string] : Array<number> } = {};
  let axisCalibrations : {[key:string] : Array<number> } = {};

  const initButtonStates = (keymap : {[key:string]:string}) : {[key:string] : boolean} =>
    Object.keys(keymap).reduce((acc:  {[key : string] : boolean}, cur : string) => {
      acc[keymap[cur]] = false;
      return acc;
    }, {});

  const roundOffAxisValue = (axis : number) : number =>
    Math.round(axis * 100);

  const calibrateAxisValue = (axis : number, calib : number) : number => {
    if (axis === 1.0) { return 100; }
    if (axis === -1.0) { return -100; }
    const rounded = roundOffAxisValue(axis) - calib;
    if (rounded < 20 && rounded > -20) { return 0; }
    return rounded < 0 ? -50 : 50;
  }

  const registerController = (ev : any) => {
    controllers[ev.gamepad.index] = ev.gamepad;
    keymaps[ev.gamepad.index] = {...defaultMappings};
    buttonstates[ev.gamepad.index] = initButtonStates(keymaps[ev.gamepad.index]);
    axisStates[ev.gamepad.index] = ev.gamepad.axes.map((axis:number) => roundOffAxisValue(axis));
    axisCalibrations[ev.gamepad.index] = [];
  }

  const removeController : (ev : any) => void = ({gamepad}) => {
    delete controllers[gamepad.index];
    delete keymaps[gamepad.index];
    delete buttonstates[gamepad.index];
    delete axisStates[gamepad.index];
    delete axisCalibrations[gamepad.index];
  }

  function dispatchPadEvents() {
    for (let idx in controllers) {
      const controller = controllers[idx];
      if (axisCalibrations[idx].length === 0) {
        axisCalibrations[idx] = controller.axes.map((axis:number) => roundOffAxisValue(axis))
        axisStates[idx] = controller.axes.map((axis : number, j : number) =>
          calibrateAxisValue(axis,  axisCalibrations[idx][j]));
      }


      for (let i in controller.axes) {
        const current = calibrateAxisValue(controller.axes[i],  axisCalibrations[idx][parseInt(i)]);
        if (current !== axisStates[idx][parseInt(i)]) {
          const axName:string = axisMappings[i][0];
          const dir:number = axisMappings[i][1];
          if (dir === 0) {
            window.dispatchEvent(new CustomEvent(
              `gamepad-${axName}-x-change`, { detail: {
                  controllerIndex: idx,
                  force: current,
                  measured: controller.axes[i],
                  rounded: roundOffAxisValue(controller.axes[i])
                }
              })
            );
          } else {
            window.dispatchEvent(new CustomEvent(
              `gamepad-${axName}-y-change`,
                { detail: {
                  controllerIndex: idx,
                  force: current,
                  measured: controller.axes[i],
                  rounded: roundOffAxisValue(controller.axes[i])
                }}
            ));
          }
          axisStates[idx][parseInt(i)] = current;

        }
      }


      for (let i in controller.buttons) {
        const { pressed } = controller.buttons[i];
        const buttonMapping = keymaps[idx][i];

        if (buttonMapping && buttonstates[idx][buttonMapping] !== pressed) {
          buttonstates[idx][buttonMapping] = pressed;
          window.dispatchEvent(new CustomEvent(
            padEvents[buttonMapping][pressed ? "pressed" : "released"],
            {detail: {controllerIndex: idx}}
          ));
        }

        if (onUnmappedButton && pressed && !buttonMapping) {
          onUnmappedButton(i);
        }
      }
    }
    requestAnimationFrame(dispatchPadEvents);
  }

  dispatchPadEvents();

  function scangamepads() {
    var gamepads = (<any>navigator).getGamepads ? (<any>navigator).getGamepads() : ((<any>navigator).webkitGetGamepads ? (<any>navigator).webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (!(gamepads[i].index in controllers)) {
          registerController({gamepad: gamepads[i]});
        }
      }
    }
  }
  const haveEvents = 'ongamepadconnected' in window;
  if (!haveEvents) {
    setInterval(scangamepads, 50);
  }

  window.addEventListener("gamepadconnected", registerController);
  window.addEventListener("gamepaddisconnected", removeController);
  return Object.keys(padEvents)
  .map(x => [`gamepad-${x}-pressed`, `gamepad-${x}-released`])
  .reduce((a,b) => a.concat(b))
  .concat([
    "gamepad-l-axis-x-change", "gamepad-l-axis-y-change",
    "gamepad-r-axis-x-change", "gamepad-r-axis-y-change"
  ]);
}

export { initPadEvents }
