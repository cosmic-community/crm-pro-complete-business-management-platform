import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
)

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-gray-50', className)}
      {...props}
    />
  )
)

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('bg-white divide-y divide-gray-200', className)}
      {...props}
    />
  )
)

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('bg-gray-50 font-medium', className)}
      {...props}
    />
  )
)

const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('hover:bg-gray-50', className)}
      {...props}
    />
  )
)

const TableHead = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}
      {...props}
    />
  )
)

const TableCell = forwardRef<HTMLTableCellElement, HTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}
      {...props}
    />
  )
)

Table.displayName = 'Table'
TableHeader.displayName = 'TableHeader'
TableBody.displayName = 'TableBody'
TableFooter.displayName = 'TableFooter'
TableHead.displayName = 'TableHead'
TableRow.displayName = 'TableRow'
TableCell.displayName = 'TableCell'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
}