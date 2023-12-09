import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, Container, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './GasCostChecker.css'; // CSS 파일 임포트

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

const IP = "http://3.38.76.157:8080";

async function fetchUser(address) {
  try {
    const response = await axios.get(IP+`/user?address=${address}`);
    return response.data;
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

function RankingDisplay({ isLoading, ranking, error }) {
  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (ranking !== null) {
    return <p>Rank : {ranking}</p>;
  }
  return null;
}

function GasCostChecker() {
  const [address, setAddress] = useState('');
  const [spendGasUSDT, setSpendGasUSDT] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkGasCost = async () => {
    setIsLoading(true);
    try {
      let user = await fetchUser(address);
      let gasCost = user.spendGasUSDT;
      let ranking = user.ranking;

      gasCost = parseFloat(gasCost.toFixed(2)); // 소수점 두 자리로 줄임
      setSpendGasUSDT(gasCost);
      setRanking(ranking);
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
          <RankingDisplay isLoading={isLoading} ranking={ranking} error={error} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
  
}

export default GasCostChecker;
