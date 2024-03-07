import styled from "styled-components";

const Container = styled.div`
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.3px);
  -webkit-backdrop-filter: blur(8.3px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BtnText = styled.div`
  color: red;
`;
const Button = (props: any) => {
  return (
    <Container>
      <BtnText>{props.text}</BtnText>
    </Container>
  );
};

export default Button;
