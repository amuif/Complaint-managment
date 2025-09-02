"use client"

import { useRatings } from "@/hooks/use-ratings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { format, parseISO, isWithinInterval } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useState, useEffect } from "react"

interface RatingsTableProps {
  searchQuery: string
  dateRange: DateRange | undefined
}

export function RatingsTable({ searchQuery, dateRange }: RatingsTableProps) {
  const { ratings, publicRatings, isLoading, isError } = useRatings()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, dateRange])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Ratings
          </CardTitle>
          <CardDescription>Latest service ratings from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
            <Award className="h-5 w-5" />
            Recent Ratings
          </CardTitle>
          <CardDescription>Latest service ratings from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Unable to load ratings data</p>
        </CardContent>
      </Card>
    )
  }

  // Combine both rating sources
  const allRatings = [...(ratings || []), ...(publicRatings || [])]

  // Filter ratings based on searchQuery and dateRange
  const filteredRatings = allRatings
    .filter((rating) => {
      // Search filter: Match phone_number or employee_name
      const searchLower = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !searchQuery ||
        rating.phone_number?.toLowerCase().includes(searchLower) ||
        rating.Employee?.first_name_en?.toLowerCase().includes(searchLower)

      // Date range filter
      let matchesDate = true
      if (dateRange?.from && dateRange?.to) {
        try {
          const ratingDate = parseISO(rating.created_at)
          matchesDate = isWithinInterval(ratingDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        } catch (error) {
          console.error("Invalid date format for rating:", rating.created_at)
          matchesDate = false
        }
      } else if (dateRange?.from) {
        // If only "from" date is provided, filter ratings on or after that date
        try {
          const ratingDate = parseISO(rating.created_at)
          matchesDate = ratingDate >= dateRange.from
        } catch (error) {
          console.error("Invalid date format for rating:", rating.created_at)
          matchesDate = false
        }
      } else if (dateRange?.to) {
        // If only "to" date is provided, filter ratings on or before that date
        try {
          const ratingDate = parseISO(rating.created_at)
          matchesDate = ratingDate <= dateRange.to
        } catch (error) {
          console.error("Invalid date format for rating:", rating.created_at)
          matchesDate = false
        }
      }

      return matchesSearch && matchesDate
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const totalItems = filteredRatings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredRatings.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getAverageRating = (courtesy: number, punctuality: number, knowledge: number) => {
    return ((courtesy + punctuality + knowledge) / 3).toFixed(1)
  }

  const getAverageRatingBadge = (courtesy: number, timeliness: number, knowledge: number) => {
    const avg = (courtesy + timeliness + knowledge) / 3
    let className = ""

    if (avg >= 4) {
      className = "bg-green-100 text-green-700 border-green-200"
    } else if (avg >= 3) {
      className = "bg-yellow-100 text-yellow-700 border-yellow-200"
    } else {
      className = "bg-red-100 text-red-700 border-red-200"
    }

    return (
      <Badge variant="outline" className={className}>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {avg.toFixed(1)}
        </div>
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Ratings
        </CardTitle>
        <CardDescription>
          {totalItems > 0
            ? `Showing ${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems} ratings`
            : "Latest service ratings from customers"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No ratings match the current filters</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-muted text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Contact</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Director</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Courtesy</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Punctuality</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Knowledge</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Average</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((rating, idx) => (
                    <tr
                      key={rating.id}
                      className={`border-b last:border-0 transition-colors ${
                        idx % 2 === 0 ? "bg-background" : "bg-muted/50"
                      } hover:bg-primary/5`}
                    >
                      <td className="px-3 py-2 font-medium flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{rating.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{rating.full_name}</span>
                      </td>
                      <td className="px-3 py-2 text-xs">{rating.division?.name_en || "Unknown"}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(rating.courtesy)}
                          <span className="text-xs ml-1">({rating.courtesy})</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(rating.punctuality)}
                          <span className="text-xs ml-1">({rating.punctuality})</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(rating.knowledge)}
                          <span className="text-xs ml-1">({rating.knowledge})</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {getAverageRatingBadge(rating.courtesy, rating.punctuality, rating.knowledge)}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {format(parseISO(rating.created_at), "MMM dd")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                      <Button
                        key={index}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => typeof page === "number" && goToPage(page)}
                        disabled={page === "..."}
                        className="min-w-[2rem]"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

