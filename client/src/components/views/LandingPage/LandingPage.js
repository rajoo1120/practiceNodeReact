import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  let navigate = useNavigate();
  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response=> {
      console.log(response.data)
      if(response.data.success){
        navigate('/login');
      }
      else{
        alert('failed to logout')
      }
    })
  }
  return (
    <div style={{display: 'flex', justifyContent:'center', alignItems:'center', width:'100%', height: '100vh'}}>
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>
        로그아웃
      </button>
    </div>
  )
}

export default LandingPage
