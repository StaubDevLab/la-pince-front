'use client'
import * as React from 'react'
import { BellIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Notification } from '@/types/notifications'
import { getNotifications, markAsReadNotifications } from '@/actions/notifications.actions'
import { formatRelativeDate } from '@/lib/utils'

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 })
  const [totalCount, setTotalCount] = React.useState(0)
  const [showReadedNotifs, setShowReadedNotifs] = React.useState(false)

  const typeColor: Record<string, string> = {
    info: 'text-sky-500',
    warning: 'text-yellow-500',
    error: 'text-rose-500',
  }

  const fetchNotifications = () => {
    getNotifications(pagination.pageSize, pagination.pageIndex, showReadedNotifs).then((notifications) => {
      if (notifications.success && notifications.data) {
        setNotifications(notifications.data.data)
        setTotalCount(notifications.data.total || notifications.data.data.length || 0)
      } else {
        setNotifications([])
        setTotalCount(0)
      }
    })
  }

  React.useEffect(() => {
    fetchNotifications()
  }, [pagination.pageIndex, pagination.pageSize, showReadedNotifs, setShowReadedNotifs])

  React.useEffect(() => {
    const unreadIds = notifications
      .filter((notif) => !notif.isRead)
      .map((notif) => notif.id)

    if (unreadIds.length && !showReadedNotifs) {
      markAsReadNotifications(unreadIds)
    }
  }, [notifications, showReadedNotifs])


  return (
    <div className="flex items-center justify-center w-full flex-grow">
      <main className="max-w-4xl w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-unread" className="text-sm text-muted-foreground">
              Afficher les notifications lues
            </Label>
            <Switch
              id="show-unread"
              checked={showReadedNotifs}
              onCheckedChange={(value) => setShowReadedNotifs(value)}
            />
          </div>
        </div>

        {notifications.length ? (
          <div className="flex flex-col gap-4">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`mt-1`}>
                  <BellIcon className={`w-5 h-5 ${typeColor[notif.level]}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeDate(notif.createdAt.toString())}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
            ))}

            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (pagination.pageIndex > 0) {
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex - 1,
                        }))
                      }
                    }}
                    className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {[...Array(Math.ceil(totalCount / pagination.pageSize)).keys()].map((key) => (
                  <PaginationItem key={key}>
                    <PaginationLink
                      isActive={pagination.pageIndex === key}
                      onClick={(e) => {
                        e.preventDefault()
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: key,
                        }))
                      }}
                    >
                      {key + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      const maxPage = Math.ceil(totalCount / pagination.pageSize) - 1
                      if (pagination.pageIndex < maxPage) {
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex + 1,
                        }))
                      }
                    }}
                    className={
                      pagination.pageIndex >= Math.ceil(totalCount / pagination.pageSize) - 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : (
          <h1 className="text-center text-muted-foreground text-lg">Aucune notification</h1>
        )}
      </main>
    </div>
  )
}
