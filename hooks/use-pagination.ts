import { useState, useMemo } from "react"

interface UsePaginationProps {
  totalItems: number
  initialItemsPerPage?: number
}

export function usePagination({ totalItems, initialItemsPerPage = 10 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const paginationInfo = useMemo(() => ({
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    totalItems,
    itemsPerPage,
  }), [currentPage, totalPages, startIndex, endIndex, totalItems, itemsPerPage])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)))
  }

  const nextPage = () => goToPage(currentPage + 1)
  const previousPage = () => goToPage(currentPage - 1)

  const reset = () => setCurrentPage(1)

  return {
    ...paginationInfo,
    setCurrentPage,
    setItemsPerPage: (perPage: number) => {
      setItemsPerPage(perPage)
      setCurrentPage(1)
    },
    goToPage,
    nextPage,
    previousPage,
    reset,
  }
}
