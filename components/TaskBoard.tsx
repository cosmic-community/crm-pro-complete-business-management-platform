'use client'

import { useState, useEffect } from 'react'
import { 
  DndContext, 
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react'
import { Task, User as UserType } from '@/types'

interface TaskBoardProps {
  tasks: Task[]
  users: UserType[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onCreateTask: (task: Omit<Task, 'id'>) => void
}

interface TaskCardProps {
  task: Task
  users: UserType[]
  onUpdate: (updates: Partial<Task>) => void
}

function TaskCard({ task, users, onUpdate }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const assignedUser = users.find(user => user.id === task.metadata?.assigned_to?.id)
  const priorityValue = task.metadata?.priority?.value || 'Medium'
  const priorityColor: Record<string, string> = {
    High: 'text-red-600 bg-red-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Low: 'text-green-600 bg-green-50'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor[priorityValue]}`}>
          {priorityValue}
        </span>
      </div>
      
      {task.metadata?.description && (
        <div 
          className="text-sm text-gray-600 mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: task.metadata.description }}
        />
      )}

      <div className="space-y-2">
        {task.metadata?.due_date && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(task.metadata.due_date).toLocaleDateString()}
          </div>
        )}
        
        {assignedUser && (
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2" />
            {assignedUser.metadata?.first_name || assignedUser.first_name} {assignedUser.metadata?.last_name || assignedUser.last_name}
          </div>
        )}

        {task.metadata?.category && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
            {task.metadata.category.value}
          </div>
        )}
      </div>
    </div>
  )
}

interface ColumnProps {
  id: string
  title: string
  tasks: Task[]
  users: UserType[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  icon: React.ReactNode
  color: string
}

function Column({ id, title, tasks, users, onUpdateTask, icon, color }: ColumnProps) {
  const taskIds = tasks.map(task => task.id)

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${color} mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{tasks.length} tasks</p>
          </div>
        </div>
      </div>
      
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function TaskBoard({ tasks, users, onUpdateTask, onCreateTask }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [boardTasks, setBoardTasks] = useState(tasks)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setBoardTasks(tasks)
  }, [tasks])

  const columns = [
    {
      id: 'open',
      title: 'To Do',
      icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <User className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: 'bg-green-100'
    }
  ]

  const getTasksByStatus = (status: string) => {
    return boardTasks.filter(task => task.metadata?.status?.key === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeTask = boardTasks.find(task => task.id === active.id)
    if (!activeTask) return

    // Find which column the task was dropped into
    const overContainer = over.data?.current?.sortable?.containerId || over.id
    const newStatus = overContainer as string

    if (activeTask.metadata?.status?.key !== newStatus) {
      const statusMap: Record<string, { key: string; value: string }> = {
        'open': { key: 'open', value: 'Open' },
        'in_progress': { key: 'in_progress', value: 'In Progress' },
        'completed': { key: 'completed', value: 'Completed' }
      }

      const newStatusValue = statusMap[newStatus]
      if (activeTask.metadata && newStatusValue) {
        onUpdateTask(activeTask.id, {
          metadata: {
            ...activeTask.metadata,
            status: newStatusValue
          }
        })
      }
    }

    setActiveId(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeTask = boardTasks.find(task => task.id === active.id)
    if (!activeTask) return

    const overContainer = over.data?.current?.sortable?.containerId || over.id
    const activeContainer = activeTask.metadata?.status?.key

    if (activeContainer !== overContainer) {
      setBoardTasks(prevTasks => {
        const activeIndex = prevTasks.findIndex(task => task.id === active.id)
        
        if (activeIndex !== -1) {
          const updatedTasks = [...prevTasks]
          const statusMap: Record<string, { key: string; value: string }> = {
            'open': { key: 'open', value: 'Open' },
            'in_progress': { key: 'in_progress', value: 'In Progress' },
            'completed': { key: 'completed', value: 'Completed' }
          }

          const newStatusValue = statusMap[overContainer as string]
          if (updatedTasks[activeIndex] && updatedTasks[activeIndex].metadata && newStatusValue) {
            updatedTasks[activeIndex] = {
              ...updatedTasks[activeIndex],
              id: updatedTasks[activeIndex].id,
              metadata: {
                ...updatedTasks[activeIndex].metadata!,
                status: newStatusValue
              }
            }
          }

          return updatedTasks
        }

        return prevTasks
      })
    }
  }

  const activeTask = activeId ? boardTasks.find(task => task.id === activeId) : null

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
        <button
          onClick={() => {/* Handle create task */}}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              users={users}
              onUpdateTask={onUpdateTask}
              icon={column.icon}
              color={column.color}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-lg border p-4 shadow-lg opacity-90 rotate-3">
              <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}