import { useState } from 'react'
import { Dialog } from '@headlessui/react'

function Modal({open, setOpen}: {open: boolean; setOpen: any}) {
  return (
    <Dialog open={open} onClose={() => {setOpen(false)}}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-indigo-800">
      <Dialog.Panel>
        <Dialog.Title>Do Modal Stuff</Dialog.Title>
        <Dialog.Description>
          This modal will let you do modal things
        </Dialog.Description>

        <p>
          Lorem ipsum blah how cool are modals tho
        </p>

        <button onClick={() => {setOpen(false)}}>Do a thing</button>
        <button onClick={() => {setOpen(false)}}>Woah hold up</button>
      </Dialog.Panel>
    </Dialog>
  )
}

export default Modal
