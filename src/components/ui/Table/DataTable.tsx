'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  Typography,
  SxProps,
  Theme,
  CircularProgress,
} from '@mui/material';

export interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  getValue?: (row: T) => any;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  sx?: SxProps<Theme>;
  stickyHeader?: boolean;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  page = 0,
  pageSize = 10,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortBy,
  sortDirection = 'asc',
  emptyMessage = 'No data available',
  sx,
  stickyHeader = false,
}: DataTableProps<T>) => {
  const handleSort = (columnId: string) => {
    if (!onSort) return;

    const isCurrentSort = sortBy === columnId;
    const newDirection =
      isCurrentSort && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnId, newDirection);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(event.target.value, 10));
    }
  };

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.getValue) {
      return column.getValue(row);
    }
    return row[column.id];
  };

  const renderCell = (row: T, column: Column<T>) => {
    const value = getCellValue(row, column);

    if (column.render) {
      return column.render(value, row);
    }

    return value;
  };

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      <TableContainer sx={{ maxHeight: stickyHeader ? 600 : 'none' }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  <Typography variant='body2' color='text.secondary'>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow hover key={index}>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align}>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalCount !== undefined && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={totalCount}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default DataTable;
