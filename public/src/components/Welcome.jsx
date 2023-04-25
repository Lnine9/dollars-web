import React from "react";
import styled from "styled-components";
export default function Welcome({username}) {
  return (
    <Container>
      <h1>
        Welcome, <span>{username}!</span>
      </h1>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    font-size: 36px;
    transform: translateY(-100px);
  }
  span {
    color: var(--c0);
  }
`;
