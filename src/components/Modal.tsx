import { useState } from 'react'
import { Dialog } from '@headlessui/react'

function Modal({open, setOpen}: {open: boolean; setOpen: any}) {
  return (
    <Dialog open={open} onClose={() => {setOpen(false)}}>
      <Dialog.Panel>
        <Dialog.Title>Deactivate account</Dialog.Title>
        <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description>

        <p>
          Are you sure you want to deactivate your account? All of your data
          will be permanently removed. This action cannot be undone.
        </p>

        <button onClick={() => {setOpen(false)}}>Deactivate</button>
        <button onClick={() => {setOpen(false)}}>Cancel</button>
      </Dialog.Panel>
    </Dialog>
  )
}

export default Modal
