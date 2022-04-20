import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings({ name, setEnabled, enabled }) {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch.Label as="span" className="mr-2">
        <span className="text-xs font-medium text-slate-500">
          {name}
        </span>
      </Switch.Label>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-4 w-8 cursor-pointer"
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bg-slate-800 w-full h-full rounded-md"
        />
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "bg-slate-800 border-2 border-orange-600" : "bg-slate-900",
            "pointer-events-none absolute h-4 w-8 mx-auto rounded-full transition-colors ease-in-out duration-200"
          )}
        />
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none absolute left-0 inline-block h-4 w-4 border border-slate-200 rounded-full bg-slate-800 shadow transform ring-0 transition-transform ease-in-out duration-200"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
