import React, { useState } from 'react';
import axios from 'axios';

function GasCostChecker() {
  const [address, setAddress] = useState('');
  const [spendGasUSDT, setSpendGasUSDT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkGasCost = async () => {
    const startTime = performance.now(); // 시간 측정 시작
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/etherscan/user?address=${address}`);
      const roundedSpendGasUSDT = parseFloat(response.data.spendGasUSDT.toFixed(2));
      setSpendGasUSDT(roundedSpendGasUSDT);
    } catch (error) {
      setError('트랜잭션 주소를 찾을 수 없거나 오류가 발생했습니다.');
      setSpendGasUSDT(null);
    } finally {
      setIsLoading(false);
      const endTime = performance.now(); // 시간 측정 종료
      console.log(`처리 시간: ${endTime - startTime} 밀리초`); // 콘솔에 시간 차이 출력
    }
  };

  return (
    <div>
      <h1>가스 비용 확인</h1>
      <input
        type="text"
        placeholder="계정 주소 입력"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={checkGasCost} disabled={isLoading || !address}>
        확인
      </button>
      {isLoading && <p>로딩 중...</p>}
      {spendGasUSDT !== null && <p>사용된 가스 비용 (USDT): {spendGasUSDT} USDT</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default GasCostChecker;
