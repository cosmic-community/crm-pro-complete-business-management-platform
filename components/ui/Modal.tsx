'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl'
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  maxWidth = 'md' 
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${maxWidthClasses[maxWidth]} transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {title && (
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="text-sm text-gray-500 mt-1">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}