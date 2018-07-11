type ScaledEventListener = (ev : Event) => (ev : Event, scale : number) => any;

interface ScaledEventRegistryEntry {
  elem: HTMLElement|Window,
  eventName: string,
  fn : ScaledEventListener
};

export default function() {
	let scale : number;
	let registered : Array<ScaledEventRegistryEntry> = [];

	return {
		onResize(s : number) {
			scale = s;
		},
		add(eventName : string, onEvent : (ev : Event, scale : number) => any, elem : HTMLElement|Window = window) {
			const fn : ScaledEventListener = (ev : Event) => onEvent(ev, scale);

			registered.push({
				elem: elem,
				eventName: eventName,
				fn: fn
			});

			elem.addEventListener(eventName, fn);
		},
		clear() {
			registered.forEach(({elem, eventName, fn}) =>
				elem.removeEventListener(eventName, fn)
			)
		}
	}
};
