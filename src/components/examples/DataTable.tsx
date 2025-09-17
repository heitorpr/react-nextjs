'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { AsyncWrapper } from '../ui';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
}

// Mock API function
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate random errors
  if (Math.random() < 0.15) {
    throw new Error('Unable to load products. Network error occurred.');
  }

  // Return mock data
  return [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      stock: 25,
      status: 'active',
    },
    {
      id: 2,
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 89.99,
      stock: 0,
      status: 'inactive',
    },
    {
      id: 3,
      name: 'Running Shoes',
      category: 'Sports',
      price: 129.99,
      stock: 15,
      status: 'active',
    },
    {
      id: 4,
      name: 'Old Smartphone',
      category: 'Electronics',
      price: 299.99,
      stock: 3,
      status: 'discontinued',
    },
  ];
};

export const DataTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await fetchProducts();
      setProducts(productData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'discontinued':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h2'>
          Products
        </Typography>
        <Button
          variant='contained'
          startIcon={<RefreshIcon />}
          onClick={loadProducts}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>

      <AsyncWrapper
        loading={loading}
        error={error}
        empty={!loading && !error && products.length === 0}
        emptyTitle='No products found'
        emptyDescription='There are no products to display. Add some products to get started.'
        emptyActionLabel='Add Product'
        onEmptyAction={() => {
          // eslint-disable-next-line no-console
          console.log('Add product clicked');
        }}
        onRetry={loadProducts}
        loadingVariant='skeleton'
        minHeight={400}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align='right'>Price</TableCell>
                <TableCell align='right'>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell component='th' scope='row'>
                    {product.name}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align='right'>
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell align='right'>
                    <Chip
                      label={product.stock}
                      color={getStockColor(product.stock) as any}
                      size='small'
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      color={getStatusColor(product.status) as any}
                      size='small'
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton size='small' color='primary'>
                      <EditIcon />
                    </IconButton>
                    <IconButton size='small' color='error'>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AsyncWrapper>
    </Box>
  );
};

export default DataTable;
