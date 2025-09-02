"use client"

import { useFeedback } from "@/hooks/use-feedback"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"

interface FeedbackTableProps {
  searchQuery: string
  dateRange: DateRange | undefined
  type: "positive" | "all" | "negative" | "neutral"
}

export function FeedbackList({ searchQuery, dateRange, type }: FeedbackTableProps) {
  const { feedback, publicFeedback, isLoading, isError } = useFeedback()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage =10 

  useEffect(() => {
    if (publicFeedback) {
      console.log(publicFeedback.feedback)
    }
  }, [publicFeedback])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, dateRange, type])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
          <CardDescription>Latest customer feedback and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
          <CardDescription>Latest customer feedback and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Unable to load feedback data</p>
        </CardContent>
      </Card>
    )
  }

  const allFeedback = [...(publicFeedback?.feedback || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  // Apply filtering
  const filteredFeedback = allFeedback.filter((item) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      item.feedback_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.employee &&
        `${item.employee.first_name_en} ${item.employee.last_name_en}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))

    // Date range filter
    let matchesDate = true
    if (dateRange?.from && dateRange?.to) {
      const createdAt = new Date(item.created_at)
      matchesDate = createdAt >= dateRange.from && createdAt <= dateRange.to
    }

    // Type filter
    let matchesType = true
    const satisfaction = item.overall_satisfaction ? Number(item.overall_satisfaction) : null

    if (type === "positive") matchesType = satisfaction !== null && satisfaction >= 4
    else if (type === "neutral") matchesType = satisfaction === 3
    else if (type === "negative") matchesType = satisfaction !== null && satisfaction <= 2
    return matchesSearch && matchesDate && matchesType
  })

  const totalItems = filteredFeedback.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredFeedback.slice(startIndex, endIndex)

  const getRatingStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    )
  }

  const getRatingBadge = (rating: number | null) => {
    if (!rating) return null
    let className = ""
    if (rating >= 4) className = "bg-green-100 text-green-700 border-green-200"
    else if (rating >= 3) className = "bg-yellow-100 text-yellow-700 border-yellow-200"
    else className = "bg-red-100 text-red-700 border-red-200"
    return (
      <Badge variant="outline" className={className}>
        {rating} stars
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Feedback
        </CardTitle>
        <CardDescription>
          Latest customer feedback and comments
          {totalItems > 0 && (
            <span className="ml-2 text-xs">
              ({totalItems} total, showing {startIndex + 1}-{Math.min(endIndex, totalItems)})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No feedback available</p>
          ) : (
            currentItems.map((item, index) => (
              <div key={startIndex + index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {item.phone_number ? item.phone_number.slice(-2) : "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-start gap-4 items-center">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.full_name}</p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(item.created_at), "MMM dd")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.feedback_text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

