import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, Container, Box, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


// 사용자 정의 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
  },
});

async function fetchGasCost(address) {
  try {
    const response = await axios.get(`http://localhost:8080/api/etherscan/user?address=${address}`);
    return response.data.spendGasUSDT;
  } catch (error) {
    throw new Error('트랜잭션 주소를 찾을 수 없거나 오류가 발생했습니다.');
  }
}

function GasCostDisplay({ isLoading, spendGasUSDT, error }) {
  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (spendGasUSDT !== null) {
    return <p>사용된 가스 비용 (USDT): {spendGasUSDT} USDT</p>;
  }
  return null;
}

function GasCostChecker() {
  const [address, setAddress] = useState('');
  const [spendGasUSDT, setSpendGasUSDT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkGasCost = async () => {
    setIsLoading(true);
    try {
      const gasCost = await fetchGasCost(address);
      setSpendGasUSDT(gasCost);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSpendGasUSDT(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: 20, marginTop: 40 }}>
          <Typography variant="h4" align="center">가스 비용 확인</Typography>
          <TextField 
            type="text" 
            placeholder="계정 주소 입력" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            fullWidth
            margin="normal"
          />
          <Button 
            onClick={checkGasCost} 
            disabled={isLoading || !address}
            variant="contained"
            color="primary"
            style={{ display: 'block', margin: '20px auto' }}
          >
            확인
          </Button>
          <GasCostDisplay isLoading={isLoading} spendGasUSDT={spendGasUSDT} error={error} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default GasCostChecker;