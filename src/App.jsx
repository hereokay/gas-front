import React, { useState } from 'react';
import axios from 'axios';

function GasCostChecker() {
  const [address, setAddress] = useState('');
  const [spendGasUSDT, setSpendGasUSDT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkGasCost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 백엔드 엔드포인트로 요청을 보냅니다.
      const response = await axios.get(`http://localhost:8080/api/etherscan/onlyGasUSDT?address=${address}`);
      console.log(response.data); // 전체 응답 구조 확인
      console.log(typeof response.data.spendGasUSDT); // spendGasUSDT 필드의 타입 확인
      setSpendGasUSDT(response.data); // 응답 구조에 따라 접근해야 할 프로퍼티를 확인하세요.
    } catch (error) {
      setError('트랜잭션 주소를 찾을 수 없거나 오류가 발생했습니다.');
      setSpendGasUSDT(null); // 오류 발생 시 spendGasUSDT 초기화
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>가스 비용 확인</h1>
      <input
        type="text"
        placeholder="트랜잭션 주소 입력"
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
