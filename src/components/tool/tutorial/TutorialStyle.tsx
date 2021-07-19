import styled from '@emotion/styled';

export const TutorialContainer = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  h4 {
    margin-bottom: 1em;
  }
`;

export const BadgesItem = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.color.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: ${({ theme }) => theme.color.white};
    font-size: 15px;
  }
`;

export const Descriptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const BadgeNumber = ({ count }: { count: number }) => {
  return (
    <BadgesItem>
      <span>{count}</span>
    </BadgesItem>
  );
};
