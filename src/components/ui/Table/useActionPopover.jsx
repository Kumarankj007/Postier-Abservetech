import React, { useState, useMemo, useCallback } from "react";
import Icon from "@components/ui/Icon";
import { Transition } from "@headlessui/react";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
} from "@floating-ui/react";
const iconMapper = {
  edit: "heroicons:pencil-square",
  delete: "heroicons-outline:trash",
};
const useActionPopover = ({ actions }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: Boolean(open),
    placement: "bottom-end",
    onOpenChange: setOpen,
    middleware: [offset({ mainAxis: 10 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
    click,
  ]);

  const handleOpen = (id) => (e) => {
    refs.setReference(e.target);
    if (id) {
      setOpen(id);
    } else {
      setOpen(true);
    }
  };

  const ActionPopover = useMemo(
    () =>
      open ? (
        <div
          {...getFloatingProps()}
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <Transition
            show={Boolean(open)}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {actions.map((item, i) => (
              <button
                key={i}
                data-id={typeof open === "string" ? open : JSON.stringify(open)}
                onClick={(e) => {
                  item.doit?.(e);
                  setOpen(false);
                }}
                className={`
            border
              ${
                item.name === "delete"
                  ? "bg-danger-200 text-danger-500 hover:bg-danger-500 hover:text-white"
                  : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
              }
               w-full border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
               first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
              >
                <span className="text-base pointer-events-none">
                  <Icon icon={iconMapper[item.name]} />
                </span>
                <span className="pointer-events-none">{item.name}</span>
              </button>
            ))}
          </Transition>
        </div>
      ) : null,
    [floatingStyles, open]
  );

  const ActionElement = useCallback(
    (id, groupId) => {
      //data-id={id.data_id} data-group={id.data_groupid}
      return (
        <button {...getReferenceProps()} onClick={handleOpen(id)}>
          <Icon
            icon="heroicons-outline:dots-vertical"
            className="pointer-events-none"
          />
        </button>
      );
    },
    [getReferenceProps]
  );

  return { setOpen, ActionPopover, ActionElement };
};

export default useActionPopover;
